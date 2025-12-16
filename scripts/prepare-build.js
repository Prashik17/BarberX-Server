import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const tempDir = path.join(__dirname, '..', 'temp-build');

function convertImportsInContent(content) {
  // Convert .ts extensions to no extension for TypeScript compilation
  content = content.replace(
    /from\s+['"]([^'"]+)\.ts['"]/g,
    'from "$1"'
  );
  
  content = content.replace(
    /import\s+(['"][^'"]+)\.ts(['"])/g,
    'import $1$2'
  );
  
  return content;
}

function copyAndConvertDirectory(srcPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  
  const files = fs.readdirSync(srcPath);
  
  files.forEach(file => {
    const srcFilePath = path.join(srcPath, file);
    const destFilePath = path.join(destPath, file);
    const stat = fs.statSync(srcFilePath);
    
    if (stat.isDirectory()) {
      copyAndConvertDirectory(srcFilePath, destFilePath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(srcFilePath, 'utf8');
      const convertedContent = convertImportsInContent(content);
      fs.writeFileSync(destFilePath, convertedContent, 'utf8');
      console.log(`Converted: ${srcFilePath} -> ${destFilePath}`);
    } else {
      fs.copyFileSync(srcFilePath, destFilePath);
      console.log(`Copied: ${srcFilePath} -> ${destFilePath}`);
    }
  });
}

// Clean temp directory if it exists
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true });
}

console.log('Preparing source files for build...');
copyAndConvertDirectory(srcDir, tempDir);
console.log('Build preparation completed!');