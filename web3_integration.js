// Web3 Integration for Certificate Verifier
// This file connects the HTML frontend to the Flask backend and blockchain

// Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// State management
let currentAccount = null;
let blockchainInfo = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Certificate Verifier...');

    // Load blockchain info
    await loadBlockchainInfo();

    // Setup event listeners
    setupEventListeners();

    // Update UI
    updateUI();
});

// Setup all event listeners
function setupEventListeners() {
    // File upload
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.querySelector('.upload-btn');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Certificate upload form
    const uploadCertBtn = document.querySelector('button:contains("Upload Certificate")');
    // Note: You'll need to add proper IDs to buttons in HTML

    // Verify certificate buttons
    const verifyBtns = document.querySelectorAll('[data-action="verify"]');
    verifyBtns.forEach(btn => {
        btn.addEventListener('click', handleVerification);
    });
}

// Load blockchain information
async function loadBlockchainInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/blockchain/info`);
        if (!response.ok) throw new Error('Failed to fetch blockchain info');

        blockchainInfo = await response.json();
        console.log('✓ Blockchain info loaded:', blockchainInfo);

        // Update status indicators
        updateBlockchainStatus();

        return blockchainInfo;
    } catch (error) {
        console.error('✗ Error loading blockchain info:', error);
        showNotification('Failed to connect to blockchain', 'error');
        return null;
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);

    // Validate file
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload PDF, PNG, or JPG.', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showNotification('File too large. Maximum size is 10MB.', 'error');
        return;
    }

    // Update UI to show selected file
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('file-selected');
        dropZone.querySelector('p').textContent = `Selected: ${file.name}`;
    }
}

// Upload certificate to blockchain
async function uploadCertificate() {
    try {
        // Get form values
        const fileInput = document.getElementById('file-input');
        const certType = document.getElementById('cert-type')?.value;
        const holderName = document.getElementById('holder-name')?.value;
        const issueDate = document.getElementById('issue-date')?.value;
        const institution = document.getElementById('institution')?.value || 'Unknown Institution';

        // Validation
        if (!fileInput.files[0]) {
            showNotification('Please select a certificate file', 'error');
            return;
        }

        if (!certType || !holderName || !issueDate) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Generate certificate ID
        const certId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create FormData
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('certificateId', certId);
        formData.append('certificateType', certType);
        formData.append('holderName', holderName);
        formData.append('issueDate', issueDate);
        formData.append('institution', institution);

        // Show loading
        showNotification('Uploading certificate to blockchain...', 'info');

        // Upload to server
        const response = await fetch(`${API_BASE_URL}/certificate/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        console.log('✓ Certificate uploaded:', result);

        // Show success message
        showNotification(
            `Certificate stored successfully! ID: ${result.certificateId}`,
            'success'
        );

        // Display transaction details
        displayTransactionResult(result);

        // Reset form
        resetUploadForm();

        return result;

    } catch (error) {
        console.error('✗ Error uploading certificate:', error);
        showNotification(`Upload failed: ${error.message}`, 'error');
        return null;
    }
}

// Verify certificate by ID
async function verifyCertificateById(certId) {
    try {
        showNotification('Verifying certificate...', 'info');

        const response = await fetch(`${API_BASE_URL}/certificate/verify/id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ certificateId: certId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Verification failed');
        }

        const result = await response.json();

        if (result.verified) {
            showNotification('Certificate verified successfully!', 'success');
            displayCertificateDetails(result.certificate);
        } else {
            showNotification('Certificate not found or invalid', 'error');
        }

        return result;

    } catch (error) {
        console.error('✗ Error verifying certificate:', error);
        showNotification(`Verification failed: ${error.message}`, 'error');
        return null;
    }
}

// Verify certificate by hash
async function verifyCertificateByHash(hash) {
    try {
        showNotification('Verifying certificate by hash...', 'info');

        const response = await fetch(`${API_BASE_URL}/certificate/verify/hash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ certificateHash: hash })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Verification failed');
        }

        const result = await response.json();

        if (result.verified) {
            showNotification('Certificate verified by hash!', 'success');
            displayCertificateDetails(result.certificate);
        } else {
            showNotification('Certificate not found', 'error');
        }

        return result;

    } catch (error) {
        console.error('✗ Error verifying by hash:', error);
        showNotification(`Verification failed: ${error.message}`, 'error');
        return null;
    }
}

// Verify certificate by file upload
async function verifyCertificateByFile(file) {
    try {
        showNotification('Verifying certificate file...', 'info');

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/certificate/verify/file`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Verification failed');
        }

        const result = await response.json();

        if (result.verified) {
            showNotification('Certificate is authentic!', 'success');
            displayCertificateDetails(result.certificate);
        } else {
            showNotification('Certificate not found or has been tampered with', 'error');
        }

        return result;

    } catch (error) {
        console.error('✗ Error verifying file:', error);
        showNotification(`Verification failed: ${error.message}`, 'error');
        return null;
    }
}

// Generate ZKP proof
async function generateZKProof(certId) {
    try {
        showNotification('Generating zero-knowledge proof...', 'info');

        const response = await fetch(`${API_BASE_URL}/zkp/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ certificateId: certId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Proof generation failed');
        }

        const result = await response.json();
        console.log('✓ ZK Proof generated:', result);

        showNotification('Zero-knowledge proof generated!', 'success');
        displayZKProof(result.zkProof);

        return result;

    } catch (error) {
        console.error('✗ Error generating ZK proof:', error);
        showNotification(`Proof generation failed: ${error.message}`, 'error');
        return null;
    }
}

// Load all certificates
async function loadAllCertificates() {
    try {
        const response = await fetch(`${API_BASE_URL}/certificates/list`);
        if (!response.ok) throw new Error('Failed to load certificates');

        const result = await response.json();
        console.log(`✓ Loaded ${result.count} certificates`);

        // Update admin dashboard table
        updateCertificateTable(result.certificates);

        return result.certificates;

    } catch (error) {
        console.error('✗ Error loading certificates:', error);
        showNotification('Failed to load certificates', 'error');
        return [];
    }
}

// UI Helper Functions

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function displayTransactionResult(result) {
    const resultDiv = document.getElementById('transaction-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = `
        <div class="success-message">
            <h3>✅ Certificate Stored on Blockchain</h3>
            <p><strong>Certificate ID:</strong> ${result.certificateId}</p>
            <p><strong>Hash:</strong> ${result.certificateHash.substring(0, 16)}...</p>
            <p><strong>Transaction:</strong> ${result.transactionHash.substring(0, 16)}...</p>
            <p><strong>Block Number:</strong> ${result.blockNumber}</p>
            <p><strong>Gas Used:</strong> ${result.gasUsed}</p>
        </div>
    `;
    resultDiv.style.display = 'block';
}

function displayCertificateDetails(cert) {
    const detailsDiv = document.getElementById('certificate-details');
    if (!detailsDiv) return;

    detailsDiv.innerHTML = `
        <div class="cert-details">
            <h3>📜 Certificate Details</h3>
            <p><strong>Holder:</strong> ${cert.holderName}</p>
            <p><strong>Type:</strong> ${cert.certificateType}</p>
            <p><strong>Institution:</strong> ${cert.institution}</p>
            <p><strong>Issue Date:</strong> ${new Date(cert.issueDate * 1000).toLocaleDateString()}</p>
            <p><strong>Verified:</strong> ✅ Authentic</p>
        </div>
    `;
    detailsDiv.style.display = 'block';
}

function displayZKProof(proof) {
    const proofDiv = document.getElementById('zkp-proof');
    if (!proofDiv) return;

    proofDiv.innerHTML = `
        <div class="zkp-result">
            <h3>🔐 Zero-Knowledge Proof</h3>
            <p><strong>Proof:</strong> ${proof.proof.substring(0, 32)}...</p>
            <p><strong>Proof Size:</strong> ${proof.proofSize} bytes</p>
            <p><strong>Generation Time:</strong> ${proof.generationTime}</p>
        </div>
    `;
    proofDiv.style.display = 'block';
}

function updateBlockchainStatus() {
    if (!blockchainInfo) return;

    const statusElements = document.querySelectorAll('.blockchain-status');
    statusElements.forEach(el => {
        el.textContent = blockchainInfo.connected ? '✅ Connected' : '❌ Disconnected';
        el.className = blockchainInfo.connected ? 'status-connected' : 'status-disconnected';
    });
}

function updateCertificateTable(certificates) {
    const tableBody = document.querySelector('#cert-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    certificates.forEach(cert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cert.certificateId}</td>
            <td>${cert.institution}</td>
            <td>${cert.certificateType}</td>
            <td>${cert.holderName}</td>
            <td>${new Date(cert.issueDate * 1000).toLocaleDateString()}</td>
            <td><span class="status-badge status-verified">Verified</span></td>
            <td>
                <button onclick="verifyCertificateById('${cert.certificateId}')">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function resetUploadForm() {
    const fileInput = document.getElementById('file-input');
    const form = document.querySelector('.upload-form');

    if (fileInput) fileInput.value = '';
    if (form) form.reset();

    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
        dropZone.classList.remove('file-selected');
        dropZone.querySelector('p').textContent = 'Drag and drop your certificate here';
    }
}

function updateUI() {
    // Update various UI elements based on current state
    if (blockchainInfo && blockchainInfo.connected) {
        document.body.classList.add('blockchain-connected');
    }
}

// Export functions for use in HTML
window.uploadCertificate = uploadCertificate;
window.verifyCertificateById = verifyCertificateById;
window.verifyCertificateByHash = verifyCertificateByHash;
window.verifyCertificateByFile = verifyCertificateByFile;
window.generateZKProof = generateZKProof;
window.loadAllCertificates = loadAllCertificates;
window.loadBlockchainInfo = loadBlockchainInfo;

console.log('✓ Web3 integration loaded');
