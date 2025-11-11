const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🚀 Starting deployment of CertificateVerifier contract...\n");

  // Get the contract factory
  const CertificateVerifier = await hre.ethers.getContractFactory("CertificateVerifier");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const certificateVerifier = await CertificateVerifier.deploy();

  await certificateVerifier.waitForDeployment();

  const contractAddress = await certificateVerifier.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);

  // Save contract address and ABI
  const contractInfo = {
    address: contractAddress,
    abi: JSON.parse(certificateVerifier.interface.formatJson()),
    network: hre.network.name,
    deploymentTime: new Date().toISOString()
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentPath = path.join(deploymentsDir, "CertificateVerifier.json");
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("📄 Contract info saved to:", deploymentPath);

  // Also save to a Python-friendly format for blockchain_handler.py
  const pythonDeploymentPath = path.join(deploymentsDir, "contract_abi.json");
  fs.writeFileSync(
    pythonDeploymentPath,
    JSON.stringify(contractInfo.abi, null, 2)
  );

  console.log("🐍 Python-compatible ABI saved to:", pythonDeploymentPath);

  // Test the contract
  console.log("\n🧪 Testing contract functions...");

  // Get certificate count (should be 0)
  const count = await certificateVerifier.getCertificateCount();
  console.log("✓ Initial certificate count:", count.toString());

  // Test storing a certificate
  const testCertId = "CERT-2024-001";
  const testHash = "0x" + "a".repeat(64); // Mock hash
  const testHolder = "John Doe";
  const testType = "Bachelor of Computer Science";
  const testInstitution = "MIT";
  const testIssueDate = Math.floor(Date.now() / 1000);

  console.log("\n📝 Storing test certificate...");
  const tx = await certificateVerifier.storeCertificate(
    testCertId,
    testHash,
    testHolder,
    testType,
    testInstitution,
    testIssueDate
  );

  await tx.wait();
  console.log("✓ Test certificate stored successfully!");
  console.log("  Transaction Hash:", tx.hash);

  // Verify the certificate
  const certData = await certificateVerifier.verifyCertificateById(testCertId);
  console.log("\n✅ Certificate verification successful!");
  console.log("  Certificate ID:", testCertId);
  console.log("  Holder:", certData[2]); // holderName
  console.log("  Type:", certData[3]); // certificateType
  console.log("  Institution:", certData[4]); // institution

  console.log("\n🎉 Deployment and testing completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("  1. Update blockchain_handler.py with the contract address");
  console.log("  2. Run the Flask API server");
  console.log("  3. Open index.html in a browser");
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
