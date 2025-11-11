# 🚀 Quick Reference Card - Certificate Verifier

## ⚡ Essential Commands

### Initial Setup (One Time)
```bash
# Install Node.js dependencies
npm install

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate          # macOS/Linux
venv\Scripts\activate             # Windows

# Install Python dependencies
pip install -r requirements.txt

# Create folder structure
mkdir contracts scripts deployments uploads
mv CertificateVerifier.sol contracts/
mv deploy.js scripts/
```

---

### Compilation & Deployment

```bash
# Compile smart contract
npx hardhat compile

# Deploy to Ganache (make sure Ganache is running!)
npx hardhat run scripts/deploy.js --network ganache

# OR use npm script
npm run deploy
```

---

### Running the System

```bash
# Terminal 1: Start Flask API
source venv/bin/activate    # Activate venv first
python app.py

# Terminal 2 (or just open in browser): Open frontend
# Double-click index.html
# OR use local server:
python -m http.server 8000
# Then open http://localhost:8000
```

---

### Testing

```bash
# Test blockchain connection
python blockchain_handler.py

# Test API health
curl http://127.0.0.1:5000/

# Test blockchain info
curl http://127.0.0.1:5000/api/blockchain/info
```

---

## 📍 Important URLs

| Service | URL |
|---------|-----|
| Ganache RPC | http://127.0.0.1:7545 |
| Flask API | http://127.0.0.1:5000 |
| Frontend | file:///path/to/index.html |
| API Health Check | http://127.0.0.1:5000/ |
| Blockchain Info | http://127.0.0.1:5000/api/blockchain/info |

---

## 📁 Key Files & Locations

| File | Location | Purpose |
|------|----------|---------|
| Smart Contract | `contracts/CertificateVerifier.sol` | Blockchain logic |
| Python Handler | `blockchain_handler.py` | Blockchain interface |
| API Server | `app.py` | REST API endpoints |
| Frontend Script | `web3_integration.js` | Frontend integration |
| Deployment Info | `deployments/CertificateVerifier.json` | Contract address & ABI |
| Uploaded Files | `uploads/` | Certificate files |

---

## 🔧 Troubleshooting Commands

```bash
# Check Ganache connection
curl http://127.0.0.1:7545

# View deployed contract info
cat deployments/CertificateVerifier.json

# Check Python packages
pip list | grep web3

# Check Node packages
npm list --depth=0

# Clean Hardhat artifacts
npx hardhat clean

# View Hardhat accounts
npx hardhat accounts --network ganache
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to Ganache" | Start Ganache, check port 7545 |
| "Contract not found" | Run `npm run deploy` |
| "Module not found" | Run `npm install` or `pip install -r requirements.txt` |
| "CORS error" | Check Flask server is running, restart it |
| "Transaction failed" | Check Ganache has ETH, verify contract deployed |

---

## 📊 Monitoring

### View in Ganache:
- **ACCOUNTS** tab: See all accounts and balances
- **BLOCKS** tab: See mined blocks
- **TRANSACTIONS** tab: See all transactions
- **CONTRACTS** tab: See deployed contracts
- **EVENTS** tab: See contract events
- **LOGS** tab: See Ganache logs

### View API Logs:
- Check Flask terminal for all API requests
- See blockchain operations in real-time
- View transaction hashes and gas used

### Browser Console:
- Press F12 to open developer tools
- Check Console tab for frontend logs
- See network requests in Network tab

---

## 🎯 Workflow

### Upload Certificate:
1. Open frontend (index.html)
2. Fill form with certificate details
3. Upload file (PDF/PNG/JPG)
4. Click "Upload Certificate"
5. Note the Certificate ID
6. Check Ganache TRANSACTIONS tab

### Verify Certificate:
1. Enter Certificate ID in verify form
2. Click "Verify Certificate"
3. View certificate details
4. Check blockchain for transaction

---

## 📝 API Endpoints Quick Reference

```bash
# Health check
GET http://127.0.0.1:5000/

# Get blockchain info
GET http://127.0.0.1:5000/api/blockchain/info

# Upload certificate
POST http://127.0.0.1:5000/api/certificate/upload
Content-Type: multipart/form-data
Body: file, certificateId, holderName, certificateType, issueDate, institution

# Verify by ID
POST http://127.0.0.1:5000/api/certificate/verify/id
Content-Type: application/json
Body: {"certificateId": "CERT-123"}

# Verify by hash
POST http://127.0.0.1:5000/api/certificate/verify/hash
Content-Type: application/json
Body: {"certificateHash": "0x..."}

# Verify by file
POST http://127.0.0.1:5000/api/certificate/verify/file
Content-Type: multipart/form-data
Body: file

# List all certificates
GET http://127.0.0.1:5000/api/certificates/list

# Generate ZK proof
POST http://127.0.0.1:5000/api/zkp/generate
Content-Type: application/json
Body: {"certificateId": "CERT-123"}
```

---

## 🔄 Restart Procedure

If something goes wrong, restart in this order:

```bash
# 1. Stop everything
# - Close Ganache
# - Press Ctrl+C in Flask terminal
# - Close browser

# 2. Start Ganache
# - Open Ganache
# - Click QUICKSTART ETHEREUM

# 3. Redeploy contract
npx hardhat run scripts/deploy.js --network ganache

# 4. Start Flask server
source venv/bin/activate
python app.py

# 5. Open frontend
# Open index.html in browser
```

---

## 💡 Pro Tips

1. **Keep Ganache open** - Don't close it while developing
2. **Watch Flask logs** - They show all blockchain operations
3. **Check browser console** - Shows frontend errors
4. **Save Certificate IDs** - You'll need them to verify
5. **Use Ganache's visual tools** - Great for debugging
6. **Virtual environment** - Always activate before running Python
7. **Clean artifacts** - Run `npx hardhat clean` if compilation fails
8. **Fresh deploy** - Redeploy contract if you make changes

---

## 🎓 Learning Path

1. **Start Here:**
   - Read SETUP_GUIDE.md
   - Follow setup steps
   - Get everything running

2. **Understand the Code:**
   - Read CertificateVerifier.sol comments
   - Study blockchain_handler.py
   - Review app.py endpoints

3. **Experiment:**
   - Upload certificates
   - Verify them
   - Check Ganache
   - View API responses

4. **Extend:**
   - Add new features to smart contract
   - Create new API endpoints
   - Enhance frontend

---

## 📚 Documentation

- **Full documentation:** README.md
- **Setup guide:** SETUP_GUIDE.md
- **File overview:** FILE_SUMMARY.md
- **This reference:** QUICK_REFERENCE.md

---

## ✅ Pre-Flight Checklist

Before starting work, verify:
- [ ] Ganache is running (port 7545)
- [ ] Virtual environment is activated
- [ ] Contract is deployed (check deployments/ folder)
- [ ] Flask server is running (port 5000)
- [ ] No error messages anywhere

---

## 🎯 Success Indicators

You know it's working when:
- ✅ Ganache shows transactions
- ✅ Flask logs show "Certificate stored successfully"
- ✅ Frontend shows success notification
- ✅ Certificate appears in Ganache TRANSACTIONS
- ✅ Verification returns certificate details
- ✅ No errors in any terminal or console

---

**Keep this reference handy while developing! 📌**
