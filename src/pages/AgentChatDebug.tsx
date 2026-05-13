import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Space, Typography, Input, Tag, Row, Col, Timeline, Divider, Spin, Avatar, Badge, message } from 'antd'
import { LeftOutlined, SendOutlined, DatabaseOutlined, CodeOutlined, ThunderboltOutlined, EyeOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { mockAgents } from '../mockData'
import ReactMarkdown from 'react-markdown'

const { Title, Text, Paragraph } = Typography

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  traceId?: string
  thinking?: ThinkingStep[]
  retrievedChunks?: RetrievedChunk[]
  hallucinationScore?: number
  userFeedback?: 'positive' | 'negative' | null
}

interface ThinkingStep {
  id: string
  type: 'prompt' | 'retrieval' | 'skill' | 'llm' | 'reasoning'
  name: string
  status: 'success' | 'error'
  duration?: number
  input?: string
  output?: string
  metadata?: any
}

interface RetrievedChunk {
  id: string
  content: string
  source: string
  score: number
}

const AgentChatDebug: React.FC = () => {
  const navigate = useNavigate()
  const { agentId } = useParams<{ agentId: string }>()
  const agent = mockAgents.find(a => a.id === agentId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `你好！我是${agent?.name || 'Agent'}。有什么可以帮助你的吗？`,
      timestamp: new Date(Date.now() - 3600000),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!agent) {
    return <div>Agent 不存在</div>
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const thinkingSteps: ThinkingStep[] = [
        {
          id: 't1',
          type: 'prompt',
          name: '加载 System Prompt',
          status: 'success',
          duration: 20,
        },
        {
          id: 't2',
          type: 'retrieval',
          name: '检索知识库',
          status: 'success',
          duration: 450,
        },
        {
          id: 't3',
          type: 'reasoning',
          name: '理解用户意图',
          status: 'success',
          duration: 100,
        },
        {
          id: 't4',
          type: 'llm',
          name: '生成回答',
          status: 'success',
          duration: 1200,
        },
      ]

      const retrievedChunks: RetrievedChunk[] = [
        {
          id: 'c1',
          content: 'Python 编码规范：遍历列表应优先使用 for item in items，避免 range(len(items))，提升可读性与安全性。',
          source: 'Python代码规范指南.pdf',
          score: 0.94,
        },
        {
          id: 'c2',
          content: '开发最佳实践：处理列表参数时建议增加空值判断，增强代码健壮性，避免无效循环执行。',
          source: '开发规范FAQ.md',
          score: 0.88,
        },
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `您好！我是代码审查员，已完成您提供的代码检查，结果如下：

      1. 循环写法冗余：不推荐使用 for i in range(len(items))，建议直接遍历列表
      2. 缺少参数校验：未对空列表做边界处理，代码健壮性不足
      3. 可使用内置函数优化：直接使用 sum(items) 更简洁高效

      优化后的推荐代码：
      def calculate_total(items: list[int]) -> int:
          if not items:
              return 0
          return sum(items)

      需要我帮你补充单元测试或继续审查其他代码吗？`,
        timestamp: new Date(),
        traceId: 'trace-' + Date.now(),
        thinking: thinkingSteps,
        retrievedChunks: retrievedChunks,
        hallucinationScore: 0.8,
        userFeedback: null,
      };

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, userFeedback: feedback } : m
    ))
    message.success('感谢您的反馈！')
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#52c41a'
    if (score >= 0.6) return '#faad14'
    return '#ff4d4f'
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'prompt': return <ThunderboltOutlined />
      case 'retrieval': return <DatabaseOutlined />
      case 'skill': return <CodeOutlined />
      case 'llm': return <ThunderboltOutlined />
      case 'reasoning': return <ThunderboltOutlined />
      default: return <EyeOutlined />
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate(`/agents/${agentId}`)}>
          返回 Agent 详情
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={selectedMessage ? 14 : 24}>
          <Card 
            title={
              <Space>
                <Avatar>{agent.name.charAt(0)}</Avatar>
                <span>{agent.name}</span>
                <Badge status="success" text="在线" />
              </Space>
            }
            style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                      color: msg.role === 'user' ? 'white' : 'black',
                      padding: '12px 16px',
                      borderRadius: 8,
                      cursor: msg.role === 'assistant' && msg.thinking ? 'pointer' : 'default',
                      border: selectedMessage?.id === msg.id ? '2px solid #1890ff' : 'none',
                    }}
                    onClick={() => msg.role === 'assistant' && msg.thinking && setSelectedMessage(msg)}
                  >
                    {msg.role === 'assistant' ? (
                      <div style={{ color: '#000' }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    <div style={{ 
                      fontSize: 12, 
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#999',
                      marginTop: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>{msg.timestamp.toLocaleTimeString()}</span>
                      {msg.traceId && (
                        <Space size="small">
                          {msg.hallucinationScore !== undefined && (
                            <Tag color={getScoreColor(msg.hallucinationScore)} style={{ fontSize: 10, padding: '2px 6px' }}>
                              事实准确度: {Math.round(msg.hallucinationScore * 100)}%
                            </Tag>
                          )}
                          {msg.userFeedback === null && (
                            <Space size="small">
                              <LikeOutlined 
                                style={{ cursor: 'pointer' }} 
                                onClick={(e) => { e.stopPropagation(); handleFeedback(msg.id, 'positive') }}
                              />
                              <DislikeOutlined 
                                style={{ cursor: 'pointer' }} 
                                onClick={(e) => { e.stopPropagation(); handleFeedback(msg.id, 'negative') }}
                              />
                            </Space>
                          )}
                          {msg.userFeedback === 'positive' && <LikeOutlined style={{ color: '#52c41a' }} />}
                          {msg.userFeedback === 'negative' && <DislikeOutlined style={{ color: '#ff4d4f' }} />}
                        </Space>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '12px 16px', 
                    borderRadius: 8 
                  }}>
                    <Spin size="small" />
                    <span style={{ marginLeft: 8 }}>思考中...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <Input.TextArea
                rows={3}
                placeholder="输入消息..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    handleSend()
                  }
                }}
              />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>按 Ctrl+Enter 发送</Text>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  发送
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {selectedMessage && (
          <Col span={10}>
            <Card 
              title="思维链 & 检索上下文"
              extra={
                <Button size="small" onClick={() => setSelectedMessage(null)}>
                  关闭
                </Button>
              }
              style={{ height: 'calc(100vh - 160px)', overflowY: 'auto' }}
            >
              {selectedMessage.traceId && (
                <div style={{ marginBottom: 16 }}>
                  <Tag>Trace ID: {selectedMessage.traceId}</Tag>
                  <Button 
                    type="link" 
                    size="small"
                    onClick={() => navigate(`/agents/${agentId}/traces/${selectedMessage.traceId}`)}
                  >
                    查看完整 Trace
                  </Button>
                </div>
              )}

              {selectedMessage.thinking && (
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>思维过程</Title>
                  <Timeline
                    items={selectedMessage.thinking.map(step => ({
                      dot: getStepIcon(step.type),
                      color: step.status === 'success' ? 'green' : 'red',
                      children: (
                        <div>
                          <Text strong>{step.name}</Text>
                          {step.duration && (
                            <Tag style={{ marginLeft: 8 }}>{step.duration}ms</Tag>
                          )}
                        </div>
                      ),
                    }))}
                  />
                </div>
              )}

              {selectedMessage.retrievedChunks && selectedMessage.retrievedChunks.length > 0 && (
                <div>
                  <Title level={5}>检索到的知识片段</Title>
                  {selectedMessage.retrievedChunks.map((chunk) => (
                    <Card 
                      key={chunk.id} 
                      size="small" 
                      style={{ marginBottom: 8, backgroundColor: '#fafafa' }}
                      extra={
                        <Tag color={getScoreColor(chunk.score)}>
                          相似度: {Math.round(chunk.score * 100)}%
                        </Tag>
                      }
                    >
                      <Paragraph style={{ fontSize: 14, marginBottom: 4 }}>{chunk.content}</Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>来源: {chunk.source}</Text>
                    </Card>
                  ))}
                </div>
              )}

              {selectedMessage.hallucinationScore !== undefined && (
                <div style={{ marginTop: 24 }}>
                  <Title level={5}>事实准确性评估</Title>
                  <Card size="small">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        border: `8px solid ${getScoreColor(selectedMessage.hallucinationScore)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                        {Math.round(selectedMessage.hallucinationScore * 100)}%
                      </div>
                      <div>
                        <Text strong>幻觉检测得分</Text>
                        <Paragraph style={{ fontSize: 12, marginBottom: 0 }}>
                          {selectedMessage.hallucinationScore >= 0.8 
                            ? '回答高度基于事实，可信度高'
                            : selectedMessage.hallucinationScore >= 0.6
                            ? '回答基本基于事实，但部分内容可能需要验证'
                            : '回答可能包含较多猜测成分，建议核实'}
                        </Paragraph>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default AgentChatDebug
