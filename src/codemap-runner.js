/**
 * Codemap Binary Runner
 * Executes the codemap binary and captures output
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;

const execAsync = promisify(exec);

/**
 * Run codemap binary on a directory
 * @param {string} repoPath - Path to repository
 * @param {Object} options - Codemap options
 * @returns {Promise<Object>} Codemap results with metadata
 */
async function runCodemap(repoPath, options = {}) {
    // Determine which binary to use based on platform
    const platform = process.platform;
    let binaryName;

    if (platform === 'linux') {
        binaryName = 'codemap-linux';
    } else if (platform === 'darwin') {
        binaryName = 'codemap-macos';
    } else if (platform === 'win32') {
        binaryName = 'codemap.exe';
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const binaryPath = path.join(__dirname, '..', 'binaries', binaryName);

    // Check if binary exists
    try {
        await fs.access(binaryPath);
    } catch (error) {
        throw new Error(`Codemap binary not found at ${binaryPath}. Please download it from https://github.com/JordanCoin/codemap/releases`);
    }

    // Build command arguments
    const args = [];

    if (options.includeDependencies) {
        args.push('--deps');
    }

    if (options.languageFilter) {
        args.push('--lang', options.languageFilter);
    }

    // Add the repository path
    args.push(repoPath);

    // Build full command
    const command = `"${binaryPath}" ${args.join(' ')}`;

    console.log('Running command:', command);

    try {
        // Execute codemap
        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large repos
            timeout: 300000 // 5 minute timeout
        });

        if (stderr) {
            console.warn('Codemap warnings:', stderr);
        }

        // Parse the output to extract stats
        const stats = parseCodemapOutput(stdout);

        return {
            rawOutput: stdout,
            ...stats
        };

    } catch (error) {
        if (error.killed) {
            throw new Error('Codemap execution timed out (>5 minutes). Repository might be too large.');
        }
        throw new Error(`Codemap execution failed: ${error.message}`);
    }
}

/**
 * Parse codemap output to extract statistics
 * @param {string} output - Raw codemap output
 * @returns {Object} Parsed statistics
 */
function parseCodemapOutput(output) {
    const stats = {
        fileCount: 0,
        totalSize: '0B',
        topLanguages: [],
        directories: 0
    };

    try {
        // Extract stats from the header box
        const headerMatch = output.match(/Files: (\d+) \| Size: ([\d.]+[A-Z]+)/);
        if (headerMatch) {
            stats.fileCount = parseInt(headerMatch[1], 10);
            stats.totalSize = headerMatch[2];
        }

        // Extract top extensions
        const extMatch = output.match(/Top Extensions: (.+)/);
        if (extMatch) {
            const extensions = extMatch[1].split(',').map(ext => {
                const match = ext.trim().match(/\.(\w+) \((\d+)\)/);
                if (match) {
                    return { language: match[1], count: parseInt(match[2], 10) };
                }
                return null;
            }).filter(Boolean);

            stats.topLanguages = extensions;
        }

        // Count directories (approximate from tree structure)
        const dirMatches = output.match(/├──\s+\[1;34m/g);
        if (dirMatches) {
            stats.directories = dirMatches.length;
        }

    } catch (error) {
        console.warn('Failed to parse codemap stats:', error.message);
    }

    return stats;
}

/**
 * Get file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Human-readable size
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}${sizes[i]}`;
}

module.exports = {
    runCodemap,
    parseCodemapOutput,
    formatBytes
};
