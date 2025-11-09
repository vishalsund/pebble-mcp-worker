// src/tools/analyze_repo.ts

interface AnalysisSummary {
  files: string[];
  extensions: Record<string, number>;
  total_lines: number;
}

// Accepts file_contents: { "path/to/file.py": "content...", "another/file.md": "content..." }
export function analyzeRepository(fileContents: Record<string, string>): AnalysisSummary {
  const summary: AnalysisSummary = { files: [], extensions: {}, total_lines: 0 };
  
  const targetExtensions = new Set(['.py', '.js', '.ts', '.cpp', '.h', '.md']);

  for (const [fullPath, content] of Object.entries(fileContents)) {
    // Basic file extension logic
    const parts = fullPath.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';

    if (targetExtensions.has(ext)) {
      // Calculate lines
      const lines = content.split('\n');
      const lineCount = lines.length;
      
      // Update summary
      summary.total_lines += lineCount;
      summary.extensions[ext] = (summary.extensions[ext] || 0) + 1;
      summary.files.push(fullPath);
    }
  }
  
  // NOTE: This version simplifies the file path from the Python version.

  return summary;
}