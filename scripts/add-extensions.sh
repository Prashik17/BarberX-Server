#!/bin/bash

echo "Adding .js extensions to compiled files..."

# Find all .js files in dist and add .js extensions to relative imports that don't already have extensions
find dist -name "*.js" -type f -exec sed -i '' 's/from "\.\/\([^"]*\)"/from ".\/\1.js"/g' {} \;
find dist -name "*.js" -type f -exec sed -i '' 's/from "\.\.\/\([^"]*\)"/from "..\/\1.js"/g' {} \;

# Fix double extensions that may have been added
find dist -name "*.js" -type f -exec sed -i '' 's/\.js\.js/.js/g' {} \;

echo "✅ Build post-processing completed!"