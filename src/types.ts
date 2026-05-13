export interface Agent {
  id: string
  agentId: string
  name: string
  version: string
  status: 'online' | 'offline' | 'draft'
  owner: string
  createdAt: string
  skillCount: number
  description: string
  systemPrompt: string
  knowledgeBases?: string[]
}

export interface Skill {
  id: string
  name: string
  skillId: string
  description: string
  version: string
  status: 'enabled' | 'disabled' | 'pending'
  creator: string
  score: number
  callCount: number
  scope: 'private' | 'public'
  category: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  status: 'ready' | 'indexing' | 'error'
  creator: string
  createdAt: string
  documentCount: number
  chunkCount: number
  size: number
  chunkingStrategy: ChunkingStrategy
  embeddingModel: string
  tags: string[]
}

export interface ChunkingStrategy {
  chunkSize: number
  chunkOverlap: number
  strategy: 'fixed' | 'semantic' | 'markdown'
}

export interface Document {
  id: string
  knowledgeBaseId: string
  name: string
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'html'
  status: 'processed' | 'processing' | 'failed'
  size: number
  uploadedAt: string
  chunkCount: number
}

export interface Trace {
  id: string
  traceId: string
  agentId: string
  agentName: string
  status: 'success' | 'error' | 'running'
  input: string
  output?: string
  startTime: Date
  endTime?: Date
  duration?: number
  tokenCount?: number
  error?: string
  hallucinationScore?: number
  userFeedback?: 'positive' | 'negative' | null
}

export interface TraceSpan {
  id: string
  type: 'prompt' | 'skill' | 'llm' | 'retrieval' | 'reasoning'
  name: string
  status: 'success' | 'error'
  startTime: Date
  endTime?: Date
  duration?: number
  input?: string
  output?: string
  metadata?: any
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  traceId?: string
}

export interface VectorSearchResult {
  score: number
  content: string
  source: string
  chunkId: string
}
