/**
 * Output Formatter
 * Formats codemap results into various output formats
 */

const { extractRepoName } = require('./github-cloner');

/**
 * Format codemap results for output
 * @param {Object} codemapResult - Raw codemap results
 * @param {string} repositoryUrl - Repository URL
 * @param {string} format - Output format (markdown, json, both)
 * @returns {Promise<Object>} Formatted output
 */
async function formatOutput(codemapResult, repositoryUrl, format = 'markdown') {
    const repoName = extractRepoName(repositoryUrl);
    const timestamp = new Date().toISOString();

    const baseOutput = {
        repository: repoName,
        repositoryUrl: repositoryUrl,
        generatedAt: timestamp,
        fileCount: codemapResult.fileCount,
        totalSize: codemapResult.totalSize,
        topLanguages: codemapResult.topLanguages || [],
        directories: codemapResult.directories || 0
    };

    if (format === 'markdown' || format === 'both') {
        baseOutput.codemap = formatMarkdown(codemapResult.rawOutput, repoName, timestamp);
    }

    if (format === 'json' || format === 'both') {
        baseOutput.codemapJson = formatJson(codemapResult, repoName);
    }

    // Add usage instructions
    baseOutput.usage = {
        forAI: 'Copy the codemap content and paste it at the start of your AI conversation for instant project context.',
        forDocs: 'Use the markdown output for project documentation or README files.',
        forAPI: 'Use the JSON output for programmatic processing or integration with other tools.'
    };

    return baseOutput;
}

/**
 * Format as enhanced markdown
 * @param {string} rawOutput - Raw codemap output
 * @param {string} repoName - Repository name
 * @param {string} timestamp - Generation timestamp
 * @returns {string} Formatted markdown
 */
function formatMarkdown(rawOutput, repoName, timestamp) {
    const header = `# Codemap: ${repoName}

**Generated**: ${timestamp}
**Tool**: Codemap Generator (Apify Actor)
**Purpose**: AI-optimized project structure for ChatGPT, Claude, and other AI coding assistants

---

## How to Use This Codemap

### For AI Tools (ChatGPT, Claude, etc.)
1. Copy the entire content below
2. Paste at the start of your AI conversation
3. AI will now understand your full project structure instantly

### For Developers
- Quick project overview
- Find files and functions fast
- Understand architecture at a glance

---

## Repository Structure

`;

    return header + rawOutput + `

---

## Tips for AI Assistants

When analyzing this codemap:
- ⭐ Files marked with ⭐ are the largest/most important
- Languages are color-coded for easy scanning
- Directory structure shows project organization
- Import statements reveal dependencies
- Function/class listings show key components

**Token Efficiency**: This codemap represents hundreds of files in a compact, scannable format - saving thousands of tokens compared to pasting individual files.
`;
}

/**
 * Format as structured JSON
 * @param {Object} codemapResult - Raw codemap results
 * @param {string} repoName - Repository name
 * @returns {Object} Structured JSON
 */
function formatJson(codemapResult, repoName) {
    return {
        project: repoName,
        statistics: {
            files: codemapResult.fileCount,
            size: codemapResult.totalSize,
            directories: codemapResult.directories,
            languages: codemapResult.topLanguages
        },
        structure: parseStructure(codemapResult.rawOutput),
        rawMap: codemapResult.rawOutput
    };
}

/**
 * Parse structure from codemap output (basic parsing)
 * @param {string} output - Raw output
 * @returns {Object} Parsed structure
 */
function parseStructure(output) {
    // This is a simplified parser - could be enhanced
    const lines = output.split('\n');
    const structure = {
        directories: [],
        files: []
    };

    lines.forEach(line => {
        // Detect directories
        if (line.includes('├──') || line.includes('└──')) {
            const match = line.match(/[├└]──\s+(.+?)(?:\s+\(|$)/);
            if (match) {
                const item = match[1].trim();
                if (item.endsWith('/')) {
                    structure.directories.push(item);
                } else {
                    structure.files.push(item);
                }
            }
        }
    });

    return structure;
}

/**
 * Create a downloadable file URL (for future enhancement)
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @returns {string} Download URL
 */
function createDownloadUrl(content, filename) {
    // This would be implemented with Apify's file storage
    // For now, return a placeholder
    return `data:text/plain;base64,${Buffer.from(content).toString('base64')}`;
}

module.exports = {
    formatOutput,
    formatMarkdown,
    formatJson,
    parseStructure,
    createDownloadUrl
};
