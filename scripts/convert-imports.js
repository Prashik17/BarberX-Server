import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

function convertImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add .js extensions to relative imports that don't have extensions
  content = content.replace(
    /from\s+['"](\.[^'"]+)['"];/g,
    (match, importPath) => {
      if (!importPath.includes('.') || importPath.endsWith('/')) {
        return `from "${importPath}.js";`;
      }
      return match;
    }
  );
  
  content = content.replace(
    /import\s+(.*?)\s+from\s+['"](\.[^'"]+)['"];/g,
    (match, importedItems, importPath) => {
      if (!importPath.includes('.') || importPath.endsWith('/')) {
        return `import ${importedItems} from "${importPath}.js";`;
      }
      return match;
    }
  );
  
  return content;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      const content = convertImportsInFile(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Converted imports in: ${filePath}`);
    }
  });
}

if (fs.existsSync(distDir)) {
  console.log('Converting .ts imports to .js imports in compiled files...');
  processDirectory(distDir);
  console.log('Import conversion completed!');
} else {
  console.error('dist directory not found. Run tsc first.');
  process.exit(1);
}