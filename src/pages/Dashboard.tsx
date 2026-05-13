import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography, Progress } from 'antd'
import {
  RiseOutlined,
  RobotOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  BookOutlined,
  LikeOutlined
} from '@ant-design/icons'
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
import { useNavigate } from 'react-router-dom'
import { dashboardStats, mockAgents, mockKnowledgeBases } from '../mockData'

const { Text } = Typography

// 统一的低饱和配色方案
const colors = {
  green: '#6d9f78',
  blue: '#7396b2',
  orange: '#d4a574',
  purple: '#998aaf',
  red: '#c68a8a'
}

const getScoreColor = (score: number) => {
  if (score >= 0.8) return '#52c41a'
  if (score >= 0.6) return '#faad14'
  return '#ff4d4f'
}

// 平台调用趋势数据（调用量 + 成功率）
const platformTrendData = [
  { time: '00:00', calls: 120, successRate: 96.5, hallucinationScore: 3.2 },
  { time: '04:00', calls: 80, successRate: 95.2, hallucinationScore: 3.5 },
  { time: '08:00', calls: 320, successRate: 97.1, hallucinationScore: 3.0 },
  { time: '12:00', calls: 580, successRate: 96.8, hallucinationScore: 3.1 },
  { time: '16:00', calls: 720, successRate: 95.9, hallucinationScore: 3.3 },
  { time: '20:00', calls: 450, successRate: 96.2, hallucinationScore: 3.4 },
  { time: '23:00', calls: 210, successRate: 97.3, hallucinationScore: 3.2 }
]

// 失败类型分布数据
const errorDistributionData = [
  { name: '参数错误', count: 12 },
  { name: '超时', count: 8 },
  { name: '权限不足', count: 5 },
  { name: '格式错误', count: 3 }
]

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="活跃 Agent 数"
              value={dashboardStats.agentCount}
              prefix={<RobotOutlined />}
              valueStyle={{ color: colors.blue }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已上线 Skill 数"
              value={dashboardStats.skillCount}
              prefix={<ToolOutlined />}
              valueStyle={{ color: colors.purple }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="知识库数"
              value={mockKnowledgeBases.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: colors.orange }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="今日调用量"
              value={dashboardStats.todayCalls}
              prefix={<ThunderboltOutlined />}
              suffix="次"
              valueStyle={{ color: colors.orange }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平台整体成功率"
              value={dashboardStats.successRate}
              prefix={<CheckCircleOutlined />}
              suffix="%"
              valueStyle={{ color: colors.green }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="用户满意度"
              value={94.8}
              prefix={<LikeOutlined />}
              suffix="%"
              valueStyle={{ color: colors.green }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="平台调用趋势">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={platformTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[90, 100]} />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="calls"
                  stroke={colors.blue}
                  name="调用量"
                  strokeWidth={2}
                  dot={{ fill: colors.blue, r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="successRate"
                  stroke={colors.green}
                  name="成功率"
                  strokeWidth={2}
                  dot={{ fill: colors.green, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="事实准确度趋势">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={platformTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hallucinationScore"
                  stroke={colors.orange}
                  name="幻觉评分"
                  strokeWidth={2}
                  dot={{ fill: colors.orange, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="失败类型分布">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill={colors.red} name="失败次数" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="高风险 Agent 预警">
            <Table
              dataSource={mockAgents.filter(a => a.status === 'online').slice(0, 5)}
              pagination={false}
              rowKey="id"
              columns={[
                { title: 'Agent 名称', dataIndex: 'name', key: 'name' },
                { 
                  title: '状态', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={status === 'online' ? colors.green : colors.red}>
                      {status === 'online' ? '在线' : '离线'}
                    </Tag>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/agents/${record.id}`)}>
                        查看详情
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(`/agents/${record.id}/chat`)}
                      >
                        对话调试
                      </Button>
                    </Space>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Agent 质量评估">
        <Row gutter={16}>
          {mockAgents.slice(0, 4).map(agent => (
            <Col span={6} key={agent.id}>
              <Card size="small" title={agent.name} style={{ marginBottom: 16 }}>
                <Text strong>事实准确度: 94%</Text>
                <Progress percent={94} strokeColor={colors.green} size="small" style={{ marginBottom: 12 }} />
                <Text strong>用户满意度: 92%</Text>
                <Progress percent={92} strokeColor={colors.orange} size="small" style={{ marginBottom: 12 }} />
                <Text strong>响应成功率: 97%</Text>
                <Progress percent={97} strokeColor={colors.blue} size="small" />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default Dashboard