// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerifier {

    struct Certificate {
        string certificateId;
        string certificateHash;
        string holderName;
        string certificateType;
        string institution;
        uint256 issueDate;
        uint256 timestamp;
        address issuer;
        bool isVerified;
        bool exists;
    }

    // Mapping from certificate ID to Certificate
    mapping(string => Certificate) public certificates;

    // Mapping from hash to certificate ID
    mapping(string => string) public hashToCertId;

    // Array to store all certificate IDs
    string[] public certificateIds;

    // Events
    event CertificateStored(
        string indexed certificateId,
        string certificateHash,
        string holderName,
        address indexed issuer,
        uint256 timestamp
    );

    event CertificateVerified(
        string indexed certificateId,
        address indexed verifier,
        uint256 timestamp
    );

    // Store a new certificate
    function storeCertificate(
        string memory _certificateId,
        string memory _certificateHash,
        string memory _holderName,
        string memory _certificateType,
        string memory _institution,
        uint256 _issueDate
    ) public {
        require(!certificates[_certificateId].exists, "Certificate already exists");
        require(bytes(_certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(_certificateHash).length > 0, "Certificate hash cannot be empty");

        Certificate memory newCert = Certificate({
            certificateId: _certificateId,
            certificateHash: _certificateHash,
            holderName: _holderName,
            certificateType: _certificateType,
            institution: _institution,
            issueDate: _issueDate,
            timestamp: block.timestamp,
            issuer: msg.sender,
            isVerified: true,
            exists: true
        });

        certificates[_certificateId] = newCert;
        hashToCertId[_certificateHash] = _certificateId;
        certificateIds.push(_certificateId);

        emit CertificateStored(
            _certificateId,
            _certificateHash,
            _holderName,
            msg.sender,
            block.timestamp
        );
    }

    // Verify certificate by ID
    function verifyCertificateById(string memory _certificateId) 
        public 
        view 
        returns (
            bool exists,
            string memory certificateHash,
            string memory holderName,
            string memory certificateType,
            string memory institution,
            uint256 issueDate,
            uint256 timestamp,
            address issuer
        ) 
    {
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.exists,
            cert.certificateHash,
            cert.holderName,
            cert.certificateType,
            cert.institution,
            cert.issueDate,
            cert.timestamp,
            cert.issuer
        );
    }

    // Verify certificate by hash
    function verifyCertificateByHash(string memory _hash) 
        public 
        view 
        returns (
            bool exists,
            string memory certificateId,
            string memory holderName,
            string memory certificateType,
            string memory institution
        ) 
    {
        string memory certId = hashToCertId[_hash];
        Certificate memory cert = certificates[certId];
        return (
            cert.exists,
            cert.certificateId,
            cert.holderName,
            cert.certificateType,
            cert.institution
        );
    }

    // Get certificate count
    function getCertificateCount() public view returns (uint256) {
        return certificateIds.length;
    }

    // Get certificate by index
    function getCertificateByIndex(uint256 index) 
        public 
        view 
        returns (
            string memory certificateId,
            string memory holderName,
            string memory certificateType,
            string memory institution,
            uint256 issueDate
        ) 
    {
        require(index < certificateIds.length, "Index out of bounds");
        string memory certId = certificateIds[index];
        Certificate memory cert = certificates[certId];
        return (
            cert.certificateId,
            cert.holderName,
            cert.certificateType,
            cert.institution,
            cert.issueDate
        );
    }

    // Check if certificate exists by ID
    function certificateExists(string memory _certificateId) public view returns (bool) {
        return certificates[_certificateId].exists;
    }

    // Check if hash exists
    function hashExists(string memory _hash) public view returns (bool) {
        string memory certId = hashToCertId[_hash];
        return certificates[certId].exists;
    }
}
