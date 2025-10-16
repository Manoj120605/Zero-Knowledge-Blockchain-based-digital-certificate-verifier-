# Zero-Knowledge-Blockchain-based-digital-certificate-verifier-
This project focuses on verifying certificates with zero knowledge proof (Verifying without personal sensitive information). This project uses Ethereum blockchain for decentralization and integrity. Can run blockchain with Ganache and metamask for locally running in sandbox environment.
Here is a professional, comprehensive README content for your ZKP Certificate Verifier project on GitHub. This template highlights the purpose, features, setup instructions, technologies used, and contribution guidelines, designed to attract users and collaborators:

***

# Zero Knowledge Proof Digital Certificate Verifier Using Blockchain

## Overview

This project delivers a **privacy-preserving digital certificate verification system** using cutting-edge blockchain and cryptographic zero-knowledge proofs (ZKPs). It enables users and verifiers to **authenticate certificates without revealing sensitive information**, ensuring trust and data confidentiality. The backend uses **Java Spring Boot** together with the **DIZK library** for proof generation, while a **private Ethereum blockchain** provides immutable certificate storage. The frontend is built with **React and Material-UI**, offering a professional, user-friendly interface.

## Features

- Secure certificate upload with metadata extraction  
- Privacy-preserving verification using zk-SNARK zero-knowledge proofs  
- Immutable storage of certificates on Ethereum smart contracts  
- Real-time verification results with detailed proof information  
- Admin dashboard with user management and system statistics  
- Fast development builds using Maven Daemon (mvnd)  
- Dockerized setup for easy deployment

## Technology Stack

- Backend: Java 17, Spring Boot, Maven Daemon (mvnd)  
- Frontend: React 18, TypeScript, Material-UI  
- Blockchain: Ethereum (Ganache, Solidity, Web3j)  
- Database: MySQL 8.0, JDBC  
- Tools: Docker, IntelliJ IDEA, VS Code

## Getting Started

### Prerequisites

- Java 17 or above  
- Node.js 18+ and npm/yarn  
- MySQL 8.0 or Docker with MySQL container  
- Docker and Docker Compose (optional but recommended)  
- Git  

### Installation and Running

1. Clone the repository:  
   ```bash  
   git clone https://github.com/Manoj120605/Zero-Knowledge-Blockchain-based-digital-certificate-verifier-.git 
   cd zkp-certificate-verifier  
   ```
2. Start MySQL:  
   ```bash  
   docker-compose -f database/docker-compose.yml up -d  
   ```
3. Initialize database schema:  
   ```bash  
   mysql -u root -p < database/schema/init.sql  
   ```
4. Backend:  
   ```bash  
   cd backend  
   mvnd clean install  
   mvnd spring-boot:run  
   ```
5. Blockchain (Local Ethereum):  
   ```bash  
   cd blockchain  
   npm install  
   npx ganache-cli --deterministic  
   npx truffle migrate --reset  
   ```
6. Frontend:  
   ```bash  
   cd frontend  
   npm install  
   npm start  
   ```

Visit `http://localhost:3000` for the frontend and `http://localhost:8080/api` for backend API.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for bug fixes, enhancements, or new features. For major changes, open an issue first to discuss your ideas.

## License

This project is licensed under the MIT License.

***

