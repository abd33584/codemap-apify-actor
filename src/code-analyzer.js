/**
 * Code Analyzer
 * Enhanced analysis of repository structure, dependencies, and code patterns
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Analyze repository for deeper insights
 * @param {string} repoPath - Path to repository
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeRepository(repoPath) {
    const analysis = {
        fileStructure: [],
        dependencies: {},
        languages: {},
        insights: {
            totalFiles: 0,
            totalLines: 0,
            largestFiles: [],
            packageManagers: [],
            frameworks: []
        }
    };

    try {
        await walkDirectory(repoPath, repoPath, analysis);
        analysis.insights.largestFiles = findLargestFiles(analysis.fileStructure);
        analysis.insights.packageManagers = detectPackageManagers(analysis.fileStructure);
        analysis.insights.frameworks = detectFrameworks(analysis.fileStructure);

        return analysis;
    } catch (error) {
        console.error('Analysis error:', error.message);
        return analysis;
    }
}

/**
 * Recursively walk directory and analyze files
 */
async function walkDirectory(currentPath, basePath, analysis, depth = 0) {
    if (depth > 10) return; // Prevent too deep recursion

    try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            const relativePath = path.relative(basePath, fullPath);

            // Skip hidden files and common ignore patterns
            if (shouldSkip(entry.name)) continue;

            if (entry.isDirectory()) {
                await walkDirectory(fullPath, basePath, analysis, depth + 1);
            } else if (entry.isFile()) {
                const fileInfo = await analyzeFile(fullPath, relativePath);
                if (fileInfo) {
                    analysis.fileStructure.push(fileInfo);
                    analysis.insights.totalFiles++;
                    analysis.insights.totalLines += fileInfo.lines;

                    // Track language stats
                    const ext = path.extname(entry.name);
                    if (ext) {
                        analysis.languages[ext] = (analysis.languages[ext] || 0) + 1;
                    }
                }
            }
        }
    } catch (error) {
        // Skip directories we can't read
    }
}

/**
 * Analyze individual file
 */
async function analyzeFile(filePath, relativePath) {
    try {
        const stats = await fs.stat(filePath);

        // Skip large binary files
        if (stats.size > 10 * 1024 * 1024) return null; // Skip files > 10MB

        const ext = path.extname(filePath).toLowerCase();
        const isText = isTextFile(ext);

        const fileInfo = {
            path: relativePath,
            name: path.basename(filePath),
            extension: ext,
            size: stats.size,
            lines: 0,
            type: getFileType(ext)
        };

        if (isText) {
            try {
                const content = await fs.readFile(filePath, 'utf8');
                fileInfo.lines = content.split('\n').length;

                // Extract code structure for supported languages
                if (['js', 'ts', 'jsx', 'tsx', 'py', 'go', 'java', 'rb'].includes(ext.slice(1))) {
                    fileInfo.structure = extractStructure(content, ext);
                }
            } catch (error) {
                // Skip files we can't read as text
            }
        }

        return fileInfo;
    } catch (error) {
        return null;
    }
}

/**
 * Extract code structure (functions, classes, imports)
 */
function extractStructure(content, ext) {
    const structure = {
        imports: [],
        exports: [],
        functions: [],
        classes: []
    };

    const lines = content.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();

        // JavaScript/TypeScript
        if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
            if (trimmed.startsWith('import ')) {
                structure.imports.push(extractImport(trimmed));
            } else if (trimmed.startsWith('export ')) {
                structure.exports.push(trimmed.substring(0, 50));
            } else if (trimmed.match(/^(async\s+)?function\s+\w+/)) {
                structure.functions.push(extractFunctionName(trimmed));
            } else if (trimmed.match(/^class\s+\w+/)) {
                structure.classes.push(extractClassName(trimmed));
            }
        }

        // Python
        else if (ext === '.py') {
            if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
                structure.imports.push(trimmed.substring(0, 50));
            } else if (trimmed.match(/^def\s+\w+/)) {
                structure.functions.push(extractPythonFunction(trimmed));
            } else if (trimmed.match(/^class\s+\w+/)) {
                structure.classes.push(extractClassName(trimmed));
            }
        }
    }

    return structure;
}

/**
 * Helper functions for structure extraction
 */
function extractImport(line) {
    const match = line.match(/import\s+(?:{[^}]+}|\S+)\s+from\s+['"]([^'"]+)['"]/);
    return match ? match[1] : line.substring(0, 50);
}

function extractFunctionName(line) {
    const match = line.match(/function\s+(\w+)/);
    return match ? match[1] : 'anonymous';
}

function extractClassName(line) {
    const match = line.match(/class\s+(\w+)/);
    return match ? match[1] : 'Unknown';
}

function extractPythonFunction(line) {
    const match = line.match(/def\s+(\w+)/);
    return match ? match[1] : 'anonymous';
}

/**
 * Determine if file is text-based
 */
function isTextFile(ext) {
    const textExtensions = [
        '.js', '.ts', '.jsx', '.tsx', '.py', '.rb', '.go', '.java', '.c', '.cpp', '.h',
        '.css', '.scss', '.sass', '.less', '.html', '.xml', '.json', '.yaml', '.yml',
        '.md', '.txt', '.sh', '.bash', '.sql', '.php', '.swift', '.kt', '.rs', '.dart'
    ];
    return textExtensions.includes(ext.toLowerCase());
}

/**
 * Get file type category
 */
function getFileType(ext) {
    const types = {
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.jsx': 'React',
        '.tsx': 'React TypeScript',
        '.py': 'Python',
        '.go': 'Go',
        '.java': 'Java',
        '.rb': 'Ruby',
        '.php': 'PHP',
        '.css': 'Stylesheet',
        '.scss': 'Stylesheet',
        '.html': 'HTML',
        '.json': 'Config',
        '.yaml': 'Config',
        '.yml': 'Config',
        '.md': 'Documentation',
        '.sql': 'Database'
    };
    return types[ext.toLowerCase()] || 'Other';
}

/**
 * Check if file/dir should be skipped
 */
function shouldSkip(name) {
    const skipPatterns = [
        'node_modules', '.git', '.next', 'dist', 'build', '__pycache__',
        'vendor', 'target', '.cache', 'coverage', '.venv', 'venv'
    ];
    return name.startsWith('.') || skipPatterns.includes(name);
}

/**
 * Find largest files
 */
function findLargestFiles(files) {
    return files
        .sort((a, b) => b.size - a.size)
        .slice(0, 10)
        .map(f => ({ path: f.path, size: formatBytes(f.size), lines: f.lines }));
}

/**
 * Detect package managers
 */
function detectPackageManagers(files) {
    const managers = [];
    const fileNames = files.map(f => f.name);

    if (fileNames.includes('package.json')) managers.push('npm/yarn');
    if (fileNames.includes('requirements.txt') || fileNames.includes('Pipfile')) managers.push('pip');
    if (fileNames.includes('go.mod')) managers.push('go modules');
    if (fileNames.includes('Cargo.toml')) managers.push('cargo');
    if (fileNames.includes('pom.xml') || fileNames.includes('build.gradle')) managers.push('maven/gradle');

    return managers;
}

/**
 * Detect frameworks
 */
function detectFrameworks(files) {
    const frameworks = [];
    const fileNames = files.map(f => f.name);

    if (fileNames.includes('next.config.js')) frameworks.push('Next.js');
    if (fileNames.some(f => f.includes('react'))) frameworks.push('React');
    if (fileNames.includes('vue.config.js')) frameworks.push('Vue');
    if (fileNames.includes('angular.json')) frameworks.push('Angular');
    if (fileNames.includes('manage.py')) frameworks.push('Django');
    if (fileNames.includes('app.py') || fileNames.includes('wsgi.py')) frameworks.push('Flask');

    return frameworks;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

module.exports = {
    analyzeRepository,
    extractStructure
};
