# Pebble Model Context Protocol (MCP) Worker

This project deploys a Cloudflare Worker acting as a centralized set of Tool Functions for an external AI agent (like Anthropic's Claude). It handles core repository operations and context management, using Cloudflare KV for persistent state storage.

The Worker follows a simple JSON-RPC style interface over HTTP, where the client sends a toolName and args in a POST request, and the Worker returns a JSON result.

## Access

The production instance is live on the Cloudflare global network.
Environment	URL
Production MCP Endpoint	https://pebble.pebble-assistant.workers.dev/

To communicate with the MCP, you must send a POST request with a JSON payload.

## Tool Invocation Format

All interactions with this Worker must use a POST request with a JSON body following this structure:
Key	Type	Description
toolName	string	The name of the function to execute (e.g., "analyze_codebase").
args	object	A JSON object containing the required arguments for the specified tool.

Example POST Request Body (to get context)

```json

{
    "toolName": "get_agent_context",
    "args": {
        "repo_id": "repo-Pebble-ID-1"
    }
}
```

## Project Setup and Local Development

Follow these steps to get a local copy of the project running for development and testing.

Prerequisites

You must have the following installed:

    Node.js (v18 or higher)

    npm (Node Package Manager)

    Wrangler (Cloudflare Workers CLI)

1. Clone the Repository

```bash

git clone [YOUR_REPO_URL]
cd pebble
```

2. Install Dependencies

Install all necessary packages, including wrangler and TypeScript dependencies.
```bash
npm install
```

3. Configure KV Bindings

This project uses Cloudflare KV (Key-Value storage) for persistence. The binding is configured in wrangler.jsonc.

Run the types command to ensure TypeScript recognizes the PEBBLE_STORAGE KV binding:

```bash
npx wrangler types
```

4. Run Locally (with KV Persistence)

The wrangler dev command starts a local server and creates a simulated KV store on your machine, allowing you to test persistence without deploying.

```bash
npx wrangler dev
```

The Worker will be accessible at http://localhost:8787/.

## Tool Reference (Key Functions)

This Worker exposes the following tools for the AI agent:
Tool Name	Description	Persistence
analyze_codebase	Processes file contents and returns a summary (lines, extensions).	No
get_agent_context	Retrieves persistent key-value context data for a given repo_id.	Yes (KV)
update_agent_context	Updates/saves key-value context data for a given repo_id.	Yes (KV)
generate_readme	Generates a README based on file content and existing context.	No
update_worklog	Appends a new entry to the persistent worklog for a repo_id.	Yes (KV)

## Testing with PowerShell

You can test the KV persistence directly against your live endpoint (https://pebble.pebble-assistant.workers.dev/) using PowerShell.

Test Write (update_agent_context)

```powershell

$headers = @{"Content-Type" = "application/json"}
$updateBody = '{
    "toolName": "update_agent_context",
    "args": {
        "repo_id": "TEST-PERSISTENCE",
        "context_data": {
            "status": "Ready",
            "deployed_by": "Visha"
        }
    }
}'

Invoke-RestMethod -Uri "https://pebble.pebble-assistant.workers.dev/" -Method Post -Headers $headers -Body $updateBody\
```

Test Read (get_agent_context)

```powershell

$readBody = '{
    "toolName": "get_agent_context",
    "args": {
        "repo_id": "TEST-PERSISTENCE"
    }
}'

Invoke-RestMethod -Uri "https://pebble.pebble-assistant.workers.dev/" -Method Post -Headers $headers -Body $readBody
```

If the read request returns the data written by the update request, your live KV persistence is working correctly
