@echo off
echo ==================================================
echo 🚀 ZKP Certificate Verifier - Setup Script
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python from https://python.org/
    pause
    exit /b 1
)

echo ✓ Python detected
python --version

REM Create necessary directories
echo.
echo 📁 Creating project directories...
if not exist "contracts" mkdir contracts
if not exist "scripts" mkdir scripts
if not exist "deployments" mkdir deployments
if not exist "uploads" mkdir uploads
echo ✓ Directories created

REM Move files to correct locations
echo.
echo 📋 Organizing project files...
if exist "CertificateVerifier.sol" move CertificateVerifier.sol contracts\
if exist "deploy.js" move deploy.js scripts\
echo ✓ Files organized

REM Install Node.js dependencies
echo.
echo 📦 Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed

REM Create Python virtual environment
echo.
echo 🐍 Setting up Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created

REM Activate virtual environment and install dependencies
echo.
echo 📦 Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed

echo.
echo ==================================================
echo ✅ Setup completed successfully!
echo ==================================================
echo.
echo 📋 Next steps:
echo   1. Start Ganache and create a quickstart workspace
echo   2. Compile contracts: npm run compile
echo   3. Deploy contracts: npm run deploy
echo   4. Start API server: python app.py
echo   5. Open index.html in your browser
echo.
echo For detailed instructions, see README.md
echo ==================================================
pause
