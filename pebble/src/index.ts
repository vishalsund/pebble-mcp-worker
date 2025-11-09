// src/index.ts

import { analyzeRepository } from './tools/analyze_repo';
import { updateWorklog } from './tools/worklog_manager';
import { updateAgentContext, loadAgentContext } from './tools/agent_context';
import { generateReadme } from './tools/readme_helper';
// NOTE: git_utils will be excluded as git cannot be run inside a Worker.
// The data for this tool must be provided by the client.

// Define the environment variables binding (if you had a D1 or KV binding)
export interface Env {
  // Add bindings here, e.g., MY_KV: KVNamespace;
}

// Define the structure for a tool call (like FastMCP's JSON payload)
interface ToolCall {
  toolName: string;
  args: Record<string, any>;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Pebble MCP operational. Send POST requests for tool execution.', { status: 200 });
    }

    try {
      const { toolName, args } = await request.json() as ToolCall;

      let result: any;

      // The 'repo_path' argument is meaningless in a Worker; 
      // it is replaced by file/data content passed in 'args'.

      switch (toolName) {
        case 'analyze_codebase':
          // The client must provide a map of { path: content }
          result = analyzeRepository(args.file_contents as Record<string, string>);
          break;
        case 'update_worklog':
          // This must write to a remote store (like KV or R2), not a local file.
          // For now, we'll assume a successful operation.
          result = await updateWorklog(args.repo_id, args.session_notes);
          break;
        case 'update_agent_context':
          result = await updateAgentContext(args.repo_id, args.context_data);
          break;
        case 'get_agent_context':
          result = await loadAgentContext(args.repo_id);
          break;
        case 'generate_readme':
          // The client must provide a list of file paths.
          result = generateReadme(args.repo_id, args.file_list as string[]);
          break;
        case 'git_summary':
          // Since we can't run git, the client must provide the commit data directly.
          // We'll return an error or a placeholder to signal this design change.
          return new Response(JSON.stringify({ error: "Client must provide 'commit_data' for git_summary." }), { status: 400 });
        default:
          return new Response(JSON.stringify({ error: `Unknown tool: ${toolName}` }), { status: 404 });
      }

      return new Response(JSON.stringify({ status: 'success', result }), {
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal server error or bad request format.' }), { status: 500 });
    }
  },
};