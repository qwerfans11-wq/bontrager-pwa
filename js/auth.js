// ══════════════════════════════════════════════
// AUTH MODULE — Credentials & Developer Access
// ══════════════════════════════════════════════

// SHA-256 credential hashes
// Username: Qutaiba
// Password: 2006-02-20
const _UH = 'e11bec3e4a9e13ab8f92cee667e006c8f1bc82dcc3e4389f6cf001bd91c4f3e3';
const _PH = 'b76819a2cac461de5cb8ae880ad00d010767c3c7bc4f0ef8e743d00571b79c62';

// SHA-256 hash function
async function _hash(s) {
  const msgBuffer = new TextEncoder().encode(s);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Check credentials
async function _chkCreds(u, p) {
  const userHash = await _hash(u);
  const passHash = await _hash(p);
  return userHash === _UH && passHash === _PH;
}

// Function to generate hash for new credentials (for development)
// Example: generateHash('newUser') for creating new hashes
async function generateHash(str) {
  const hash = await _hash(str);
  console.log(`Hash for "${str}": ${hash}`);
  return hash;
}
