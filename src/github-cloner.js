/**
 * GitHub Repository Cloner
 * Handles cloning GitHub repos to temporary directories
 */

const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Clone a GitHub repository to a temporary directory
 * @param {string} repositoryUrl - GitHub repository URL
 * @param {string} branch - Branch to clone
 * @returns {Promise<string>} Path to cloned repository
 */
async function cloneRepository(repositoryUrl, branch = null) {
    // Create temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codemap-'));

    console.log(`Cloning ${repositoryUrl}${branch ? ` (branch: ${branch})` : ''} to ${tempDir}...`);

    try {
        const git = simpleGit();

        const cloneOptions = ['--depth', '1'];

        // If branch specified, use it; otherwise clone default branch
        if (branch) {
            cloneOptions.push('--single-branch', '--branch', branch);
        }

        await git.clone(repositoryUrl, tempDir, cloneOptions);

        console.log('✅ Clone successful');
        return tempDir;

    } catch (error) {
        // Cleanup on failure
        await cleanupRepository(tempDir);

        if (error.message.includes('Repository not found')) {
            throw new Error(`Repository not found: ${repositoryUrl}. Make sure it's public or provide authentication.`);
        } else if (error.message.includes('Remote branch')) {
            throw new Error(`Branch '${branch}' not found in repository ${repositoryUrl}. Try 'master' or leave branch empty to use default.`);
        } else {
            throw new Error(`Failed to clone repository: ${error.message}`);
        }
    }
}

/**
 * Remove cloned repository directory
 * @param {string} repoPath - Path to repository
 */
async function cleanupRepository(repoPath) {
    if (!repoPath) return;

    try {
        await fs.rm(repoPath, { recursive: true, force: true });
        console.log(`Cleaned up temporary directory: ${repoPath}`);
    } catch (error) {
        console.warn(`Warning: Failed to cleanup ${repoPath}:`, error.message);
    }
}

/**
 * Extract repository name from URL
 * @param {string} repositoryUrl - GitHub repository URL
 * @returns {string} Repository name (user/repo)
 */
function extractRepoName(repositoryUrl) {
    const match = repositoryUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!match) {
        throw new Error('Invalid GitHub repository URL');
    }
    return match[1].replace(/\.git$/, '');
}

module.exports = {
    cloneRepository,
    cleanupRepository,
    extractRepoName
};
