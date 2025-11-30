/**
 * Local test script for the Codemap Actor
 * Run with: node test-local.js
 */

const { Actor } = require('apify');
const { cloneRepository, cleanupRepository } = require('./src/github-cloner');
const { runCodemap } = require('./src/codemap-runner');
const { formatOutput } = require('./src/output-formatter');

// Test with a small repository
const testInput = {
    repositoryUrl: 'https://github.com/JordanCoin/codemap',
    branch: 'main',
    outputFormat: 'both',
    includeDependencies: false
};

async function runTest() {
    console.log('🧪 Running local test...');
    console.log('📥 Test input:', testInput);

    let repoPath = null;

    try {
        // Step 1: Clone
        console.log('\n📦 Step 1: Cloning repository...');
        repoPath = await cloneRepository(testInput.repositoryUrl, testInput.branch);
        console.log('✅ Cloned to:', repoPath);

        // Step 2: Run codemap
        console.log('\n🔍 Step 2: Generating codemap...');
        const codemapResult = await runCodemap(repoPath, {
            includeDependencies: testInput.includeDependencies
        });
        console.log('✅ Codemap generated');
        console.log('📊 Stats:', {
            files: codemapResult.fileCount,
            size: codemapResult.totalSize
        });

        // Step 3: Format output
        console.log('\n📝 Step 3: Formatting output...');
        const output = await formatOutput(
            codemapResult,
            testInput.repositoryUrl,
            testInput.outputFormat
        );
        console.log('✅ Output formatted');

        // Step 4: Show results
        console.log('\n🎉 Test completed successfully!');
        console.log('\n📊 Final Output:');
        console.log('================');
        console.log('Repository:', output.repository);
        console.log('Files:', output.fileCount);
        console.log('Size:', output.totalSize);
        console.log('Languages:', output.topLanguages);
        console.log('\n📄 Codemap Preview (first 1000 chars):');
        console.log(output.codemap ? output.codemap.substring(0, 1000) + '...' : 'N/A');

        // Save to file for inspection
        const fs = require('fs').promises;
        await fs.writeFile(
            'test-output.json',
            JSON.stringify(output, null, 2)
        );
        console.log('\n💾 Full output saved to: test-output.json');

        return output;

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
        throw error;
    } finally {
        // Cleanup
        if (repoPath) {
            console.log('\n🧹 Cleaning up...');
            await cleanupRepository(repoPath);
            console.log('✅ Cleanup complete');
        }
    }
}

// Run the test
runTest()
    .then(() => {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test suite failed');
        process.exit(1);
    });
