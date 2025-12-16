import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

function addJsExtensions(content) {
  // Replace relative imports without extensions with .js extensions
  return content.replace(
    /(from\s+['"])(\.\/[^'"]+?)(['"])/g,
    (match, prefix, importPath, suffix) => {
      if (!importPath.includes('.') || importPath.endsWith('/')) {
        return `${prefix}${importPath}.js${suffix}`;
      }
      return match;
    }
  ).replace(
    /(from\s+['"])(\.\.\/[^'"]+?)(['"])/g,
    (match, prefix, importPath, suffix) => {
      if (!importPath.includes('.') || importPath.endsWith('/')) {
        return `${prefix}${importPath}.js${suffix}`;
      }
      return match;
    }
  );
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = addJsExtensions(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added .js extensions to: ${path.relative(distDir, filePath)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

if (fs.existsSync(distDir)) {
  console.log('Adding .js extensions to compiled files...');
  processDirectory(distDir);
  console.log('✅ Build post-processing completed!');
} else {
  console.error('❌ dist directory not found. Run tsc first.');
  process.exit(1);
}