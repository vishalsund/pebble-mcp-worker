// src/tools/readme_helper.ts

export function generateReadme(repoName: string, fileList: string[]): string {
  const structure: string[] = [];
  const targetExtensions = new Set(['.py', '.js', '.ts', '.cpp', '.h']);

  for (const relPath of fileList) {
    const parts = relPath.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';

    // Simulate the Python check for relevant files
    if (!relPath.startsWith('.') && targetExtensions.has(ext)) {
      structure.push(`- \`${relPath}\``);
    }
  }

  const content = `# ${repoName}
    
## Overview
This project is managed by the **Code Productivity Assistant MCP**.

## File Structure
${structure.join('\n')}

## Development Notes
See **WORKLOG.md** for progress tracking.
`;

  // Return the content, the client is responsible for saving the file.
  return content;
}