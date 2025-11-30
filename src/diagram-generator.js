/**
 * Diagram Generator
 * Creates visual ASCII diagrams for repository structure and dependencies
 */

/**
 * Generate dependency diagram
 */
function generateDependencyDiagram(analysis) {
    const diagram = [];

    diagram.push('');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('                    DEPENDENCY GRAPH                           ');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('');

    // Group files by type
    const filesByType = {};
    analysis.fileStructure.forEach(file => {
        if (!filesByType[file.type]) {
            filesByType[file.type] = [];
        }
        filesByType[file.type].push(file);
    });

    // Create visual representation
    Object.entries(filesByType).forEach(([type, files]) => {
        if (files.length > 0) {
            diagram.push(`┌─ ${type} (${files.length} files)`);
            files.slice(0, 5).forEach((file, idx) => {
                const prefix = idx === Math.min(4, files.length - 1) ? '└──' : '├──';
                diagram.push(`│  ${prefix} ${file.name}`);
            });
            if (files.length > 5) {
                diagram.push(`│  └── ... and ${files.length - 5} more`);
            }
            diagram.push('│');
        }
    });

    diagram.push('═══════════════════════════════════════════════════════════════');

    return diagram.join('\n');
}

/**
 * Generate file size visualization
 */
function generateSizeVisualization(largestFiles) {
    const diagram = [];

    diagram.push('');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('                   FILE SIZE DISTRIBUTION                      ');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('');

    largestFiles.forEach((file, idx) => {
        const barLength = Math.min(50, Math.floor(file.lines / 20));
        const bar = '█'.repeat(barLength);
        diagram.push(`${idx + 1}. ${file.path}`);
        diagram.push(`   ${bar} ${file.lines} lines (${file.size})`);
        diagram.push('');
    });

    diagram.push('═══════════════════════════════════════════════════════════════');

    return diagram.join('\n');
}

/**
 * Generate language distribution chart
 */
function generateLanguageChart(languages) {
    const diagram = [];

    diagram.push('');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('                  LANGUAGE DISTRIBUTION                        ');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('');

    const sorted = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    const maxCount = sorted[0]?.[1] || 1;

    sorted.forEach(([lang, count]) => {
        const percentage = ((count / maxCount) * 100).toFixed(1);
        const barLength = Math.floor((count / maxCount) * 40);
        const bar = '█'.repeat(barLength);
        const langName = lang.replace('.', '').toUpperCase().padEnd(10);

        diagram.push(`${langName} ${bar} ${count} files (${percentage}%)`);
    });

    diagram.push('');
    diagram.push('═══════════════════════════════════════════════════════════════');

    return diagram.join('\n');
}

/**
 * Generate project overview diagram
 */
function generateProjectOverview(analysis, repoName) {
    const diagram = [];

    diagram.push('');
    diagram.push('╔═══════════════════════════════════════════════════════════════╗');
    diagram.push(`║                  ${repoName.padEnd(42)} ║`);
    diagram.push('╠═══════════════════════════════════════════════════════════════╣');
    diagram.push('║                      PROJECT OVERVIEW                         ║');
    diagram.push('╚═══════════════════════════════════════════════════════════════╝');
    diagram.push('');

    diagram.push(`📁 Total Files:        ${analysis.insights.totalFiles}`);
    diagram.push(`📝 Total Lines:        ${analysis.insights.totalLines.toLocaleString()}`);
    diagram.push(`🔧 Package Managers:   ${analysis.insights.packageManagers.join(', ') || 'None detected'}`);
    diagram.push(`⚡ Frameworks:         ${analysis.insights.frameworks.join(', ') || 'None detected'}`);
    diagram.push('');

    return diagram.join('\n');
}

/**
 * Generate import/export graph for a file
 */
function generateImportGraph(fileStructure) {
    const diagram = [];

    diagram.push('');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('                     IMPORT/EXPORT MAP                         ');
    diagram.push('═══════════════════════════════════════════════════════════════');
    diagram.push('');

    const filesWithStructure = fileStructure.filter(f => f.structure &&
        (f.structure.imports.length > 0 || f.structure.exports.length > 0));

    if (filesWithStructure.length === 0) {
        diagram.push('No import/export relationships detected.');
    } else {
        filesWithStructure.slice(0, 10).forEach(file => {
            diagram.push(`┌─ ${file.path}`);

            if (file.structure.imports.length > 0) {
                diagram.push('│  ↓ IMPORTS:');
                file.structure.imports.slice(0, 3).forEach(imp => {
                    diagram.push(`│    • ${imp}`);
                });
                if (file.structure.imports.length > 3) {
                    diagram.push(`│    • ... and ${file.structure.imports.length - 3} more`);
                }
            }

            if (file.structure.functions.length > 0) {
                diagram.push('│  ⚡ FUNCTIONS:');
                file.structure.functions.slice(0, 3).forEach(func => {
                    diagram.push(`│    • ${func}()`);
                });
                if (file.structure.functions.length > 3) {
                    diagram.push(`│    • ... and ${file.structure.functions.length - 3} more`);
                }
            }

            if (file.structure.classes.length > 0) {
                diagram.push('│  🏛️  CLASSES:');
                file.structure.classes.forEach(cls => {
                    diagram.push(`│    • ${cls}`);
                });
            }

            diagram.push('│');
        });
    }

    diagram.push('═══════════════════════════════════════════════════════════════');

    return diagram.join('\n');
}

/**
 * Generate complete visual report
 */
function generateVisualReport(analysis, repoName) {
    const sections = [];

    sections.push(generateProjectOverview(analysis, repoName));
    sections.push(generateLanguageChart(analysis.languages));
    sections.push(generateSizeVisualization(analysis.insights.largestFiles));
    sections.push(generateDependencyDiagram(analysis));
    sections.push(generateImportGraph(analysis.fileStructure));

    return sections.join('\n\n');
}

module.exports = {
    generateDependencyDiagram,
    generateSizeVisualization,
    generateLanguageChart,
    generateProjectOverview,
    generateImportGraph,
    generateVisualReport
};
