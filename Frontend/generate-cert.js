const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create certificates directory if it doesn't exist
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

// Check if certificates already exist
const certPath = path.join(certDir, 'localhost-cert.pem');
const keyPath = path.join(certDir, 'localhost-key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('Generating self-signed certificate...');
  
  try {
    // Generate private key and certificate using OpenSSL
    execSync(
      `openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/CN=localhost"`,
      { stdio: 'inherit' }
    );
    
    console.log('Certificate generated successfully!');
    console.log('Certificate location:', certPath);
    console.log('Key location:', keyPath);
  } catch (error) {
    console.error('Failed to generate certificate. Make sure OpenSSL is installed.');
    console.error('You can install OpenSSL from https://slproweb.com/products/Win32OpenSSL.html');
    
    // Create a simple fallback certificate for development
    console.log('Creating fallback certificate...');
    
    // Write placeholder files
    fs.writeFileSync(certPath, '-----BEGIN CERTIFICATE-----\nDEVELOPMENT CERTIFICATE\n-----END CERTIFICATE-----');
    fs.writeFileSync(keyPath, '-----BEGIN PRIVATE KEY-----\nDEVELOPMENT KEY\n-----END PRIVATE KEY-----');
  }
} else {
  console.log('Certificate already exists');
}