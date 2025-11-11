from flask import Flask, request, jsonify
from flask_cors import CORS
from blockchain_handler import BlockchainHandler
import hashlib
import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize blockchain handler
# Update these values after deploying the contract
CONTRACT_ADDRESS = None  # Will be loaded from deployment file
CONTRACT_ABI_PATH = "deployments/contract_abi.json"

blockchain = None

def init_blockchain():
    """Initialize blockchain connection"""
    global blockchain, CONTRACT_ADDRESS

    try:
        # Try to load deployed contract info
        if os.path.exists("deployments/CertificateVerifier.json"):
            with open("deployments/CertificateVerifier.json", 'r') as f:
                contract_info = json.load(f)
                CONTRACT_ADDRESS = contract_info['address']

            blockchain = BlockchainHandler(
                provider_url="http://127.0.0.1:7545",
                contract_address=CONTRACT_ADDRESS,
                contract_abi_path=CONTRACT_ABI_PATH
            )
            print("✓ Blockchain handler initialized successfully")
            return True
        else:
            print("⚠ Contract not deployed yet. Please run deployment first.")
            blockchain = BlockchainHandler(provider_url="http://127.0.0.1:7545")
            return False
    except Exception as e:
        print(f"✗ Error initializing blockchain: {str(e)}")
        return False

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Certificate Verifier API is running',
        'blockchain_connected': blockchain is not None and blockchain.web3.is_connected(),
        'contract_loaded': blockchain is not None and blockchain.contract is not None
    })

@app.route('/api/blockchain/info', methods=['GET'])
def get_blockchain_info():
    """Get blockchain information"""
    if blockchain is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        info = blockchain.get_blockchain_info()
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certificate/upload', methods=['POST'])
def upload_certificate():
    """Upload and store certificate"""
    if blockchain is None or blockchain.contract is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        # Get form data
        cert_id = request.form.get('certificateId')
        holder_name = request.form.get('holderName')
        cert_type = request.form.get('certificateType')
        institution = request.form.get('institution', 'Unknown Institution')
        issue_date_str = request.form.get('issueDate')

        # Validate required fields
        if not all([cert_id, holder_name, cert_type, issue_date_str]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Convert issue date to timestamp
        try:
            issue_date = int(datetime.fromisoformat(issue_date_str).timestamp())
        except:
            return jsonify({'error': 'Invalid date format'}), 400

        # Read file data and generate hash
        file_data = file.read()
        cert_hash = blockchain.generate_certificate_hash(file_data)

        # Save file
        filename = secure_filename(f"{cert_id}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        with open(filepath, 'wb') as f:
            f.write(file_data)

        # Store on blockchain
        tx_receipt = blockchain.store_certificate(
            cert_id,
            cert_hash,
            holder_name,
            cert_type,
            institution,
            issue_date
        )

        if tx_receipt is None:
            return jsonify({'error': 'Failed to store certificate on blockchain'}), 500

        return jsonify({
            'success': True,
            'message': 'Certificate stored successfully',
            'certificateId': cert_id,
            'certificateHash': cert_hash,
            'transactionHash': tx_receipt.transactionHash.hex(),
            'blockNumber': tx_receipt.blockNumber,
            'gasUsed': tx_receipt.gasUsed
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certificate/verify/id', methods=['POST'])
def verify_by_id():
    """Verify certificate by ID"""
    if blockchain is None or blockchain.contract is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        data = request.get_json()
        cert_id = data.get('certificateId')

        if not cert_id:
            return jsonify({'error': 'Certificate ID is required'}), 400

        cert_data = blockchain.verify_certificate_by_id(cert_id)

        if cert_data is None:
            return jsonify({
                'verified': False,
                'message': 'Certificate not found'
            })

        return jsonify({
            'verified': True,
            'message': 'Certificate verified successfully',
            'certificate': cert_data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certificate/verify/hash', methods=['POST'])
def verify_by_hash():
    """Verify certificate by hash"""
    if blockchain is None or blockchain.contract is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        data = request.get_json()
        cert_hash = data.get('certificateHash')

        if not cert_hash:
            return jsonify({'error': 'Certificate hash is required'}), 400

        cert_data = blockchain.verify_certificate_by_hash(cert_hash)

        if cert_data is None:
            return jsonify({
                'verified': False,
                'message': 'Certificate not found'
            })

        return jsonify({
            'verified': True,
            'message': 'Certificate verified successfully',
            'certificate': cert_data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certificate/verify/file', methods=['POST'])
def verify_by_file():
    """Verify certificate by uploading the file"""
    if blockchain is None or blockchain.contract is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Generate hash from file
        file_data = file.read()
        cert_hash = blockchain.generate_certificate_hash(file_data)

        # Verify using hash
        cert_data = blockchain.verify_certificate_by_hash(cert_hash)

        if cert_data is None:
            return jsonify({
                'verified': False,
                'message': 'Certificate not found or has been tampered with'
            })

        return jsonify({
            'verified': True,
            'message': 'Certificate is authentic and unmodified',
            'certificate': cert_data,
            'certificateHash': cert_hash
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/certificates/list', methods=['GET'])
def list_certificates():
    """Get all certificates"""
    if blockchain is None or blockchain.contract is None:
        return jsonify({'error': 'Blockchain not initialized'}), 500

    try:
        certificates = blockchain.get_all_certificates()
        return jsonify({
            'count': len(certificates),
            'certificates': certificates
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/zkp/generate', methods=['POST'])
def generate_zkp():
    """Generate zero-knowledge proof (simplified version)"""
    try:
        data = request.get_json()
        cert_id = data.get('certificateId')

        if not cert_id:
            return jsonify({'error': 'Certificate ID is required'}), 400

        # In a real implementation, this would use a ZKP library
        # For now, we'll return a mock proof
        mock_proof = {
            'proof': hashlib.sha256(f"{cert_id}_proof".encode()).hexdigest(),
            'publicInputs': {
                'certificateId': cert_id,
                'timestamp': int(datetime.now().timestamp())
            },
            'proofSize': 192,  # bytes
            'generationTime': '< 1ms'
        }

        return jsonify({
            'success': True,
            'zkProof': mock_proof,
            'message': 'Zero-knowledge proof generated successfully'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🎓 Certificate Verifier API Server")
    print("="*60)

    # Initialize blockchain connection
    init_blockchain()

    print("\n🌐 Starting Flask server...")
    print("   API will be available at: http://127.0.0.1:5000")
    print("\n📚 Available endpoints:")
    print("   GET  /                          - Health check")
    print("   GET  /api/blockchain/info       - Get blockchain info")
    print("   POST /api/certificate/upload    - Upload certificate")
    print("   POST /api/certificate/verify/id - Verify by ID")
    print("   POST /api/certificate/verify/hash - Verify by hash")
    print("   POST /api/certificate/verify/file - Verify by file")
    print("   GET  /api/certificates/list     - List all certificates")
    print("   POST /api/zkp/generate          - Generate ZK proof")
    print("\n" + "="*60 + "\n")

    app.run(host='127.0.0.1', port=5000, debug=True)
