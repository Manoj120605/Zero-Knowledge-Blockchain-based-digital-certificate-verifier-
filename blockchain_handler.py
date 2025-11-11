from web3 import Web3
import json
import hashlib
from datetime import datetime
import os

class BlockchainHandler:
    """
    Handles all blockchain interactions for the Certificate Verifier system.
    Connects to Ganache and interacts with the deployed smart contract.
    """

    def __init__(self, provider_url="http://127.0.0.1:7545", contract_address=None, contract_abi_path=None):
        """
        Initialize connection to Ganache blockchain

        Args:
            provider_url: URL of the Ganache RPC server (default: http://127.0.0.1:7545)
            contract_address: Address of the deployed contract
            contract_abi_path: Path to the contract ABI JSON file
        """
        self.web3 = Web3(Web3.HTTPProvider(provider_url))

        # Check connection
        if not self.web3.is_connected():
            raise Exception(f"Failed to connect to Ganache at {provider_url}")

        print(f"✓ Connected to Ganache blockchain")
        print(f"  Chain ID: {self.web3.eth.chain_id}")
        print(f"  Latest Block: {self.web3.eth.block_number}")

        # Set default account (first account from Ganache)
        self.web3.eth.default_account = self.web3.eth.accounts[0]
        self.account = self.web3.eth.accounts[0]

        # Load contract if address and ABI provided
        self.contract = None
        self.contract_address = contract_address

        if contract_address and contract_abi_path:
            self.load_contract(contract_address, contract_abi_path)

    def load_contract(self, contract_address, contract_abi_path):
        """Load the smart contract using address and ABI"""
        try:
            with open(contract_abi_path, 'r') as f:
                contract_abi = json.load(f)

            self.contract_address = Web3.to_checksum_address(contract_address)
            self.contract = self.web3.eth.contract(
                address=self.contract_address,
                abi=contract_abi
            )
            print(f"✓ Contract loaded at address: {self.contract_address}")
            return True
        except Exception as e:
            print(f"✗ Error loading contract: {str(e)}")
            return False

    def deploy_contract(self, contract_json_path, contract_name="CertificateVerifier"):
        """
        Deploy the smart contract to Ganache

        Args:
            contract_json_path: Path to the compiled contract JSON file
            contract_name: Name of the contract

        Returns:
            Contract address if successful, None otherwise
        """
        try:
            # Read compiled contract
            with open(contract_json_path, 'r') as f:
                compiled_contract = json.load(f)

            # Get bytecode and ABI
            bytecode = compiled_contract['bytecode']
            abi = compiled_contract['abi']

            # Create contract instance
            Contract = self.web3.eth.contract(abi=abi, bytecode=bytecode)

            # Build transaction
            print("Deploying contract...")
            tx_hash = Contract.constructor().transact({
                'from': self.account,
                'gas': 3000000
            })

            # Wait for transaction receipt
            tx_receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)

            self.contract_address = tx_receipt.contractAddress
            self.contract = self.web3.eth.contract(
                address=self.contract_address,
                abi=abi
            )

            print(f"✓ Contract deployed successfully!")
            print(f"  Contract Address: {self.contract_address}")
            print(f"  Transaction Hash: {tx_hash.hex()}")
            print(f"  Gas Used: {tx_receipt.gasUsed}")

            # Save contract address and ABI for future use
            contract_info = {
                'address': self.contract_address,
                'abi': abi,
                'deployment_block': tx_receipt.blockNumber,
                'deployment_time': datetime.now().isoformat()
            }

            with open('deployed_contract.json', 'w') as f:
                json.dump(contract_info, f, indent=2)

            return self.contract_address

        except Exception as e:
            print(f"✗ Error deploying contract: {str(e)}")
            return None

    def generate_certificate_hash(self, file_data):
        """
        Generate SHA-256 hash of certificate file

        Args:
            file_data: Binary data of the certificate file

        Returns:
            Hex string of the hash
        """
        return hashlib.sha256(file_data).hexdigest()

    def store_certificate(self, cert_id, cert_hash, holder_name, cert_type, institution, issue_date):
        """
        Store certificate on blockchain

        Args:
            cert_id: Unique certificate identifier
            cert_hash: SHA-256 hash of the certificate
            holder_name: Name of certificate holder
            cert_type: Type of certificate
            institution: Issuing institution
            issue_date: Issue date (Unix timestamp)

        Returns:
            Transaction receipt if successful, None otherwise
        """
        if not self.contract:
            print("✗ Contract not loaded. Please deploy or load contract first.")
            return None

        try:
            # Check if certificate already exists
            exists = self.contract.functions.certificateExists(cert_id).call()
            if exists:
                print(f"✗ Certificate with ID {cert_id} already exists on blockchain")
                return None

            # Build transaction
            print(f"Storing certificate {cert_id} on blockchain...")
            tx_hash = self.contract.functions.storeCertificate(
                cert_id,
                cert_hash,
                holder_name,
                cert_type,
                institution,
                issue_date
            ).transact({
                'from': self.account,
                'gas': 500000
            })

            # Wait for transaction to be mined
            tx_receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)

            print(f"✓ Certificate stored successfully!")
            print(f"  Transaction Hash: {tx_hash.hex()}")
            print(f"  Block Number: {tx_receipt.blockNumber}")
            print(f"  Gas Used: {tx_receipt.gasUsed}")

            return tx_receipt

        except Exception as e:
            print(f"✗ Error storing certificate: {str(e)}")
            return None

    def verify_certificate_by_id(self, cert_id):
        """
        Verify certificate by ID

        Args:
            cert_id: Certificate ID to verify

        Returns:
            Dictionary with certificate details if found, None otherwise
        """
        if not self.contract:
            print("✗ Contract not loaded")
            return None

        try:
            result = self.contract.functions.verifyCertificateById(cert_id).call()

            if not result[0]:  # exists flag
                print(f"✗ Certificate {cert_id} not found on blockchain")
                return None

            cert_data = {
                'exists': result[0],
                'certificateHash': result[1],
                'holderName': result[2],
                'certificateType': result[3],
                'institution': result[4],
                'issueDate': result[5],
                'timestamp': result[6],
                'issuer': result[7],
                'verified': True
            }

            print(f"✓ Certificate verified successfully!")
            print(f"  Holder: {cert_data['holderName']}")
            print(f"  Type: {cert_data['certificateType']}")
            print(f"  Institution: {cert_data['institution']}")

            return cert_data

        except Exception as e:
            print(f"✗ Error verifying certificate: {str(e)}")
            return None

    def verify_certificate_by_hash(self, cert_hash):
        """
        Verify certificate by hash

        Args:
            cert_hash: Certificate hash to verify

        Returns:
            Dictionary with certificate details if found, None otherwise
        """
        if not self.contract:
            print("✗ Contract not loaded")
            return None

        try:
            result = self.contract.functions.verifyCertificateByHash(cert_hash).call()

            if not result[0]:  # exists flag
                print(f"✗ Certificate with hash {cert_hash[:16]}... not found")
                return None

            cert_data = {
                'exists': result[0],
                'certificateId': result[1],
                'holderName': result[2],
                'certificateType': result[3],
                'institution': result[4],
                'verified': True
            }

            print(f"✓ Certificate verified by hash!")
            print(f"  Certificate ID: {cert_data['certificateId']}")
            print(f"  Holder: {cert_data['holderName']}")

            return cert_data

        except Exception as e:
            print(f"✗ Error verifying certificate by hash: {str(e)}")
            return None

    def get_all_certificates(self):
        """
        Get all certificates from blockchain

        Returns:
            List of certificate dictionaries
        """
        if not self.contract:
            print("✗ Contract not loaded")
            return []

        try:
            count = self.contract.functions.getCertificateCount().call()
            certificates = []

            for i in range(count):
                result = self.contract.functions.getCertificateByIndex(i).call()
                cert = {
                    'certificateId': result[0],
                    'holderName': result[1],
                    'certificateType': result[2],
                    'institution': result[3],
                    'issueDate': result[4]
                }
                certificates.append(cert)

            print(f"✓ Retrieved {count} certificates from blockchain")
            return certificates

        except Exception as e:
            print(f"✗ Error retrieving certificates: {str(e)}")
            return []

    def get_account_balance(self, account=None):
        """Get ETH balance of an account"""
        if account is None:
            account = self.account
        balance_wei = self.web3.eth.get_balance(account)
        balance_eth = self.web3.from_wei(balance_wei, 'ether')
        return float(balance_eth)

    def get_blockchain_info(self):
        """Get general blockchain information"""
        return {
            'connected': self.web3.is_connected(),
            'chainId': self.web3.eth.chain_id,
            'latestBlock': self.web3.eth.block_number,
            'accounts': self.web3.eth.accounts,
            'defaultAccount': self.account,
            'balance': self.get_account_balance()
        }


# Example usage
if __name__ == "__main__":
    # Initialize blockchain handler
    handler = BlockchainHandler()

    # Print blockchain info
    info = handler.get_blockchain_info()
    print("\nBlockchain Info:")
    print(f"  Connected: {info['connected']}")
    print(f"  Chain ID: {info['chainId']}")
    print(f"  Latest Block: {info['latestBlock']}")
    print(f"  Default Account: {info['defaultAccount']}")
    print(f"  Balance: {info['balance']} ETH")
