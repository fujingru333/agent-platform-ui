import React, { useState, useMemo } from 'react'
import { Card, Tabs, Descriptions, Button, Space, Tag, Input, Select, Row, Col, Table, Modal, message, Form, Pagination, Radio, Divider, Typography, Slider, Collapse, Timeline } from 'antd'
import { LeftOutlined, SearchOutlined, PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, AppstoreOutlined, UnorderedListOutlined, SaveOutlined, SettingOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { mockAgents, mockSkills, mockTraces, mockKnowledgeBases } from '../mockData'
import { KnowledgeBase } from '../types'

const { TextArea } = Input
const { Option } = Select
const { Text } = Typography

// 统一的低饱和配色方案
const colors = {
  green: '#6d9f78',
  blue: '#7396b2',
  orange: '#d4a574',
  purple: '#998aaf',
  red: '#c68a8a'
}

const evaluationData = [
  { time: '00:00', calls: 45, successRate: 97.8 },
  { time: '04:00', calls: 28, successRate: 96.4 },
  { time: '08:00', calls: 120, successRate: 98.3 },
  { time: '12:00', calls: 210, successRate: 96.7 },
  { time: '16:00', calls: 280, successRate: 97.1 },
  { time: '20:00', calls: 160, successRate: 98.8 }
]

const errorDistribution = [
  { name: '参数错误', count: 12 },
  { name: '超时', count: 8 },
  { name: '权限不足', count: 5 },
  { name: '格式错误', count: 3 }
]

const AgentDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const agent = mockAgents.find(a => a.id === id)

  // 表单数据
  const [systemPrompt, setSystemPrompt] = useState(agent?.systemPrompt || '你是一个有用的 AI 助手')
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['skill-001', 'skill-002'])
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>(agent?.knowledgeBases || [])
  
  // LLM配置状态
  const [llmConfig, setLlmConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    endpoint: '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9
  })
  
  // Skill筛选和展示状态
  const [searchSkillText, setSearchSkillText] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [scopeFilter, setScopeFilter] = useState<'all' | 'private' | 'public'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12
  
  // 运行相关状态
  const [running, setRunning] = useState(false)
  const [paramModalVisible, setParamModalVisible] = useState(false)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [testInput, setTestInput] = useState('请介绍一下这个Agent的功能')
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  if (!agent) {
    return <div>Agent 不存在</div>
  }

  // 获取当前Provider对应的模型列表
  const currentModels = {
    openai: [
      { name: 'GPT-4o', value: 'gpt-4o' },
      { name: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
      { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
    ],
    deepseek: [
      { name: 'DeepSeek-V3', value: 'deepseek-v3' },
      { name: 'DeepSeek-Coder', value: 'deepseek-coder' }
    ],
    qwen: [
      { name: 'Qwen-Max', value: 'qwen-max' },
      { name: 'Qwen-Plus', value: 'qwen-plus' },
      { name: 'Qwen-Turbo', value: 'qwen-turbo' }
    ],
    ollama: [
      { name: 'Llama 3', value: 'llama3' },
      { name: 'Qwen2', value: 'qwen2' },
      { name: 'DeepSeek', value: 'deepseek' }
    ]
  }[llmConfig.provider as keyof { openai: any[] }]

  // 获取所有分类
  const allCategories = useMemo(() => {
    const categories = new Set<string>(['all'])
    mockSkills.forEach(skill => categories.add(skill.category))
    return Array.from(categories)
  }, [])

  // 处理筛选后的Skill列表
  const processedSkills = useMemo(() => {
    let filtered = [...mockSkills]
    
    if (searchSkillText) {
      const searchLower = searchSkillText.toLowerCase()
      filtered = filtered.filter(
        skill => 
          skill.name.toLowerCase().includes(searchLower) || 
          skill.description.toLowerCase().includes(searchLower)
      )
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(skill => skill.category === categoryFilter)
    }
    
    if (scopeFilter !== 'all') {
      filtered = filtered.filter(skill => skill.scope === scopeFilter)
    }
    
    filtered.sort((a, b) => {
      return b.score - a.score
    })
    
    return filtered
  }, [searchSkillText, categoryFilter, scopeFilter])

  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedSkills.slice(start, start + pageSize)
  }, [processedSkills, currentPage])

  // 已选Skill详情
  const selectedSkillDetails = useMemo(() => {
    return mockSkills.filter(s => selectedSkills.includes(s.id))
  }, [selectedSkills])

  // 处理运行按钮点击
  const handleRun = () => {
    if (agent.status !== 'online') {
      message.warning('请先上线Agent才能运行')
      return
    }
    setParamModalVisible(true)
  }

  // 保存所有配置
  const handleSaveAll = () => {
    message.success('所有配置已保存！')
    setHasUnsavedChanges(false)
  }

  const tabItems = [
    {
      key: 'chat',
      label: '对话',
      children: (
        <div>
          <Card title="在线对话测试" size="small">
            <Text type="secondary">点击右上角的"对话调试"按钮进入完整的对话调试界面</Text>
            <Divider />
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Button type="primary" icon={<MessageOutlined />} onClick={() => navigate(`/agents/${id}/chat`)}>
                进入对话调试
              </Button>
            </div>
          </Card>
        </div>
      )
    },
    {
      key: 'config',
      label: '基础配置',
      children: (
        <div>
          <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Agent 名称">{agent.name}</Descriptions.Item>
            <Descriptions.Item label="唯一标识">{agent.agentId}</Descriptions.Item>
            <Descriptions.Item label="版本号">{agent.version}</Descriptions.Item>
            <Descriptions.Item label="负责人">{agent.owner}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{agent.createdAt}</Descriptions.Item>
            <Descriptions.Item label="运行状态">
              <Tag color={agent.status === 'online' ? colors.green : 'default'}>
                {agent.status === 'online' ? '在线' : agent.status === 'offline' ? '离线' : '草稿'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="功能描述" span={2}>
              {agent.description || '暂无描述'}
            </Descriptions.Item>
          </Descriptions>

          {/* LLM 配置面板 */}
          <Collapse
            defaultActiveKey={['llm']}
            style={{ marginBottom: 24 }}
            items={[
              {
                key: 'llm',
                label: <Space><SettingOutlined /> LLM 配置</Space>,
                children: (
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="模型提供商">
                          <Select
                            value={llmConfig.provider}
                            onChange={(value) => {
                              setLlmConfig({ ...llmConfig, provider: value, model: currentModels[0].value })
                              setHasUnsavedChanges(true)
                            }}
                          >
                            <Option value="openai">OpenAI</Option>
                            <Option value="deepseek">DeepSeek</Option>
                            <Option value="qwen">通义千问</Option>
                            <Option value="ollama">Ollama (本地)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="模型名称">
                          <Select
                            value={llmConfig.model}
                            onChange={(value) => {
                              setLlmConfig({ ...llmConfig, model: value })
                              setHasUnsavedChanges(true)
                            }}
                          >
                            {currentModels.map((model: { name: string, value: string }) => (
                              <Option key={model.value} value={model.value}>{model.name}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="API Key" tooltip="可选，不填使用平台默认配置">
                          <Input.Password
                            placeholder="输入你的 API Key"
                            value={llmConfig.apiKey}
                            onChange={(e) => {
                              setLlmConfig({ ...llmConfig, apiKey: e.target.value })
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="API Endpoint" tooltip="可选，自定义API地址">
                          <Input
                            placeholder="例如：https://api.openai.com/v1"
                            value={llmConfig.endpoint}
                            onChange={(e) => {
                              setLlmConfig({ ...llmConfig, endpoint: e.target.value })
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider>模型参数</Divider>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="温度"
                          tooltip="控制输出的随机性，值越大越随机"
                        >
                          <div style={{ padding: '0 8px' }}>
                            <Slider
                              min={0}
                              max={2}
                              step={0.1}
                              value={llmConfig.temperature}
                              onChange={(value) => {
                                setLlmConfig({ ...llmConfig, temperature: value })
                                setHasUnsavedChanges(true)
                              }}
                            />
                            <div style={{ textAlign: 'right', color: '#666' }}>{llmConfig.temperature}</div>
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="最大输出长度"
                          tooltip="单次响应的最大Token数量"
                        >
                          <Select
                            value={llmConfig.maxTokens}
                            onChange={(value) => {
                              setLlmConfig({ ...llmConfig, maxTokens: value })
                              setHasUnsavedChanges(true)
                            }}
                          >
                            <Option value={512}>512</Option>
                            <Option value={1024}>1024</Option>
                            <Option value={2048}>2048</Option>
                            <Option value={4096}>4096</Option>
                            <Option value={8192}>8192</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Top-P"
                          tooltip="采样参数，控制输出多样性"
                        >
                          <div style={{ padding: '0 8px' }}>
                            <Slider
                              min={0}
                              max={1}
                              step={0.05}
                              value={llmConfig.topP}
                              onChange={(value) => {
                                setLlmConfig({ ...llmConfig, topP: value })
                                setHasUnsavedChanges(true)
                              }}
                            />
                            <div style={{ textAlign: 'right', color: '#666' }}>{llmConfig.topP}</div>
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                )
              }
            ]}
          />

          {/* System Prompt 配置 */}
          <Card
            title="System Prompt 配置"
            style={{ marginBottom: 24 }}
            extra={
              <Button type="link" size="small" onClick={() => {
                setHasUnsavedChanges(false)
                message.success('已保存 System Prompt')
              }}>保存</Button>
            }
          >
            <TextArea
              rows={6}
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value)
                setHasUnsavedChanges(true)
              }}
              placeholder="请输入 System Prompt"
            />
          </Card>

          {/* 绑定 Skill */}
          <Card
            title="绑定 Skill"
            extra={
              <Button type="primary" icon={<SaveOutlined />} onClick={() => {
                message.success(`成功绑定 ${selectedSkills.length} 个Skill！`)
                setHasUnsavedChanges(false)
              }}>保存绑定</Button>
            }
          >
            <Row gutter={24}>
              {/* 左侧：Skill选择区 */}
              <Col span={17}>
                {/* 顶部筛选和操作 */}
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={[12, 12]}>
                    <Col span={8}>
                      <Input
                        placeholder="搜索 Skill 名称或描述"
                        prefix={<SearchOutlined />}
                        value={searchSkillText}
                        onChange={(e) => {
                          setSearchSkillText(e.target.value)
                          setCurrentPage(1)
                        }}
                      />
                    </Col>
                    <Col span={6}>
                      <Select
                        value={categoryFilter}
                        onChange={(val) => {
                          setCategoryFilter(val)
                          setCurrentPage(1)
                        }}
                        style={{ width: '100%' }}
                      >
                        {allCategories.map(cat => (
                          <Option key={cat} value={cat}>
                            {cat === 'all' ? '全部分类' : cat}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={5}>
                      <Select
                        value={scopeFilter}
                        onChange={(val) => {
                          setScopeFilter(val)
                          setCurrentPage(1)
                        }}
                        style={{ width: '100%' }}
                      >
                        <Option value="all">全部范围</Option>
                        <Option value="private">私有Skill</Option>
                        <Option value="public">公共Skill</Option>
                      </Select>
                    </Col>
                    <Col span={5}>
                      <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                        <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
                        <Radio.Button value="list"><UnorderedListOutlined /></Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                  
                  <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                    <Col span={12}>
                      <Space>
                        <Button
                          size="small"
                          onClick={() => {
                            const currentPageIds = paginatedSkills.map(s => s.id)
                            setSelectedSkills([...new Set([...selectedSkills, ...currentPageIds])])
                            setHasUnsavedChanges(true)
                          }}
                        >
                          全选本页
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            const currentPageIds = paginatedSkills.map(s => s.id)
                            setSelectedSkills(selectedSkills.filter(id => !currentPageIds.includes(id)))
                            setHasUnsavedChanges(true)
                          }}
                        >
                          清除本页
                        </Button>
                        <Button
                          size="small"
                          danger
                          onClick={() => setSelectedSkills([])}
                        >
                          清空全部
                        </Button>
                      </Space>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <span style={{ color: '#666' }}>
                        共 {processedSkills.length} 个Skill，已选 {selectedSkills.length} 个
                      </span>
                    </Col>
                  </Row>
                </div>

                {/* Skill列表 */}
                <div style={{ minHeight: 400 }}>
                  {viewMode === 'card' ? (
                    <Row gutter={[16, 16]}>
                      {paginatedSkills.map(skill => (
                        <Col span={8} key={skill.id}>
                          <Card
                            size="small"
                            hoverable
                            style={{
                              border: selectedSkills.includes(skill.id) ? `2px solid ${colors.blue}` : '1px solid #e8e8e8',
                              background: selectedSkills.includes(skill.id) ? '#f7fafd' : '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => {
                              if (selectedSkills.includes(skill.id)) {
                                setSelectedSkills(selectedSkills.filter(id => id !== skill.id))
                              } else {
                                setSelectedSkills([...selectedSkills, skill.id])
                              }
                              setHasUnsavedChanges(true)
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: 14 }}>{skill.name}</strong>
                              {selectedSkills.includes(skill.id) ? (
                                <Tag color={colors.blue} icon={<CheckCircleOutlined />} style={{ fontSize: 11 }}>已选</Tag>
                              ) : (
                                <Tag color="default" style={{ fontSize: 11 }}>未选</Tag>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: '#999', margin: '6px 0' }}>
                              <Tag color={skill.scope === 'public' ? colors.blue : colors.orange} style={{ marginRight: 8, fontSize: 10 }}>
                                {skill.scope === 'public' ? '公共' : '私有'}
                              </Tag>
                              <Tag color={colors.purple} style={{ fontSize: 10 }}>{skill.category}</Tag>
                            </div>
                            <div style={{ fontSize: 11, color: '#666', marginBottom: 8, minHeight: 26 }}>
                              {skill.description}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                              <span>评分: <b style={{ color: colors.orange }}>{skill.score.toFixed(2)}</b></span>
                              <span>调用: {skill.callCount.toLocaleString()}</span>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Table
                      dataSource={paginatedSkills}
                      pagination={false}
                      size="small"
                      rowKey="id"
                      onRow={(skill) => ({
                        onClick: () => {
                          if (selectedSkills.includes(skill.id)) {
                            setSelectedSkills(selectedSkills.filter(id => id !== skill.id))
                          } else {
                            setSelectedSkills([...selectedSkills, skill.id])
                          }
                          setHasUnsavedChanges(true)
                        },
                        style: { 
                          cursor: 'pointer',
                          background: selectedSkills.includes(skill.id) ? '#f7fafd' : '#fff'
                        }
                      })}
                    >
                      <Table.Column
                        title="选择"
                        width={60}
                        render={(_, skill) => (
                          selectedSkills.includes(skill.id) ? 
                          <CheckCircleOutlined style={{ color: colors.blue }} /> : null
                        )}
                      />
                      <Table.Column title="Skill名称" dataIndex="name" key="name" />
                      <Table.Column title="分类" dataIndex="category" key="category" width={100} />
                      <Table.Column
                        title="范围"
                        dataIndex="scope"
                        key="scope"
                        width={80}
                        render={(scope) => (
                          <Tag color={scope === 'public' ? colors.blue : colors.orange}>
                            {scope === 'public' ? '公共' : '私有'}
                          </Tag>
                        )}
                      />
                      <Table.Column title="评分" dataIndex="score" key="score" width={80} render={(score) => <span style={{ color: colors.orange }}>{score.toFixed(2)}</span>} />
                      <Table.Column title="调用次数" dataIndex="callCount" key="callCount" width={100} render={(count) => count.toLocaleString()} />
                      <Table.Column title="创建者" dataIndex="creator" key="creator" width={80} />
                    </Table>
                  )}
                </div>

                {/* 分页 */}
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={processedSkills.length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                  />
                </div>
              </Col>

              {/* 右侧：已选Skill */}
              <Col span={7}>
                <div style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: 8,
                  padding: 16,
                  background: '#fafafa',
                  position: 'sticky',
                  top: 16,
                  maxHeight: 650,
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 500 }}>已绑定 Skill ({selectedSkills.length})</span>
                    {selectedSkills.length > 0 && (
                      <Button type="link" size="small" danger onClick={() => setSelectedSkills([])}>清空</Button>
                    )}
                  </div>
                  
                  {selectedSkillDetails.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedSkillDetails.map(skill => (
                        <div
                          key={skill.id}
                          style={{
                            padding: '10px 12px',
                            background: '#fff',
                            border: '1px solid #e8e8e8',
                            borderRadius: 6,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {skill.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                              <Tag style={{ fontSize: 10, padding: '0 4px', height: 18, lineHeight: '16px' }} color={skill.scope === 'public' ? colors.blue : colors.orange}>
                                {skill.category}
                              </Tag>
                              <span style={{ marginLeft: 6, color: colors.orange }}>评分: {skill.score.toFixed(2)}</span>
                            </div>
                          </div>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<CloseCircleOutlined />}
                            onClick={() => setSelectedSkills(selectedSkills.filter(id => id !== skill.id))}
                            style={{ marginLeft: 8 }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: 13 }}>
                      暂未选择任何Skill
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>

          {/* 绑定知识库 */}
          <Card
            title="绑定知识库"
            extra={
              <Button type="primary" icon={<SaveOutlined />} onClick={() => {
                message.success(`成功绑定 ${selectedKnowledgeBases.length} 个知识库！`)
                setHasUnsavedChanges(false)
              }}>保存绑定</Button>
            }
            style={{ marginTop: 16 }}
          >
            <Row gutter={24}>
              {/* 左侧：知识库列表 */}
              <Col span={16}>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedKnowledgeBases(mockKnowledgeBases.filter((kb: KnowledgeBase) => kb.status === 'ready').map((kb: KnowledgeBase) => kb.id))
                        setHasUnsavedChanges(true)
                      }}
                    >
                      全选可用知识库
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => setSelectedKnowledgeBases([])}
                    >
                      清空全部
                    </Button>
                  </Space>
                </div>
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {mockKnowledgeBases.map((kb: KnowledgeBase) => (
                    <div
                      key={kb.id}
                      style={{
                        padding: '12px 16px',
                        background: selectedKnowledgeBases.includes(kb.id) ? '#f0f7ff' : '#fff',
                        border: `1px solid ${selectedKnowledgeBases.includes(kb.id) ? colors.blue : '#e8e8e8'}`,
                        borderRadius: 6,
                        marginBottom: 8,
                        cursor: kb.status !== 'ready' ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                      onClick={() => {
                        if (kb.status === 'ready') {
                          if (selectedKnowledgeBases.includes(kb.id)) {
                            setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== kb.id))
                          } else {
                            setSelectedKnowledgeBases([...selectedKnowledgeBases, kb.id])
                          }
                          setHasUnsavedChanges(true)
                        }
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <BookOutlined style={{ color: colors.purple }} />
                          <Text strong style={{ fontSize: 14 }}>{kb.name}</Text>
                          {kb.status === 'ready' ? (
                            <Tag color={colors.green} style={{ fontSize: 10 }}>可用</Tag>
                          ) : kb.status === 'indexing' ? (
                            <Tag color={colors.blue} style={{ fontSize: 10 }}>索引中</Tag>
                          ) : (
                            <Tag color={colors.red} style={{ fontSize: 10 }}>错误</Tag>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{kb.description}</div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#666' }}>
                          <span>📄 {kb.documentCount} 文档</span>
                          <span>📊 {kb.chunkCount.toLocaleString()} 分块</span>
                          <span>📏 {kb.chunkingStrategy.chunkSize} tokens/块</span>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          {kb.tags.map(tag => (
                            <Tag key={tag} style={{ fontSize: 10, marginRight: 4 }}>{tag}</Tag>
                          ))}
                        </div>
                      </div>
                      {selectedKnowledgeBases.includes(kb.id) && (
                        <CheckCircleOutlined style={{ color: colors.green, fontSize: 18 }} />
                      )}
                    </div>
                  ))}
                </div>
              </Col>

              {/* 右侧：已选知识库 */}
              <Col span={8}>
                <div style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: 8,
                  padding: 16,
                  background: '#fafafa',
                  position: 'sticky',
                  top: 16,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 500 }}>已绑定知识库 ({selectedKnowledgeBases.length})</span>
                    {selectedKnowledgeBases.length > 0 && (
                      <Button type="link" size="small" danger onClick={() => setSelectedKnowledgeBases([])}>清空</Button>
                    )}
                  </div>
                  
                  {selectedKnowledgeBases.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedKnowledgeBases.map((kbId: string) => {
                        const kb = mockKnowledgeBases.find((kb: KnowledgeBase) => kb.id === kbId)
                        return kb ? (
                          <div
                            key={kb.id}
                            style={{
                              padding: '10px 12px',
                              background: '#fff',
                              border: '1px solid #e8e8e8',
                              borderRadius: 6,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {kb.name}
                              </div>
                              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                                {kb.documentCount} 文档 · {kb.chunkCount.toLocaleString()} 分块
                              </div>
                            </div>
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<CloseCircleOutlined />}
                              onClick={() => setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== kb.id))}
                              style={{ marginLeft: 8 }}
                            />
                          </div>
                        ) : null
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: 13 }}>
                      暂未选择任何知识库
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'traces',
      label: '追踪记录',
      children: (
        <div>
          <Card title="最近运行记录">
            <Table
              dataSource={mockTraces.slice(0, 10)}
              rowKey="traceId"
              pagination={false}
              columns={[
                { title: '运行时间', dataIndex: 'startTime', key: 'startTime', render: (time: Date) => time.toLocaleString() },
                { title: '输入内容', dataIndex: 'input', key: 'input', ellipsis: true },
                { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
                  <Tag color={status === 'success' ? colors.green : colors.red}>
                    {status === 'success' ? '成功' : '失败'}
                  </Tag>
                )},
                { title: '耗时', dataIndex: 'duration', key: 'duration', render: (d: number) => `${d}s` },
                { title: '操作', key: 'action', render: (_: any, record: any) => (
                  <Space>
                    <Button type="link" size="small" onClick={() => navigate(`/agents/${id}/traces/${record.traceId}`)}>
                      查看详情
                    </Button>
                  </Space>
                )}
              ]}
            />
          </Card>
        </div>
      )
    },
    {
      key: 'evaluation',
      label: '效果评估',
      children: (
        <div>
          {/* 核心指标 - 改为横向展示 */}
          <Card size="small" style={{ marginBottom: 12 }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>任务成功率</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: colors.green }}>96.8%</div>
                  <div style={{ fontSize: 11, color: '#999' }}>近7天运行</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>结果准确率</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: colors.blue }}>94.2%</div>
                  <div style={{ fontSize: 11, color: '#999' }}>结果符合预期</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>平均耗时</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: colors.orange }}>1.2s</div>
                  <div style={{ fontSize: 11, color: '#999' }}>单次调用</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>综合评分</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: colors.purple }}>92.5/100</div>
                  <div style={{ fontSize: 11, color: '#999' }}>综合评估</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Agent 运行趋势 - 减小高度 */}
          <Card title="运行趋势" size="small" style={{ marginBottom: 12 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={evaluationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="time" fontSize={11} />
                <YAxis yAxisId="left" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} fontSize={11} />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="calls" 
                  stroke={colors.blue} 
                  name="日调用量" 
                  strokeWidth={2}
                  dot={{ fill: colors.blue, r: 3 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke={colors.green} 
                  name="成功率" 
                  strokeWidth={2}
                  dot={{ fill: colors.green, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 底部双栏 - 更紧凑，高度一致 */}
          <Row gutter={12} style={{ marginBottom: 12 }}>
            {/* 左：依赖 Skill 健康度 */}
            <Col span={12}>
              <Card title="依赖 Skill 健康度" size="small" style={{ height: '100%' }}>
                <Table
                  dataSource={[
                    { skillName: '知识库检索', calls: 856, successRate: 98.2 },
                    { skillName: '代码格式化', calls: 623, successRate: 94.5 },
                    { skillName: 'PDF解析', calls: 345, successRate: 89.3 },
                    { skillName: '图表生成', calls: 218, successRate: 96.1 }
                  ]}
                  columns={[
                    { title: 'Skill', dataIndex: 'skillName', key: 'skillName', fontSize: 12 },
                    { title: '调用', dataIndex: 'calls', key: 'calls', width: 60 },
                    { 
                      title: '成功率', 
                      dataIndex: 'successRate', 
                      key: 'successRate', 
                      width: 70,
                      render: (value: number) => (
                        <Text style={{ color: value >= 95 ? colors.green : value >= 90 ? colors.orange : colors.red, fontSize: 12 }}>
                          {value}%
                        </Text>
                      ) 
                    }
                  ]}
                  pagination={false}
                  rowKey="skillName"
                  size="small"
                />
              </Card>
            </Col>
            
            {/* 右：失败类型分布 - 减小高度 */}
            <Col span={12}>
              <Card title="失败类型分布" size="small" style={{ height: '100%' }}>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                      <XAxis type="number" fontSize={11} />
                      <YAxis dataKey="name" type="category" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill={colors.red} name="失败次数" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 最近异常日志 - 更紧凑 */}
          <Card title="最近异常" size="small">
            <Table
              dataSource={[
                { time: '14:32:15', error: '知识库检索超时', level: '高' },
                { time: '12:18:45', error: '参数格式错误', level: '中' },
                { time: '10:05:22', error: 'Skill调用失败', level: '高' }
              ]}
              columns={[
                { title: '时间', dataIndex: 'time', key: 'time', width: 80 },
                { title: '错误信息', dataIndex: 'error', key: 'error' },
                { 
                  title: '级别', 
                  dataIndex: 'level', 
                  key: 'level',
                  width: 50,
                  render: (level: string) => (
                    <Tag color={level === '高' ? colors.red : colors.orange} style={{ fontSize: 10, padding: '0 6px' }}>
                      {level}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              rowKey="time"
              size="small"
            />
          </Card>
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/agents')}>
          返回列表
        </Button>
        <Space>
          {hasUnsavedChanges && (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveAll}>
              保存所有修改
            </Button>
          )}
          <Button
            type="primary"
            icon={<MessageOutlined />}
            disabled={agent.status !== 'online'}
            onClick={() => navigate(`/agents/${id}/chat`)}
          >
            对话调试
          </Button>
          <Button
            type="default"
            icon={<PlayCircleOutlined />}
            disabled={agent.status !== 'online'}
            onClick={handleRun}
          >
            运行
          </Button>
        </Space>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ marginBottom: 8 }}>{agent.name}</h2>
          <p style={{ color: '#666', marginBottom: 0 }}>{agent.description}</p>
        </div>
        <Tabs items={tabItems} />
      </Card>

      {/* 运行参数配置弹窗 */}
      <Modal
        title="运行 Agent"
        open={paramModalVisible}
        onCancel={() => setParamModalVisible(false)}
        onOk={() => {
          setParamModalVisible(false)
          setRunning(true)
          message.loading('Agent 执行中...', 0)

          // 模拟执行过程
          setTimeout(() => {
            const result = {
              success: true,
              duration: 1.8,
              input: testInput,
              output: `你好，我是${agent.name}，${agent.description}。我可以帮你处理相关的任务需求，你可以提供更多具体的信息，我会结合绑定的Skill为你提供准确的回答。`,
              skillExecution: [
                { name: '知识库检索', status: 'success', duration: 0.5, result: '检索到相关文档3篇' },
                { name: '内容理解', status: 'success', duration: 0.8, result: '已理解用户需求' },
                { name: '结果生成', status: 'success', duration: 0.5, result: '生成回答完成' }
              ],
              traceId: `trace_${Date.now()}`
            }
            setExecutionResult(result)
            message.destroy()
            setRunning(false)
            setResultModalVisible(true)
          }, 2000)
        }}
        confirmLoading={running}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>输入内容</div>
          <TextArea
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            rows={4}
            placeholder="请输入要发送给Agent的内容"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>将调用的技能</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedSkillDetails.length > 0 ? (
              selectedSkillDetails.map(skill => (
                <Tag key={skill.id} color={colors.blue}>{skill.name}</Tag>
              ))
            ) : (
              <Text type="secondary">未绑定任何Skill</Text>
            )}
          </div>
        </div>
      </Modal>

      {/* 运行结果弹窗 */}
      <Modal
        title="运行结果"
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        width={800}
        footer={[
          <Space key="actions">
            <Button key="view-trace" onClick={() => navigate(`/agents/${id}/traces/${executionResult?.traceId}`)}>
              查看完整 Trace
            </Button>
            <Button key="ok" type="primary" onClick={() => setResultModalVisible(false)}>
              确定
            </Button>
          </Space>
        ]}
      >
        {executionResult && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Space>
                <Tag color={executionResult.success ? colors.green : colors.red}>
                  {executionResult.success ? '成功' : '失败'}
                </Tag>
                <Text type="secondary">耗时: {executionResult.duration}s</Text>
              </Space>
              <Text type="secondary" code>Trace: {executionResult.traceId}</Text>
            </div>

            <Card title="输入" size="small" style={{ marginBottom: 12 }}>
              <Text>{executionResult.input}</Text>
            </Card>

            <Card title="输出" size="small" style={{ marginBottom: 12 }}>
              <Text>{executionResult.output}</Text>
            </Card>

            <Card title="执行链路" size="small">
              <Timeline>
                {executionResult.skillExecution.map((step: any, index: number) => (
                  <Timeline.Item
                    key={index}
                    color={step.status === 'success' ? colors.green : colors.red}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{step.name}</Text>
                      <Text type="secondary">{step.duration}s</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{step.result}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AgentDetail