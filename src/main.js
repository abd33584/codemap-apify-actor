/**
 * Codemap Generator - Apify Actor
 * Generates AI-optimized codebase maps from GitHub repositories
 */

const { Actor } = require('apify');
const { cloneRepository, cleanupRepository } = require('./github-cloner');
const { runCodemap } = require('./codemap-runner');
const { formatOutput } = require('./output-formatter');

Actor.main(async () => {
    console.log('🗺️  Codemap Generator Actor starting...');

    // Get input from Apify
    const input = await Actor.getInput();

    // Validate required fields
    if (!input || !input.repositoryUrl) {
        throw new Error('Missing required input: repositoryUrl');
    }

    console.log('📥 Input received:', {
        repository: input.repositoryUrl,
        branch: input.branch || 'main',
        format: input.outputFormat || 'markdown'
    });

    let repoPath = null;

    try {
        // Step 1: Clone the repository
        console.log('📦 Cloning repository...');
        repoPath = await cloneRepository(
            input.repositoryUrl,
            input.branch || 'main'
        );
        console.log('✅ Repository cloned to:', repoPath);

        // Step 2: Run codemap
        console.log('🔍 Generating codemap...');
        const codemapResult = await runCodemap(repoPath, {
            includeDependencies: input.includeDependencies,
            languageFilter: input.languageFilter,
            excludePatterns: input.excludePatterns,
            maxFileSize: input.maxFileSize
        });
        console.log('✅ Codemap generated');

        // Step 3: Format output
        console.log('📝 Formatting output...');
        const output = await formatOutput(
            codemapResult,
            input.repositoryUrl,
            input.outputFormat || 'markdown'
        );
        console.log('✅ Output formatted');

        // Step 4: Save to Apify dataset
        console.log('💾 Saving results...');
        await Actor.pushData(output);
        console.log('✅ Results saved to dataset');

        // Step 5: Set output for direct access
        await Actor.setValue('OUTPUT', output);
        console.log('✅ Output set for direct access');

        console.log('🎉 Codemap generation completed successfully!');
        console.log('📊 Stats:', {
            files: output.fileCount,
            size: output.totalSize,
            languages: output.topLanguages
        });

    } catch (error) {
        console.error('❌ Error generating codemap:', error.message);
        console.error(error.stack);

        // Save error information
        await Actor.pushData({
            error: true,
            message: error.message,
            repository: input.repositoryUrl,
            timestamp: new Date().toISOString()
        });

        throw error;
    } finally {
        // Step 6: Cleanup cloned repository
        if (repoPath) {
            console.log('🧹 Cleaning up...');
            await cleanupRepository(repoPath);
            console.log('✅ Cleanup completed');
        }
    }
});
