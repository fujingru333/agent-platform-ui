import React, { useState } from 'react'
import { Card, Button, Space, Typography, Tag, Timeline, Divider, Row, Col, Statistic, Collapse, Progress, Tooltip } from 'antd'
import { LeftOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, DatabaseOutlined, CodeOutlined, ThunderboltOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { mockTraces } from '../mockData'

const { Title, Text, Paragraph } = Typography
const { Panel } = Collapse

interface ThinkingNode {
  id: string
  type: 'prompt' | 'retrieval' | 'skill' | 'llm' | 'reasoning'
  name: string
  status: 'success' | 'error'
  duration?: number
  input?: string
  output?: string
  metadata?: any
  children?: ThinkingNode[]
}

const TraceDetail: React.FC = () => {
  const navigate = useNavigate()
  const { agentId, traceId } = useParams<{ agentId: string; traceId: string }>()
  const trace = mockTraces.find(t => t.traceId === traceId)
  const [activeTab, setActiveTab] = useState<'timeline' | 'mindmap'>('mindmap')

  if (!trace) {
    return <div>Trace 不存在</div>
  }

  const thinkingTree: ThinkingNode[] = [
    {
      id: 'root',
      type: 'prompt',
      name: '用户请求',
      status: 'success',
      duration: 10,
      input: trace.input,
      output: trace.input,
      children: [
        {
          id: 'step1',
          type: 'prompt',
          name: '加载 System Prompt',
          status: 'success',
          duration: 20,
          output: '你是一个专业的客户服务助手，请礼貌、耐心地回答用户问题。',
        },
        {
          id: 'step2',
          type: 'retrieval',
          name: '知识库检索',
          status: 'success',
          duration: 450,
          metadata: { retrievedChunks: 3, topScore: 0.92 },
          children: [
            {
              id: 'chunk1',
              type: 'retrieval',
              name: '片段 1 - 退款政策',
              status: 'success',
              output: '退款政策：用户在购买后7天内可申请无理由退款...',
              metadata: { score: 0.92, source: '产品功能说明.pdf' },
            },
            {
              id: 'chunk2',
              type: 'retrieval',
              name: '片段 2 - 退款流程',
              status: 'success',
              output: '退款流程：1. 登录账户 2. 进入订单详情页...',
              metadata: { score: 0.85, source: '产品功能说明.pdf' },
            },
          ],
        },
        {
          id: 'step3',
          type: 'reasoning',
          name: '意图理解',
          status: 'success',
          duration: 80,
          output: '用户询问如何申请退款，需要提供完整的退款流程说明',
        },
        {
          id: 'step4',
          type: 'llm',
          name: '生成回答',
          status: 'success',
          duration: 1200,
          output: trace.output,
        },
      ],
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#52c41a'
    if (score >= 0.6) return '#faad14'
    return '#ff4d4f'
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'prompt': return <ThunderboltOutlined />
      case 'retrieval': return <DatabaseOutlined />
      case 'skill': return <CodeOutlined />
      case 'llm': return <ThunderboltOutlined />
      case 'reasoning': return <QuestionCircleOutlined />
      default: return <EyeOutlined />
    }
  }

  const renderMindMapNode = (node: ThinkingNode, level: number = 0) => {
    const isRoot = level === 0
    const indent = level * 24

    return (
      <div key={node.id}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          marginLeft: indent,
          padding: '12px 16px',
          backgroundColor: isRoot ? '#e6f7ff' : '#fafafa',
          borderRadius: 8,
          marginBottom: 8,
          borderLeft: `4px solid ${node.status === 'success' ? '#52c41a' : '#ff4d4f'}`,
        }}>
          <div style={{ 
            fontSize: 20, 
            marginRight: 12, 
            color: node.status === 'success' ? '#52c41a' : '#ff4d4f' 
          }}>
            {node.status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ marginRight: 8 }}>{getNodeIcon(node.type)}</span>
              <Text strong style={{ fontSize: 14 }}>{node.name}</Text>
              {node.duration && (
                <Tag color="blue" style={{ fontSize: 11, padding: '2px 8px' }}>
                  {node.duration}ms
                </Tag>
              )}
              <Tag style={{ fontSize: 11, padding: '2px 8px' }}>
                {node.type}
              </Tag>
            </div>
            {node.output && (
              <Collapse size="small" ghost>
                <Panel header="查看详情" key="1">
                  <pre style={{ 
                    fontSize: 12, 
                    backgroundColor: '#fff', 
                    padding: 12, 
                    borderRadius: 4,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}>
                    {node.output}
                  </pre>
                </Panel>
              </Collapse>
            )}
            {node.metadata && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                {Object.entries(node.metadata).map(([key, value]) => (
                  <span key={key} style={{ marginRight: 16 }}>
                    {key}: {JSON.stringify(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {node.children.map(child => renderMindMapNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate(`/agents/${agentId}`)}>
          返回 Agent 详情
        </Button>
      </div>

      <Card title="Trace 详情">
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Statistic
              title="状态"
              value={trace.status === 'success' ? '成功' : trace.status === 'error' ? '失败' : '运行中'}
              prefix={trace.status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              valueStyle={{ color: trace.status === 'success' ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col span={4}>
            <Statistic title="Agent" value={trace.agentName} />
          </Col>
          <Col span={4}>
            <Statistic title="耗时" value={trace.duration ? trace.duration.toFixed(1) : '-'} suffix="s" />
          </Col>
          <Col span={4}>
            <Statistic title="Token" value={trace.tokenCount ? trace.tokenCount.toLocaleString() : '-'} />
          </Col>
          <Col span={4}>
            <Statistic
              title="事实准确度"
              value={trace.hallucinationScore !== undefined ? `${Math.round(trace.hallucinationScore * 100)}%` : '-'}
              valueStyle={{ color: trace.hallucinationScore !== undefined ? getScoreColor(trace.hallucinationScore) : undefined }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="用户反馈"
              value={
                trace.userFeedback === 'positive' ? '👍' :
                trace.userFeedback === 'negative' ? '👎' : '未反馈'
              }
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Card title="输入" type="inner">
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{trace.input}</pre>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="输出" type="inner">
              {trace.status === 'error' ? (
                <div style={{ color: '#ff4d4f' }}>{trace.error}</div>
              ) : trace.output ? (
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{trace.output}</pre>
              ) : (
                <span style={{ color: '#999' }}>等待执行中...</span>
              )}
            </Card>
          </Col>
        </Row>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type={activeTab === 'mindmap' ? 'primary' : 'default'}
              onClick={() => setActiveTab('mindmap')}
            >
              思维地图
            </Button>
            <Button 
              type={activeTab === 'timeline' ? 'primary' : 'default'}
              onClick={() => setActiveTab('timeline')}
            >
              时间线
            </Button>
          </Space>
        </div>

        {activeTab === 'mindmap' ? (
          <Card title="思维地图 - Agent 的思考过程">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                这是 Agent 处理请求时的完整思维链路，展示了从接收到请求到生成回答的每一个步骤。
              </Text>
            </div>
            {thinkingTree.map(node => renderMindMapNode(node))}
          </Card>
        ) : (
          <Card title="执行流程">
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <p><Text strong>System Prompt</Text> - 200ms</p>
                      <p style={{ fontSize: 12, color: '#999' }}>加载 Agent 的系统提示词</p>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <p><Text strong>知识库检索</Text> - 450ms</p>
                      <p style={{ fontSize: 12, color: '#999' }}>从企业知识库检索到 3 个相关片段</p>
                    </div>
                  ),
                },
                {
                  color: 'cyan',
                  children: (
                    <div>
                      <p><Text strong>意图理解</Text> - 80ms</p>
                      <p style={{ fontSize: 12, color: '#999' }}>分析用户需求并确定回答策略</p>
                    </div>
                  ),
                },
                {
                  color: 'cyan',
                  children: (
                    <div>
                      <p><Text strong>LLM 调用</Text> - 1200ms</p>
                      <p style={{ fontSize: 12, color: '#999' }}>调用大语言模型生成回答</p>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <p><Text strong>返回结果</Text> - 完成</p>
                      <p style={{ fontSize: 12, color: '#999' }}>返回最终结果给用户</p>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        )}

        {trace.hallucinationScore !== undefined && (
          <>
            <Divider />
            <Card title="幻觉检测 & 事实评估">
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: '50%', 
                      border: `10px solid ${getScoreColor(trace.hallucinationScore)}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginBottom: 12,
                    }}>
                      {Math.round(trace.hallucinationScore * 100)}%
                    </div>
                    <div>
                      <Text strong>事实准确度</Text>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Card size="small" type="inner">
                    <Paragraph>
                      {trace.hallucinationScore >= 0.8 
                        ? '✅ 回答高度基于检索到的知识，可信度高。所有关键信息都能在知识库中找到依据。'
                        : trace.hallucinationScore >= 0.6
                        ? '⚠️ 回答基本基于事实，但部分细节可能是合理推断。建议核对重要信息。'
                        : '❌ 回答包含较多猜测成分，可能存在幻觉。请谨慎使用并核实关键内容。'}
                    </Paragraph>
                    <div style={{ marginTop: 12 }}>
                      <Text strong>评估维度：</Text>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>
                          <Text>知识引用率</Text>
                          <Progress percent={85} size="small" style={{ marginTop: 4 }} />
                        </div>
                        <div style={{ marginBottom: 4 }}>
                          <Text>一致性</Text>
                          <Progress percent={92} size="small" style={{ marginTop: 4 }} />
                        </div>
                        <div>
                          <Text>逻辑合理性</Text>
                          <Progress percent={88} size="small" style={{ marginTop: 4 }} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </>
        )}

        <Divider />

        <Card 
          title="Langfuse Trace 详情" 
          style={{ marginTop: 16 }}
        >
          <div style={{ 
            padding: '60px 40px', 
            textAlign: 'center', 
            background: '#fafafa', 
            border: '1px dashed #d9d9d9', 
            borderRadius: 8 
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Langfuse Trace 详情
            </div>
            <div style={{ color: '#666', marginBottom: 24 }}>
              Trace ID: <span style={{ fontFamily: 'monospace', background: '#f0f0f0', padding: '2px 8px', borderRadius: 4 }}>{traceId}</span>
            </div>
            
            <Button 
              type="primary" 
              href={`http://hormuz.blueazure.cn:8680/project/cmnfng20k0001mx07zdo3n6ns/traces?peek=${traceId}`} 
              target="_blank"
              size="large"
              icon={<EyeOutlined />}
            >
              在新标签页查看 Langfuse Trace
            </Button>
            
            <div style={{ marginTop: 24, fontSize: 12, color: '#999' }}>
              <p>说明：由于 Langfuse 服务器设置了安全限制，无法在 iframe 中直接嵌入显示</p>
              <p>点击上方按钮在新标签页中查看完整的 Trace 详情</p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  )
}

export default TraceDetail
