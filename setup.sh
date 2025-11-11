#!/bin/bash

echo "=================================================="
echo "🚀 ZKP Certificate Verifier - Setup Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "❌ Python 3 is not installed. Please install Python from https://python.org/"
    exit 1
fi

echo "✓ Python detected: $(python3 --version)"

# Create necessary directories
echo ""
echo "📁 Creating project directories..."
mkdir -p contracts
mkdir -p scripts
mkdir -p deployments
mkdir -p uploads
echo "✓ Directories created"

# Move files to correct locations
echo ""
echo "📋 Organizing project files..."
[ -f CertificateVerifier.sol ] && mv CertificateVerifier.sol contracts/
[ -f deploy.js ] && mv deploy.js scripts/
echo "✓ Files organized"

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Node.js dependencies installed"
else
    echo "❌ Failed to install Node.js dependencies"
    exit 1
fi

# Create Python virtual environment
echo ""
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
if [ $? -eq 0 ]; then
    echo "✓ Virtual environment created"
else
    echo "❌ Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment and install dependencies
echo ""
echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [ $? -eq 0 ]; then
    echo "✓ Python dependencies installed"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Setup completed successfully!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo "  1. Start Ganache and create a quickstart workspace"
echo "  2. Compile contracts: npm run compile"
echo "  3. Deploy contracts: npm run deploy"
echo "  4. Start API server: python app.py"
echo "  5. Open index.html in your browser"
echo ""
echo "For detailed instructions, see README.md"
echo "=================================================="
