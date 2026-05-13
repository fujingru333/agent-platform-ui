import { Agent, Skill, Trace, KnowledgeBase, Document, VectorSearchResult } from './types'

export const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    agentId: 'customer-service-agent',
    name: '客户服务助手',
    version: 'v1.2.0',
    status: 'online',
    owner: '张三',
    createdAt: '2024-03-15',
    skillCount: 5,
    description: '智能客户服务助手，处理用户咨询',
    systemPrompt: '你是一个专业的客户服务助手，请礼貌、耐心地回答用户问题。',
    knowledgeBases: ['kb-001']
  },
  {
    id: 'agent-002',
    agentId: 'code-reviewer-agent',
    name: '代码审查员',
    version: 'v2.0.0',
    status: 'online',
    owner: '李四',
    createdAt: '2024-03-10',
    skillCount: 8,
    description: '自动化代码审查与优化建议',
    systemPrompt: '你是一个资深的代码审查员，请仔细检查代码质量。',
    knowledgeBases: ['kb-002']
  },
  {
    id: 'agent-003',
    agentId: 'data-analyst-agent',
    name: '数据分析师',
    version: 'v0.8.0',
    status: 'draft',
    owner: '王五',
    createdAt: '2024-03-20',
    skillCount: 3,
    description: '数据可视化与分析报告生成',
    systemPrompt: '你是一个数据分析专家，请帮用户分析数据。',
    knowledgeBases: ['kb-003']
  },
  {
    id: 'agent-004',
    agentId: 'document-translator-agent',
    name: '文档翻译官',
    version: 'v1.5.0',
    status: 'offline',
    owner: '赵六',
    createdAt: '2024-02-28',
    skillCount: 4,
    description: '多语言文档翻译助手',
    systemPrompt: '你是一个专业的翻译官，请准确翻译用户提供的内容。',
    knowledgeBases: []
  }
]

export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb-001',
    name: '客户服务知识库',
    description: '包含公司产品介绍、政策说明、常见问题解答等文档',
    status: 'ready',
    creator: '张三',
    createdAt: '2024-02-20',
    documentCount: 45,
    chunkCount: 2340,
    size: 102400000,
    chunkingStrategy: { chunkSize: 512, chunkOverlap: 128, strategy: 'fixed' },
    embeddingModel: 'text-embedding-3-small',
    tags: ['客服', '产品文档']
  },
  {
    id: 'kb-002',
    name: '代码规范知识库',
    description: '编程语言最佳实践、代码审查标准、设计模式文档',
    status: 'ready',
    creator: '李四',
    createdAt: '2024-02-15',
    documentCount: 28,
    chunkCount: 1560,
    size: 67108864,
    chunkingStrategy: { chunkSize: 1024, chunkOverlap: 256, strategy: 'semantic' },
    embeddingModel: 'text-embedding-3-small',
    tags: ['开发', '代码规范']
  },
  {
    id: 'kb-003',
    name: '销售数据知识库',
    description: '历史销售数据、市场分析报告、客户洞察文档',
    status: 'indexing',
    creator: '王五',
    createdAt: '2024-03-18',
    documentCount: 12,
    chunkCount: 450,
    size: 33554432,
    chunkingStrategy: { chunkSize: 512, chunkOverlap: 64, strategy: 'fixed' },
    embeddingModel: 'text-embedding-3-small',
    tags: ['销售', '数据分析']
  },
  {
    id: 'kb-004',
    name: '员工手册',
    description: '公司规章制度、福利政策、入职指南',
    status: 'error',
    creator: '赵六',
    createdAt: '2024-03-01',
    documentCount: 5,
    chunkCount: 0,
    size: 5242880,
    chunkingStrategy: { chunkSize: 512, chunkOverlap: 64, strategy: 'fixed' },
    embeddingModel: 'text-embedding-3-small',
    tags: ['HR', '员工手册']
  }
]

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    knowledgeBaseId: 'kb-001',
    name: '产品功能说明.pdf',
    type: 'pdf',
    status: 'processed',
    size: 2097152,
    uploadedAt: '2024-02-20',
    chunkCount: 180
  },
  {
    id: 'doc-002',
    knowledgeBaseId: 'kb-001',
    name: '常见问题FAQ.md',
    type: 'md',
    status: 'processed',
    size: 524288,
    uploadedAt: '2024-02-22',
    chunkCount: 95
  },
  {
    id: 'doc-003',
    knowledgeBaseId: 'kb-002',
    name: 'Python最佳实践.docx',
    type: 'docx',
    status: 'processed',
    size: 1048576,
    uploadedAt: '2024-02-16',
    chunkCount: 120
  }
]

const skillCategories = ['数据检索', '开发工具', '文件处理', '数据库', '可视化', 'NLP', '图像识别', '音频处理', 'API调用', '逻辑推理']
const creators = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']

// 生成更多模拟Skill数据
const generateMockSkills = (): Skill[] => {
  const skills: Skill[] = []
  
  // 基础数据
  const baseSkills = [
    { name: '知识库检索', skillId: 'knowledge-retrieval', category: '数据检索', desc: '从企业知识库中检索相关信息', score: 95.5, callCount: 12560, scope: 'public' },
    { name: '代码格式化', skillId: 'code-formatter', category: '开发工具', desc: '自动格式化代码，支持多种编程语言', score: 92.3, callCount: 8920, scope: 'public' },
    { name: 'PDF 解析', skillId: 'pdf-parser', category: '文件处理', desc: '解析 PDF 文档内容并提取结构化信息', score: 88.7, callCount: 5430, scope: 'private' },
    { name: 'SQL 生成器', skillId: 'sql-generator', category: '数据库', desc: '根据自然语言描述生成 SQL 查询语句', score: 76.2, callCount: 1280, scope: 'private' },
    { name: '图表生成', skillId: 'chart-generator', category: '可视化', desc: '根据数据生成多种类型的图表', score: 90.1, callCount: 3650, scope: 'public' },
    { name: '情感分析', skillId: 'sentiment-analysis', category: 'NLP', desc: '分析文本情感倾向', score: 82.4, callCount: 2100, scope: 'public' },
  ]
  
  baseSkills.forEach((skill, index) => {
    skills.push({
      id: `skill-${(index + 1).toString().padStart(3, '0')}`,
      name: skill.name,
      skillId: skill.skillId,
      description: skill.desc,
      version: `v${1 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      status: Math.random() > 0.3 ? 'enabled' : (Math.random() > 0.5 ? 'disabled' : 'pending'),
      creator: creators[Math.floor(Math.random() * creators.length)],
      score: skill.score,
      callCount: skill.callCount,
      scope: skill.scope as 'public' | 'private',
      category: skill.category
    })
  })
  
  // 生成更多模拟Skill
  for (let i = baseSkills.length; i < 60; i++) {
    const category = skillCategories[Math.floor(Math.random() * skillCategories.length)]
    const isPublic = Math.random() > 0.4
    const name = `${category}工具${i + 1}`
    
    skills.push({
      id: `skill-${(i + 1).toString().padStart(3, '0')}`,
      name: name,
      skillId: `skill-${i + 1}-tool`,
      description: `这是一个${category}相关的Skill，提供专业的功能支持`,
      version: `v${1 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      status: Math.random() > 0.2 ? 'enabled' : (Math.random() > 0.5 ? 'disabled' : 'pending'),
      creator: creators[Math.floor(Math.random() * creators.length)],
      score: Math.floor(60 + Math.random() * 38) + Math.random(),
      callCount: Math.floor(Math.random() * 15000),
      scope: isPublic ? 'public' : 'private',
      category: category
    })
  }
  
  return skills
}

export const mockSkills: Skill[] = generateMockSkills()

export const dashboardStats = {
  agentCount: 42,
  skillCount: 156,
  knowledgeBaseCount: 4,
  todayCalls: 8924,
  successRate: 98.5,
  averageHallucinationScore: 3.2,
  userSatisfactionRate: 94.8
}

export const mockTraces: Trace[] = [
  {
    id: 'trace-001',
    traceId: '50653d6ae9ef3b2558125d711ec585',
    agentId: 'agent-001',
    agentName: '建议一些代码优化方案',
    status: 'success',
    input: '请帮我提供一些代码的优化方案',
    output: '代码审查完成，已为您生成优化建议：可使用内置函数优化：直接使用 sum(items) 更简洁高效',
    startTime: new Date(Date.now() - 3600000 * 2),
    endTime: new Date(Date.now() - 3600000 * 2 + 2500),
    duration: 2.5,
    tokenCount: 256,
    hallucinationScore: 1.2,
    userFeedback: 'positive'
  },
  {
    id: 'trace-002',
    traceId: 'lf_trace_d4e5f6',
    agentId: 'agent-002',
    agentName: '代码审查员',
    status: 'success',
    input: '请帮我审查这段 Java 代码，检查安全性与规范问题',
    output: '代码审查完成！发现以下高风险问题：1. SQL注入风险：直接拼接SQL语句，未使用预编译\n2. 资源未关闭：数据库连接未释放，存在连接泄漏\n3. 异常处理不规范：仅打印堆栈，未向上传递错误',
    startTime: new Date(Date.now() - 3600000 * 1.5),
    endTime: new Date(Date.now() - 3600000 * 1.5 + 3800),
    duration: 3.8,
    tokenCount: 512,
    hallucinationScore: 2.1,
    userFeedback: null
  },
  // {
  //   id: 'trace-003',
  //   traceId: 'lf_trace_g7h8i9',
  //   agentId: 'agent-001',
  //   agentName: '客户服务助手',
  //   status: 'error',
  //   input: '联系人工客服',
  //   startTime: new Date(Date.now() - 3600000),
  //   endTime: new Date(Date.now() - 3600000 + 1200),
  //   duration: 1.2,
  //   error: 'Skill 调用超时：知识库检索',
  //   hallucinationScore: 0,
  //   userFeedback: null
  // },
  // {
  //   id: 'trace-004',
  //   traceId: 'lf_trace_j0k1l2',
  //   agentId: 'agent-003',
  //   agentName: '数据分析师',
  //   status: 'success',
  //   input: '生成上月销售报表',
  //   output: '已为您生成 2024年3月的销售报表：总销售额 125,680元，同比增长 12.5%',
  //   startTime: new Date(Date.now() - 1800000),
  //   endTime: new Date(Date.now() - 1800000 + 4500),
  //   duration: 4.5,
  //   tokenCount: 1024,
  //   hallucinationScore: 0.8,
  //   userFeedback: 'positive'
  // },
  // {
  //   id: 'trace-005',
  //   traceId: 'lf_trace_m3n4o5',
  //   agentId: 'agent-001',
  //   agentName: '客户服务助手',
  //   status: 'running',
  //   input: '查询我的订单状态',
  //   startTime: new Date(Date.now() - 30000),
  //   hallucinationScore: 0,
  //   userFeedback: null
  // }
]

export const mockVectorSearchResults: VectorSearchResult[] = [
  {
    score: 0.92,
    content: '退款政策：用户在购买后7天内可申请无理由退款，需保留原始包装。退款将在3-5个工作日内原路返回。',
    source: '产品功能说明.pdf',
    chunkId: 'chunk-001'
  },
  {
    score: 0.85,
    content: '退款流程：1. 登录账户 2. 进入订单详情页 3. 点击"申请退款"按钮 4. 填写退款原因并提交 5. 等待审核',
    source: '产品功能说明.pdf',
    chunkId: 'chunk-002'
  },
  {
    score: 0.78,
    content: '常见问题：Q: 退款需要多长时间？A: 一般3-5个工作日，具体取决于银行处理速度。',
    source: '常见问题FAQ.md',
    chunkId: 'chunk-003'
  }
]
