#!/usr/bin/env node

/**
 * This script renames Module Federation files that start with __federation_
 * to federation_ (removing both leading underscores) so Jekyll will process them.
 * Jekyll ignores files starting with a single underscore, so we need to remove both.
 * It also updates the manifest files to reference the new filenames.
 */

const fs = require('fs');
const path = require('path');

const listingsDir = path.join(__dirname, '../assets/js/widgets/listings');

// Files to rename: __federation_* -> federation_* (remove both leading underscores)
const filesToRename = [
  '__federation_expose_App.js',
  '__federation_expose_App.js.map',
  '__federation_expose_App.css',
  '__federation_expose_App.css.map',
];

// Manifest files that need to be updated
const manifestFiles = [
  'mf-manifest.json',
  'mf-stats.json',
];

function renameFiles() {
  console.log('Renaming Module Federation files...');
  
  filesToRename.forEach(oldName => {
    const oldPath = path.join(listingsDir, oldName);
    // Remove both leading underscores so Jekyll will process the files
    const newName = oldName.replace(/^__/, '');
    const newPath = path.join(listingsDir, newName);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`  Renamed: ${oldName} -> ${newName}`);
    } else {
      console.warn(`  Warning: File not found: ${oldName}`);
    }
  });
}

function updateManifests() {
  console.log('Updating manifest files...');
  
  manifestFiles.forEach(manifestFile => {
    const manifestPath = path.join(listingsDir, manifestFile);
    
    if (!fs.existsSync(manifestPath)) {
      console.warn(`  Warning: Manifest not found: ${manifestFile}`);
      return;
    }
    
    let content = fs.readFileSync(manifestPath, 'utf8');
    const originalContent = content;
    
    // Replace all occurrences of __federation_ with federation_ (remove both leading underscores)
    content = content.replace(/__federation_/g, 'federation_');
    
    if (content !== originalContent) {
      fs.writeFileSync(manifestPath, content, 'utf8');
      console.log(`  Updated: ${manifestFile}`);
    } else {
      console.log(`  No changes needed: ${manifestFile}`);
    }
  });
}

// Also update source map references in the renamed files
function updateSourceMaps() {
  console.log('Updating source map references...');
  
  const filesWithSourceMaps = [
    'federation_expose_App.js',
    'federation_expose_App.css',
  ];
  
  filesWithSourceMaps.forEach(fileName => {
    const filePath = path.join(listingsDir, fileName);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Update source map references
      content = content.replace(/__federation_/g, 'federation_');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Updated source map reference in: ${fileName}`);
      }
    }
  });
}

// Main execution
try {
  renameFiles();
  updateManifests();
  updateSourceMaps();
  console.log('✓ Successfully fixed Module Federation files for Jekyll');
} catch (error) {
  console.error('✗ Error fixing Module Federation files:', error);
  process.exit(1);
}

