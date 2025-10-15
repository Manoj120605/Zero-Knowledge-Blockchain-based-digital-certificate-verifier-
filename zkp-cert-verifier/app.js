// Sample data for the application
const sampleData = {
  certificates: [
    {
      id: "CERT-2024-001",
      institution: "MIT",
      type: "Bachelor of Computer Science",
      holder: "John Doe",
      issue_date: "2024-06-15",
      status: "verified",
      blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      zkp_proof: "0x9876543210fedcba0987654321fedcba09876543"
    },
    {
      id: "CERT-2024-002",
      institution: "Stanford University",
      type: "Master of Data Science",
      holder: "Jane Smith",
      issue_date: "2024-05-20",
      status: "verified",
      blockchain_hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      zkp_proof: "0xfedcba0987654321fedcba0987654321fedcba09"
    },
    {
      id: "CERT-2024-003",
      institution: "Harvard University",
      type: "PhD in Artificial Intelligence",
      holder: "Robert Johnson",
      issue_date: "2024-07-10",
      status: "pending",
      blockchain_hash: "0x567890abcdef1234567890abcdef1234567890ab",
      zkp_proof: "0x321fedcba0987654321fedcba0987654321fedcba"
    }
  ],
  
  recentActivities: [
    {
      action: "Certificate Verified",
      user: "John Doe",
      certificate_id: "CERT-2024-001",
      timestamp: "2024-10-14T23:30:00Z",
      status: "success"
    },
    {
      action: "Certificate Uploaded",
      user: "Jane Smith",
      certificate_id: "CERT-2024-004",
      timestamp: "2024-10-14T23:25:00Z",
      status: "processing"
    },
    {
      action: "ZKP Proof Generated",
      user: "System",
      certificate_id: "CERT-2024-003",
      timestamp: "2024-10-14T23:20:00Z",
      status: "success"
    },
    {
      action: "Verification Failed",
      user: "Mike Wilson",
      certificate_id: "CERT-2024-005",
      timestamp: "2024-10-14T23:15:00Z",
      status: "error"
    }
  ],
  
  verificationStats: {
    total_certificates: 1247,
    verified_today: 45,
    pending_verification: 12,
    success_rate: 98.7,
    average_verification_time: "2.3 seconds"
  }
};

// Global state
let currentPage = 'home';
let uploadedFile = null;
let verificationChart = null;

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
  setupMobileMenu();
  setupFileUpload();
  setupVerificationTabs();
  setupAdminDashboard();
  initializeChart();
  populateActivityList();
  populateCertificatesTable();
  
  // Show initial page
  showPage('home');
});

// Navigation functions
function setupNavigation() {
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.getAttribute('data-page');
      showPage(targetPage);
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Close mobile menu if open
      navMenu.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
  
  // Handle hero buttons
  document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetPage = this.getAttribute('data-page');
      if (targetPage) {
        showPage(targetPage);
        updateActiveNav(targetPage);
      }
    });
  });
  
  // Handle result actions
  document.querySelectorAll('.result-actions .btn[data-page]').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetPage = this.getAttribute('data-page');
      showPage(targetPage);
      updateActiveNav(targetPage);
    });
  });
}

function setupMobileMenu() {
  mobileMenu.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.classList.toggle('active');
  });
}

function showPage(pageId) {
  // Hide all pages
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = pageId;
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNav(pageId) {
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });
}

// File upload functionality
function setupFileUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const uploadProgress = document.getElementById('upload-progress');
  const filePreview = document.getElementById('file-preview');
  const fileName = document.getElementById('file-name');
  const removeFile = document.getElementById('remove-file');
  const certificateForm = document.getElementById('certificate-form');
  
  // Click to upload
  uploadArea.addEventListener('click', () => {
    if (!uploadedFile) {
      fileInput.click();
    }
  });
  
  // File input change
  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
      handleFileUpload(this.files[0]);
    }
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    this.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });
  
  // Remove file
  removeFile.addEventListener('click', function() {
    uploadedFile = null;
    fileInput.value = '';
    uploadProgress.style.display = 'none';
    filePreview.style.display = 'none';
    uploadArea.style.display = 'block';
  });
  
  // Form submission
  certificateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    generateZKPProof();
  });
}

function handleFileUpload(file) {
  // Validate file
  const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    showToast('Invalid file type. Please upload PDF, PNG, or JPG files.', 'error');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    showToast('File size too large. Maximum size is 10MB.', 'error');
    return;
  }
  
  uploadedFile = file;
  
  // Show progress
  const uploadProgress = document.getElementById('upload-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const uploadArea = document.getElementById('upload-area');
  const filePreview = document.getElementById('file-preview');
  const fileName = document.getElementById('file-name');
  
  uploadArea.style.display = 'none';
  uploadProgress.style.display = 'block';
  
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Show file preview
      setTimeout(() => {
        uploadProgress.style.display = 'none';
        filePreview.style.display = 'block';
        fileName.textContent = file.name;
        showToast('File uploaded successfully!');
      }, 500);
    }
    
    progressFill.style.width = progress + '%';
    progressText.textContent = `Uploading... ${Math.round(progress)}%`;
  }, 100);
}

function generateZKPProof() {
  if (!uploadedFile) {
    showToast('Please upload a certificate file first.', 'error');
    return;
  }
  
  const generateBtn = document.getElementById('generate-proof-btn');
  const zkpResult = document.getElementById('zkp-result');
  
  // Get form data
  const formData = {
    institution: document.getElementById('institution').value,
    type: document.getElementById('cert-type').value,
    holder: document.getElementById('holder-name').value,
    issueDate: document.getElementById('issue-date').value
  };
  
  // Validate form
  if (!formData.institution || !formData.type || !formData.holder || !formData.issueDate) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }
  
  // Show loading state
  generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Proof...';
  generateBtn.disabled = true;
  
  // Simulate ZKP proof generation
  setTimeout(() => {
    // Generate mock certificate data
    const certId = generateCertificateId();
    const blockchainHash = generateHash('blockchain');
    const zkpProof = generateHash('zkp');
    
    // Display results
    document.getElementById('generated-cert-id').textContent = certId;
    document.getElementById('generated-blockchain-hash').textContent = blockchainHash;
    document.getElementById('generated-zkp-proof').textContent = zkpProof;
    
    // Show result
    zkpResult.style.display = 'block';
    zkpResult.scrollIntoView({ behavior: 'smooth' });
    
    // Reset button
    generateBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Generate ZKP Proof';
    generateBtn.disabled = false;
    
    showToast('ZKP proof generated successfully!');
    
    // Add to sample data (for demo purposes)
    sampleData.certificates.unshift({
      id: certId,
      institution: formData.institution,
      type: formData.type,
      holder: formData.holder,
      issue_date: formData.issueDate,
      status: 'verified',
      blockchain_hash: blockchainHash,
      zkp_proof: zkpProof
    });
    
    // Update dashboard if active
    if (currentPage === 'admin') {
      populateCertificatesTable();
    }
    
  }, 3000);
}

function downloadProof() {
  const certId = document.getElementById('generated-cert-id').textContent;
  const blockchainHash = document.getElementById('generated-blockchain-hash').textContent;
  const zkpProof = document.getElementById('generated-zkp-proof').textContent;
  
  const proofData = {
    certificate_id: certId,
    blockchain_hash: blockchainHash,
    zkp_proof: zkpProof,
    generated_at: new Date().toISOString(),
    proof_system: 'zk-SNARKs',
    verification_key: 'VK_' + generateHash('verification')
  };
  
  const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `zkp_proof_${certId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Proof downloaded successfully!');
}

// Verification page functionality
function setupVerificationTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const methodPanels = document.querySelectorAll('.method-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const method = this.getAttribute('data-method');
      
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding panel
      methodPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === method + '-method') {
          panel.classList.add('active');
        }
      });
    });
  });
}

function verifyCertificate(method) {
  const statusElement = document.getElementById('verification-status');
  const resultElement = document.getElementById('verification-result');
  const statusIcon = document.getElementById('status-icon');
  const statusText = document.getElementById('status-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  let inputValue = '';
  
  // Get input value based on method
  switch (method) {
    case 'id':
      inputValue = document.getElementById('cert-id-input').value;
      if (!inputValue.trim()) {
        showToast('Please enter a certificate ID.', 'error');
        return;
      }
      break;
    case 'hash':
      inputValue = document.getElementById('hash-input').value;
      if (!inputValue.trim()) {
        showToast('Please enter a blockchain hash.', 'error');
        return;
      }
      break;
    case 'qr':
      // For demo, we'll use a sample certificate
      inputValue = 'CERT-2024-001';
      break;
  }
  
  // Show loading state
  statusIcon.style.display = 'none';
  loadingSpinner.style.display = 'block';
  statusText.textContent = 'Verifying certificate...';
  resultElement.style.display = 'none';
  
  // Simulate verification process
  setTimeout(() => {
    const certificate = findCertificate(inputValue, method);
    
    loadingSpinner.style.display = 'none';
    statusIcon.style.display = 'block';
    
    if (certificate) {
      // Verification successful
      statusIcon.className = 'fas fa-check-circle status-icon';
      statusIcon.style.color = 'var(--color-success)';
      statusText.textContent = 'Certificate verified successfully!';
      statusText.style.color = 'var(--color-success)';
      
      displayVerificationResult(certificate, true);
    } else {
      // Verification failed
      statusIcon.className = 'fas fa-times-circle status-icon';
      statusIcon.style.color = 'var(--color-error)';
      statusText.textContent = 'Certificate verification failed.';
      statusText.style.color = 'var(--color-error)';
      
      displayVerificationResult(null, false);
    }
    
    resultElement.style.display = 'block';
    resultElement.scrollIntoView({ behavior: 'smooth' });
    
  }, 2000);
}

function simulateQRScan() {
  showToast('QR code scanned! Verifying certificate...');
  setTimeout(() => {
    document.getElementById('cert-id-input').value = 'CERT-2024-001';
    verifyCertificate('qr');
  }, 1000);
}

function findCertificate(value, method) {
  return sampleData.certificates.find(cert => {
    switch (method) {
      case 'id':
      case 'qr':
        return cert.id.toLowerCase() === value.toLowerCase();
      case 'hash':
        return cert.blockchain_hash.toLowerCase() === value.toLowerCase();
      default:
        return false;
    }
  });
}

function displayVerificationResult(certificate, isValid) {
  const resultElement = document.getElementById('verification-result');
  
  if (isValid && certificate) {
    resultElement.innerHTML = `
      <div class="card" style="border: 2px solid var(--color-success);">
        <div class="card__body">
          <div class="result-header">
            <i class="fas fa-shield-check" style="color: var(--color-success); font-size: var(--font-size-2xl);"></i>
            <h3 style="color: var(--color-success);">Certificate Verified</h3>
          </div>
          
          <div class="verification-details" style="margin-top: var(--space-24);">
            <div class="detail-item">
              <label>Certificate ID:</label>
              <span>${certificate.id}</span>
            </div>
            <div class="detail-item">
              <label>Institution:</label>
              <span>${certificate.institution}</span>
            </div>
            <div class="detail-item">
              <label>Certificate Type:</label>
              <span>${certificate.type}</span>
            </div>
            <div class="detail-item">
              <label>Holder:</label>
              <span>${certificate.holder}</span>
            </div>
            <div class="detail-item">
              <label>Issue Date:</label>
              <span>${new Date(certificate.issue_date).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <span class="status status--success">${certificate.status}</span>
            </div>
          </div>
          
          <div class="zkp-details" style="margin-top: var(--space-24); padding-top: var(--space-24); border-top: 1px solid var(--color-card-border-inner);">
            <h4>Zero Knowledge Proof Details</h4>
            <div class="detail-item">
              <label>Blockchain Hash:</label>
              <span>${certificate.blockchain_hash}</span>
            </div>
            <div class="detail-item">
              <label>ZKP Proof:</label>
              <span>${certificate.zkp_proof}</span>
            </div>
            <div class="detail-item">
              <label>Verification Time:</label>
              <span>< 1ms</span>
            </div>
            <div class="detail-item">
              <label>Proof System:</label>
              <span>zk-SNARKs</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    showToast('Certificate verification successful!');
  } else {
    resultElement.innerHTML = `
      <div class="card" style="border: 2px solid var(--color-error);">
        <div class="card__body">
          <div class="result-header">
            <i class="fas fa-shield-times" style="color: var(--color-error); font-size: var(--font-size-2xl);"></i>
            <h3 style="color: var(--color-error);">Verification Failed</h3>
          </div>
          
          <div style="margin-top: var(--space-24);">
            <p style="color: var(--color-text-secondary);">The certificate could not be verified. This may indicate:</p>
            <ul style="margin-top: var(--space-16); color: var(--color-text-secondary);">
              <li>Invalid certificate ID or hash</li>
              <li>Certificate not found in blockchain</li>
              <li>Tampered or fraudulent certificate</li>
              <li>Certificate has been revoked</li>
            </ul>
            
            <div style="margin-top: var(--space-24); padding: var(--space-16); background: var(--color-bg-4); border-radius: var(--radius-base);">
              <p style="font-weight: var(--font-weight-medium); color: var(--color-error);">⚠️ Do not trust this certificate</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    showToast('Certificate verification failed!', 'error');
  }
}

// Admin dashboard functionality
function setupAdminDashboard() {
  // Setup search and filter for certificates table
  const searchInput = document.getElementById('cert-search');
  const filterSelect = document.getElementById('cert-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterCertificatesTable();
    });
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', function() {
      filterCertificatesTable();
    });
  }
}

function initializeChart() {
  const ctx = document.getElementById('verificationChart');
  if (!ctx) return;
  
  // Generate sample chart data
  const days = [];
  const verifications = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    verifications.push(Math.floor(Math.random() * 30) + 20);
  }
  
  verificationChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Verifications',
        data: verifications,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#2563eb',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(107, 114, 128, 0.1)'
          },
          ticks: {
            color: '#6b7280'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

function populateActivityList() {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;
  
  activityList.innerHTML = sampleData.recentActivities.map(activity => {
    const timeAgo = getTimeAgo(activity.timestamp);
    const iconClass = getActivityIcon(activity.status);
    
    return `
      <div class="activity-item">
        <div class="activity-icon ${activity.status}">
          <i class="${iconClass}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-action">${activity.action}</div>
          <div class="activity-details">${activity.user} • ${activity.certificate_id}</div>
        </div>
        <div class="activity-time">${timeAgo}</div>
      </div>
    `;
  }).join('');
}

function populateCertificatesTable() {
  const tableBody = document.getElementById('certificates-table');
  if (!tableBody) return;
  
  tableBody.innerHTML = sampleData.certificates.map(cert => {
    const statusClass = cert.status === 'verified' ? 'status--success' : 'status--warning';
    const formattedDate = new Date(cert.issue_date).toLocaleDateString();
    
    return `
      <tr>
        <td><code>${cert.id}</code></td>
        <td>${cert.institution}</td>
        <td>${cert.type}</td>
        <td>${cert.holder}</td>
        <td>${formattedDate}</td>
        <td><span class="status ${statusClass}">${cert.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn--outline" onclick="viewCertificate('${cert.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn--outline" onclick="downloadCertificate('${cert.id}')">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterCertificatesTable() {
  const searchTerm = document.getElementById('cert-search')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('cert-filter')?.value.toLowerCase() || '';
  
  const filteredCerts = sampleData.certificates.filter(cert => {
    const matchesSearch = !searchTerm || 
      cert.id.toLowerCase().includes(searchTerm) ||
      cert.institution.toLowerCase().includes(searchTerm) ||
      cert.holder.toLowerCase().includes(searchTerm) ||
      cert.type.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || statusFilter === 'all status' || 
      cert.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const tableBody = document.getElementById('certificates-table');
  if (!tableBody) return;
  
  tableBody.innerHTML = filteredCerts.map(cert => {
    const statusClass = cert.status === 'verified' ? 'status--success' : 'status--warning';
    const formattedDate = new Date(cert.issue_date).toLocaleDateString();
    
    return `
      <tr>
        <td><code>${cert.id}</code></td>
        <td>${cert.institution}</td>
        <td>${cert.type}</td>
        <td>${cert.holder}</td>
        <td>${formattedDate}</td>
        <td><span class="status ${statusClass}">${cert.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn--outline" onclick="viewCertificate('${cert.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn--outline" onclick="downloadCertificate('${cert.id}')">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function viewCertificate(certId) {
  const cert = sampleData.certificates.find(c => c.id === certId);
  if (cert) {
    // For demo, we'll populate the verification page and show it
    document.getElementById('cert-id-input').value = certId;
    showPage('verify');
    updateActiveNav('verify');
    showToast(`Viewing certificate ${certId}`);
  }
}

function downloadCertificate(certId) {
  const cert = sampleData.certificates.find(c => c.id === certId);
  if (cert) {
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Certificate ${certId} downloaded successfully!`);
  }
}

// Utility functions
function generateCertificateId() {
  const year = new Date().getFullYear();
  const number = String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0');
  return `CERT-${year}-${number}`;
}

function generateHash(type) {
  const prefix = type === 'blockchain' ? '0x' : '0x';
  const length = type === 'zkp' ? 40 : 40;
  let hash = prefix;
  
  for (let i = 0; i < length; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  
  return hash;
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function getActivityIcon(status) {
  switch (status) {
    case 'success':
      return 'fas fa-check';
    case 'processing':
      return 'fas fa-clock';
    case 'error':
      return 'fas fa-times';
    default:
      return 'fas fa-info';
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.querySelector('.toast-message');
  const toastIcon = document.querySelector('.toast-icon');
  
  // Set message
  toastMessage.textContent = message;
  
  // Set type
  toast.className = `toast ${type}`;
  
  // Set icon
  switch (type) {
    case 'success':
      toastIcon.className = 'toast-icon fas fa-check-circle';
      break;
    case 'error':
      toastIcon.className = 'toast-icon fas fa-exclamation-circle';
      break;
    case 'warning':
      toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
      break;
    default:
      toastIcon.className = 'toast-icon fas fa-info-circle';
  }
  
  // Show toast
  toast.classList.add('show');
  
  // Hide after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Accessibility enhancements
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
  
  // Enter key on navigation links
  if (e.key === 'Enter' && e.target.hasAttribute('data-page')) {
    e.target.click();
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Performance optimization: Lazy load chart only when dashboard is visible
const dashboardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !verificationChart) {
      initializeChart();
    }
  });
});

const dashboardElement = document.getElementById('admin-page');
if (dashboardElement) {
  dashboardObserver.observe(dashboardElement);
}

// Export functions for global access
window.verifyCertificate = verifyCertificate;
window.simulateQRScan = simulateQRScan;
window.downloadProof = downloadProof;
window.viewCertificate = viewCertificate;
window.downloadCertificate = downloadCertificate;

console.log('🚀 ZKP Certificate Verifier Application Initialized Successfully!');
console.log('Features: Zero Knowledge Proofs, Blockchain Integration, Modern UI/UX');
console.log('College Project by: Advanced Blockchain & Cryptography Class');