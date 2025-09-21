const os = require('os');

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  
  // Common names for WiFi interfaces on different systems
  const wifiNames = ['Wi-Fi', 'wifi', 'wlan0', 'en0', 'en1', 'eth0'];
  
  // First, try to find a WiFi interface with a proper IP
  for (const wifiName of wifiNames) {
    if (interfaces[wifiName]) {
      for (const alias of interfaces[wifiName]) {
        if (alias.family === 'IPv4' && !alias.internal && !alias.address.startsWith('169.254')) {
          return alias.address;
        }
      }
    }
  }
  
  // Check all interfaces for a valid IP (excluding localhost and APIPA)
  for (const name in interfaces) {
    for (const alias of interfaces[name]) {
      if (alias.family === 'IPv4' && !alias.internal && !alias.address.startsWith('169.254')) {
        return alias.address;
      }
    }
  }
  
  // If we still haven't found anything, try APIPA addresses as last resort
  for (const name in interfaces) {
    for (const alias of interfaces[name]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  return 'localhost';
}

console.log('Network IP:', getNetworkIp());
console.log('If the above IP does not work, try one of these:');
const interfaces = os.networkInterfaces();
for (const name in interfaces) {
  for (const alias of interfaces[name]) {
    if (alias.family === 'IPv4' && !alias.internal) {
      console.log(`  ${name}: ${alias.address}`);
    }
  }
}