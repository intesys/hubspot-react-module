#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

// Convert string to PascalCase
const toPascalCase = (str) => {
    return str
        .split(/[^a-zA-Z0-9]/) // Split by non-alphanumeric characters
        .filter((part) => part.length > 0) // Remove empty parts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize first letter
        .join("");
};

// Get target directory from command line args or use current directory
const targetDir = process.argv[2] || ".";
const moduleName = toPascalCase((process.argv[3] || targetDir).replace(/[\\/]/g, "-")); // slashes are not allowed in module names
const sourceDir = path.join(__dirname, "..");

console.log(`Installing configuratore.module to ${targetDir}...`);

// Create target directory if it doesn't exist
fs.ensureDirSync(targetDir);

// Files/directories to copy (excluding node_modules, dist, etc.)
const filesToCopy = [
    "src",
    "tsconfig.json",
    "package.json",
    "fields.json",
    "meta.json",
    "module.css",
    "module.html",
    // Add any other files/folders needed
];

// Function to check if a file should have replacements
const shouldProcessFile = (filePath) => {
    const extensions = [".json", ".html", ".css", ".js", ".jsx", ".ts", ".tsx"];
    return extensions.some((ext) => filePath.endsWith(ext));
};

// Function to replace {{{Module}}} in a file
const replaceInFile = (filePath) => {
    if (shouldProcessFile(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");
        if (content.includes("{{{Module}}}")) {
            console.log(`  Replacing {{{Module}}} in ${filePath}`);
            content = content.replace(/{{{Module}}}/g, moduleName);
            fs.writeFileSync(filePath, content, "utf8");
        }
    }
};

// Function to process a directory recursively
const processDirectory = (dirPath) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.statSync(fullPath).isDirectory()) {
            // Recursively process subdirectories
            processDirectory(fullPath);
        } else {
            // Process individual file
            replaceInFile(fullPath);
        }
    });
};

// Copy each file/directory
filesToCopy.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    if (fs.existsSync(sourcePath)) {
        console.log(`Copying ${file}...`);
        fs.copySync(sourcePath, targetPath);

        // Process the copied file or directory
        if (fs.statSync(targetPath).isDirectory()) {
            processDirectory(targetPath);
        } else {
            replaceInFile(targetPath);
        }
    }
});

console.log("Module created!");
console.log('Run "npm install" in the target directory to install dependencies.');
