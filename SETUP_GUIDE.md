# 🚀 Complete Setup Guide - ZKP Certificate Verifier

This guide will walk you through setting up the complete blockchain-based certificate verification system from scratch.

## ⏱️ Estimated Time: 15-20 minutes

---

## 📋 Step-by-Step Instructions

### Step 1: Install Ganache (5 minutes)

**Ganache** is a personal Ethereum blockchain for development.

1. **Download Ganache:**
   - Visit: https://archive.trufflesuite.com/ganache/
   - Download the version for your operating system
   - Install the application

2. **Start Ganache:**
   - Open Ganache application
   - Click **"QUICKSTART ETHEREUM"** button
   - Ganache will start a local blockchain at `http://127.0.0.1:7545`

3. **Verify Ganache is running:**
   - You should see 10 accounts with 100 ETH each
   - RPC Server should show: `HTTP://127.0.0.1:7545`
   - Network ID: `5777`
   - **Keep Ganache running throughout development!**

---

### Step 2: Prepare Your Project (2 minutes)

1. **Create project folder:**
   ```bash
   mkdir zkp-certificate-verifier
   cd zkp-certificate-verifier
   ```

2. **Place all files in this folder:**
   - Copy all the generated files to this directory
   - You should have: package.json, requirements.txt, hardhat.config.js, etc.

3. **Create folder structure:**
   ```bash
   mkdir contracts
   mkdir scripts  
   mkdir deployments
   mkdir uploads
   ```

4. **Move files to correct locations:**
   ```bash
   # Move smart contract
   mv CertificateVerifier.sol contracts/

   # Move deployment script
   mv deploy.js scripts/
   ```

---

### Step 3: Install Node.js Dependencies (3 minutes)

**Make sure you have Node.js v18+ installed.**

1. **Install Hardhat and dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - Hardhat (Ethereum development environment)
   - Hardhat Toolbox (testing and deployment tools)
   - Ethers.js (Ethereum library)
   - Other required packages

2. **Verify installation:**
   ```bash
   npx hardhat --version
   ```

   You should see: `Hardhat version X.X.X`

---

### Step 4: Install Python Dependencies (3 minutes)

**Make sure you have Python 3.8+ installed.**

1. **Create virtual environment (recommended):**
   ```bash
   # On Windows:
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

   This will install:
   - web3.py (Python Ethereum library)
   - Flask (Web framework)
   - flask-cors (CORS support)
   - Other required packages

3. **Verify installation:**
   ```bash
   python -c "import web3; print(web3.__version__)"
   ```

---

### Step 5: Compile Smart Contract (1 minute)

1. **Compile the Solidity contract:**
   ```bash
   npx hardhat compile
   ```

2. **Expected output:**
   ```
   Compiled 1 Solidity file successfully
   ```

3. **Verify compilation:**
   - Check that `artifacts/` folder is created
   - Check that `cache/` folder is created

**Troubleshooting:**
- If you get errors, ensure `contracts/CertificateVerifier.sol` exists
- Check that Solidity version in contract matches `hardhat.config.js`

---

### Step 6: Deploy Smart Contract (2 minutes)

**⚠️ IMPORTANT: Make sure Ganache is running!**

1. **Deploy to Ganache:**
   ```bash
   npx hardhat run scripts/deploy.js --network ganache
   ```

2. **Expected output:**
   ```
   🚀 Starting deployment of CertificateVerifier contract...

   ⏳ Deploying contract...

   ✅ Contract deployed successfully!
   📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   📄 Contract info saved to: deployments/CertificateVerifier.json
   🐍 Python-compatible ABI saved to: deployments/contract_abi.json

   🧪 Testing contract functions...
   ✓ Initial certificate count: 0

   📝 Storing test certificate...
   ✓ Test certificate stored successfully!

   ✅ Certificate verification successful!

   🎉 Deployment and testing completed successfully!
   ```

3. **Verify deployment:**
   - Check that `deployments/CertificateVerifier.json` exists
   - Check that `deployments/contract_abi.json` exists
   - In Ganache, go to **TRANSACTIONS** tab - you should see transactions
   - In Ganache, go to **CONTRACTS** tab - you should see your contract

**Troubleshooting:**
- **"Error: connect ECONNREFUSED"**: Ganache is not running
- **"Transaction failed"**: Check Ganache is on port 7545
- **"Network not found"**: Check `hardhat.config.js` has ganache network config

---

### Step 7: Start Flask API Server (1 minute)

1. **Make sure virtual environment is activated**

2. **Start the server:**
   ```bash
   python app.py
   ```

3. **Expected output:**
   ```
   ============================================================
   🎓 Certificate Verifier API Server
   ============================================================
   ✓ Connected to Ganache blockchain
     Chain ID: 1337
     Latest Block: 2
   ✓ Contract loaded at address: 0x5FbDB...

   🌐 Starting Flask server...
      API will be available at: http://127.0.0.1:5000

   📚 Available endpoints:
      GET  /                          - Health check
      GET  /api/blockchain/info       - Get blockchain info
      POST /api/certificate/upload    - Upload certificate
      POST /api/certificate/verify/id - Verify by ID
      POST /api/certificate/verify/hash - Verify by hash
      POST /api/certificate/verify/file - Verify by file
      GET  /api/certificates/list     - List all certificates
      POST /api/zkp/generate          - Generate ZK proof

   ============================================================

    * Running on http://127.0.0.1:5000
   ```

4. **Test the API:**
   - Open browser and go to: http://127.0.0.1:5000
   - You should see: `{"status": "ok", "message": "Certificate Verifier API is running"}`

**Keep this terminal open - the server must keep running!**

---

### Step 8: Open Frontend (1 minute)

1. **Open the HTML file:**
   - Navigate to your project folder
   - Double-click `index.html` or open it in a browser
   - Or use a local server:
     ```bash
     # Python
     python -m http.server 8000

     # Then open http://localhost:8000
     ```

2. **Verify frontend loads:**
   - You should see the Certificate Verifier interface
   - Check browser console (F12) for any errors
   - You should see: `✓ Web3 integration loaded`

---

## ✅ Verification Checklist

Before using the system, verify all components are running:

- [ ] Ganache is running on port 7545
- [ ] Smart contract is deployed (check `deployments/` folder)
- [ ] Flask API server is running on port 5000
- [ ] Frontend (index.html) is open in browser
- [ ] No error messages in any terminal or browser console

---

## 🎮 How to Use

### Upload a Certificate:

1. Click on the upload area or browse for a file
2. Select a certificate file (PDF, PNG, or JPG)
3. Fill in the form:
   - Certificate Type (e.g., "Bachelor of Computer Science")
   - Holder Name (e.g., "John Doe")
   - Issue Date (select from calendar)
   - Institution (optional)
4. Click **"Upload Certificate"**
5. Wait for confirmation
6. Note the **Certificate ID** (you'll need it to verify!)

### Verify a Certificate:

**By Certificate ID:**
1. Enter the Certificate ID in the verification form
2. Click **"Verify Certificate"**
3. View the certificate details

**By Hash:**
1. Enter the certificate hash
2. Click **"Verify by Hash"**
3. View the results

**By File:**
1. Upload the original certificate file
2. System will calculate hash and verify
3. Shows if certificate is authentic or tampered

---

## 🐛 Common Issues and Solutions

### Issue: "Failed to connect to Ganache"
**Solution:**
- Open Ganache application
- Make sure it's running on port 7545
- Check RPC Server shows: `HTTP://127.0.0.1:7545`
- Restart Ganache if needed

### Issue: "Contract not loaded"
**Solution:**
- Check `deployments/` folder exists and has JSON files
- Re-run deployment: `npx hardhat run scripts/deploy.js --network ganache`
- Restart Flask server

### Issue: "CORS error in browser"
**Solution:**
- Check Flask API is running
- Verify flask-cors is installed: `pip install flask-cors`
- Restart Flask server

### Issue: "Module not found: web3"
**Solution:**
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`

### Issue: "Hardhat not found"
**Solution:**
- Install Node dependencies: `npm install`
- Try: `npx hardhat --version`

### Issue: API returns 500 error
**Solution:**
- Check Flask terminal for error details
- Verify Ganache is running
- Check contract is deployed
- Restart Flask server

---

## 🔄 Restart Everything

If things aren't working, try restarting in this order:

1. **Stop everything:**
   - Close Ganache
   - Stop Flask server (Ctrl+C)
   - Close browser

2. **Start fresh:**
   ```bash
   # 1. Start Ganache (click QUICKSTART)

   # 2. Compile contracts
   npx hardhat compile

   # 3. Deploy contracts
   npx hardhat run scripts/deploy.js --network ganache

   # 4. Start Flask server
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   python app.py

   # 5. Open index.html in browser
   ```

---

## 📊 Monitoring

### View Transactions in Ganache:
- Open Ganache
- Click **TRANSACTIONS** tab
- See all certificate uploads and verifications

### View Contracts in Ganache:
- Click **CONTRACTS** tab
- See your deployed contract
- View contract storage

### View Logs:
- Flask server prints all blockchain operations
- Browser console shows frontend activity
- Ganache shows all transactions

---

## 🎯 What's Next?

Once everything is working:

1. **Test the system:**
   - Upload multiple certificates
   - Verify them by different methods
   - Try verifying non-existent certificates

2. **Explore the code:**
   - Read `CertificateVerifier.sol` - the smart contract
   - Check `blockchain_handler.py` - Python blockchain interface
   - Look at `app.py` - Flask API endpoints

3. **Extend the system:**
   - Add more fields to certificates
   - Implement real ZKP verification
   - Add database for off-chain data
   - Deploy to a testnet

---

## 📚 Additional Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **Web3.py Documentation:** https://web3py.readthedocs.io
- **Ganache Documentation:** https://archive.trufflesuite.com/ganache/
- **Solidity Documentation:** https://docs.soliditylang.org
- **Flask Documentation:** https://flask.palletsprojects.com

---

## 🤝 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review terminal/console error messages
3. Verify all prerequisites are installed
4. Try restarting everything
5. Check that all files are in correct folders

---

**Happy Certificate Verifying! 🎓✨**
