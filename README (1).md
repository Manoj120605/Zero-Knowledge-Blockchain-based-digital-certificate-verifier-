# ZKP Certificate Verifier - Blockchain Backend

A complete blockchain-based certificate verification system using Ethereum, Hardhat, Ganache, and Python.

## 🎯 Features

- **Blockchain Storage**: Immutable certificate storage on Ethereum blockchain
- **Smart Contract**: Solidity smart contract for certificate management
- **Python Backend**: Flask API for blockchain interaction
- **Zero-Knowledge Proofs**: Privacy-preserving certificate verification
- **Easy Setup**: Simple deployment with Hardhat and Ganache

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://python.org/)
- **Ganache** - [Download](https://archive.trufflesuite.com/ganache/)
- **Git** (optional)

## 🚀 Quick Setup Guide

### Step 1: Install Ganache

1. Download and install Ganache from the link above
2. Open Ganache and click **QUICKSTART ETHEREUM**
3. Ganache will start a local blockchain at `http://127.0.0.1:7545`
4. Note down the RPC Server address (should be `HTTP://127.0.0.1:7545`)

### Step 2: Install Node.js Dependencies

```bash
# Install Hardhat and dependencies
npm install

# This installs:
# - hardhat
# - @nomicfoundation/hardhat-toolbox
# - ethers
# - And other required packages
```

### Step 3: Install Python Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Setup Project Structure

Create the following folder structure:

```
zkp-certificate-verifier/
├── contracts/
│   └── CertificateVerifier.sol
├── scripts/
│   └── deploy.js
├── deployments/
├── uploads/
├── hardhat.config.js
├── package.json
├── requirements.txt
├── blockchain_handler.py
├── app.py
├── index.html
├── style.css
└── web3_integration.js
```

Move the files to appropriate folders:
- Move `CertificateVerifier.sol` to `contracts/` folder
- Move `deploy.js` to `scripts/` folder

### Step 5: Compile Smart Contract

```bash
# Compile the Solidity contract
npx hardhat compile

# You should see:
# ✓ Compiled 1 Solidity file successfully
```

### Step 6: Deploy Smart Contract to Ganache

Make sure Ganache is running, then:

```bash
# Deploy to Ganache
npm run deploy

# Or directly:
npx hardhat run scripts/deploy.js --network ganache

# Expected output:
# 🚀 Starting deployment...
# ✅ Contract deployed successfully!
# 📍 Contract Address: 0x...
# 📄 Contract info saved to: deployments/CertificateVerifier.json
```

The deployment script will:
- Deploy the contract to Ganache
- Save contract address and ABI to `deployments/` folder
- Run test transactions
- Display deployment information

### Step 7: Start Flask API Server

```bash
# Make sure virtual environment is activated
python app.py

# Expected output:
# ============================================================
# 🎓 Certificate Verifier API Server
# ============================================================
# ✓ Connected to Ganache blockchain
# ✓ Contract loaded at address: 0x...
# 🌐 Starting Flask server...
#    API will be available at: http://127.0.0.1:5000
```

### Step 8: Open Frontend

1. Open `index.html` in your web browser
2. The frontend will automatically connect to the Flask API
3. You can now upload and verify certificates!

## 📁 Project Structure

```
├── contracts/
│   └── CertificateVerifier.sol    # Solidity smart contract
├── scripts/
│   └── deploy.js                   # Deployment script
├── deployments/
│   ├── CertificateVerifier.json   # Deployed contract info
│   └── contract_abi.json          # Contract ABI
├── uploads/                        # Uploaded certificates
├── blockchain_handler.py           # Python blockchain interface
├── app.py                         # Flask API server
├── web3_integration.js            # Frontend blockchain integration
├── index.html                     # Frontend UI
├── style.css                      # Frontend styles
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Node.js dependencies
└── requirements.txt               # Python dependencies
```

## 🔧 Configuration

### Ganache Settings

The default Ganache configuration:
- RPC Server: `http://127.0.0.1:7545`
- Chain ID: `1337`
- Network ID: `5777`

If your Ganache uses different settings, update `hardhat.config.js`:

```javascript
networks: {
  ganache: {
    url: "http://127.0.0.1:7545",  // Update if different
    chainId: 1337
  }
}
```

### Python Backend

Update `blockchain_handler.py` if needed:

```python
blockchain = BlockchainHandler(
    provider_url="http://127.0.0.1:7545"  # Update if different
)
```

## 📚 API Endpoints

### GET /
Health check endpoint

### GET /api/blockchain/info
Get blockchain connection status and information

### POST /api/certificate/upload
Upload and store certificate on blockchain

**Request (multipart/form-data):**
- `file`: Certificate file (PDF, PNG, JPG)
- `certificateId`: Unique certificate ID
- `holderName`: Certificate holder name
- `certificateType`: Type of certificate
- `institution`: Issuing institution
- `issueDate`: Issue date (ISO format)

**Response:**
```json
{
  "success": true,
  "certificateId": "CERT-123",
  "certificateHash": "0x...",
  "transactionHash": "0x...",
  "blockNumber": 5,
  "gasUsed": 123456
}
```

### POST /api/certificate/verify/id
Verify certificate by ID

**Request (JSON):**
```json
{
  "certificateId": "CERT-123"
}
```

**Response:**
```json
{
  "verified": true,
  "certificate": {
    "certificateHash": "0x...",
    "holderName": "John Doe",
    "certificateType": "Bachelor Degree",
    "institution": "MIT",
    "issueDate": 1234567890
  }
}
```

### POST /api/certificate/verify/hash
Verify certificate by hash

### POST /api/certificate/verify/file
Verify certificate by uploading file

### GET /api/certificates/list
Get all certificates from blockchain

### POST /api/zkp/generate
Generate zero-knowledge proof

## 🧪 Testing

### Test Smart Contract

```bash
# Run Hardhat tests
npx hardhat test
```

### Test Python Backend

```python
# Run blockchain_handler.py directly
python blockchain_handler.py
```

### Manual Testing

1. **Upload a Certificate:**
   - Open frontend (`index.html`)
   - Fill in certificate details
   - Upload a file
   - Click "Upload Certificate"
   - Check Ganache for the transaction

2. **Verify a Certificate:**
   - Use the certificate ID from upload
   - Click "Verify Certificate"
   - View certificate details

## 🎓 Smart Contract Functions

### storeCertificate
```solidity
function storeCertificate(
    string memory _certificateId,
    string memory _certificateHash,
    string memory _holderName,
    string memory _certificateType,
    string memory _institution,
    uint256 _issueDate
) public
```

### verifyCertificateById
```solidity
function verifyCertificateById(string memory _certificateId) 
    public view returns (...)
```

### verifyCertificateByHash
```solidity
function verifyCertificateByHash(string memory _hash) 
    public view returns (...)
```

### getCertificateCount
```solidity
function getCertificateCount() public view returns (uint256)
```

## 🐛 Troubleshooting

### "Failed to connect to Ganache"
- Ensure Ganache is running
- Check RPC Server URL is `http://127.0.0.1:7545`
- Verify no other application is using port 7545

### "Contract not deployed"
- Run deployment script: `npm run deploy`
- Check `deployments/CertificateVerifier.json` exists

### "Module not found"
- For Node.js: Run `npm install`
- For Python: Run `pip install -r requirements.txt`

### "Transaction failed"
- Check you have sufficient ETH in Ganache account
- Verify contract is deployed correctly
- Check gas limit settings

## 📖 How It Works

1. **Certificate Upload:**
   - User uploads certificate file through frontend
   - Frontend sends file to Flask API
   - API generates SHA-256 hash of file
   - Python backend calls smart contract to store hash
   - Transaction is mined on Ganache blockchain
   - Certificate metadata stored on-chain

2. **Certificate Verification:**
   - User provides certificate ID or uploads file
   - System generates hash (if file uploaded)
   - Smart contract checks if hash exists on blockchain
   - Returns certificate details if verified
   - Frontend displays verification result

3. **Blockchain Interaction:**
   - Python (web3.py) ↔ Ganache blockchain
   - Flask API ↔ Frontend (AJAX/fetch)
   - Smart contract stores data immutably
   - All transactions visible in Ganache

## 🔐 Security Notes

- This is a development setup using Ganache (local blockchain)
- For production, use a testnet (Sepolia) or mainnet
- Never commit private keys or mnemonics to version control
- Use environment variables for sensitive data
- Implement proper authentication for API endpoints

## 📝 Next Steps

1. **Add Authentication:**
   - Implement JWT authentication
   - Add role-based access control

2. **Enhance ZKP:**
   - Integrate real ZKP library (snarkjs)
   - Implement privacy-preserving verification

3. **Database Integration:**
   - Add MySQL for off-chain data
   - Store additional metadata

4. **Deploy to Testnet:**
   - Deploy to Sepolia or Mumbai
   - Update configuration for testnet

5. **Production Deployment:**
   - Deploy to mainnet
   - Add proper monitoring and logging

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Made with ❤️ for secure certificate verification**
