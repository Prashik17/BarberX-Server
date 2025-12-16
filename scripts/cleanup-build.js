import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, '..', 'temp-build');

// Clean up temp directory
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true });
  console.log('Cleaned up temporary build files.');
}