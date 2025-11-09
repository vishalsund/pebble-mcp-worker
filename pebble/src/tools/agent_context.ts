// src/tools/agent_context.ts
// NOTE: The actual implementation must use a Cloudflare binding (e.g., KV, R2)

// A simple in-memory mock for demonstration (will reset on every deploy/restart)
const MOCK_CONTEXT_STORE = new Map<string, any>(); 

export async function updateAgentContext(repoId: string, contextData: Record<string, any>): Promise<string> {
  // In a real Worker, you'd use a binding:
  // await env.MY_KV.put(`agent_context:${repoId}`, JSON.stringify(contextData));

  MOCK_CONTEXT_STORE.set(repoId, contextData);

  return `${repoId} agent context updated successfully.`;
}

export async function loadAgentContext(repoId: string): Promise<Record<string, any>> {
  // In a real Worker, you'd use a binding:
  // const context = await env.MY_KV.get(`agent_context:${repoId}`, 'json');
  // return context || {};
  
  return MOCK_CONTEXT_STORE.get(repoId) || {};
}