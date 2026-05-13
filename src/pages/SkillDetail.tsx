import React from 'react'
import { Card, Tabs, Descriptions, Button, Table, Row, Col, Statistic, Progress, Tag, Typography, List } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { mockSkills } from '../mockData'

const { Text } = Typography

// 统一的低饱和配色方案
const colors = {
  green: '#6d9f78',
  blue: '#7396b2',
  orange: '#d4a574',
  purple: '#998aaf',
  red: '#c68a8a',
  lightRed: '#d4a7a7'
}

const versionData = [
  { version: 'v1.0.0', score: 1.2, successRate: 88 },
  { version: 'v1.1.0', score: 1.0, successRate: 92 },
  { version: 'v1.2.0', score: 0.9, successRate: 95 },
  { version: 'v1.3.0', score: 0.8, successRate: 97 }
]

const errorData = [
  { name: '参数错误', count: 15 },
  { name: '超时', count: 8 },
  { name: '格式错误', count: 5 },
  { name: '权限不足', count: 3 }
]

const SkillDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const skill = mockSkills.find(s => s.id === id)

  if (!skill) {
    return <div>Skill 不存在</div>
  }

  const tabItems = [
    {
      key: 'info',
      label: '基本信息',
      children: (
        <div>
          {/* 基本信息 - 紧凑布局 */}
          <Card size="small" style={{ marginBottom: 12 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>名称</Text>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{skill.name}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Skill ID</Text>
                  <div style={{ fontSize: 13 }}>{skill.skillId}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>版本</Text>
                  <div style={{ fontSize: 13 }}>{skill.version}</div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>分类</Text>
                  <div style={{ fontSize: 13 }}>{skill.category}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>创建人</Text>
                  <div style={{ fontSize: 13 }}>{skill.creator}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>公开范围</Text>
                  <div>
                    <Tag color={skill.scope === 'public' ? 'blue' : 'orange'} style={{ fontSize: 11, padding: '0 8px' }}>
                      {skill.scope === 'public' ? '公共' : '私有'}
                    </Tag>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>状态</Text>
                  <div>
                    <Tag color={skill.status === 'enabled' ? 'green' : skill.status === 'disabled' ? 'default' : 'orange'} style={{ fontSize: 11, padding: '0 8px' }}>
                      {skill.status === 'enabled' ? '启用' : skill.status === 'disabled' ? '禁用' : '待审核'}
                    </Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>调用次数</Text>
                  <div style={{ fontSize: 13 }}>{skill.callCount}</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* SKILL.md 内容 - 更紧凑 */}
          <Card title="SKILL.md" size="small" style={{ marginBottom: 12 }}>
            <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 13 }}># {skill.name}</h4>
              <p style={{ margin: '0 0 8px 0' }}>{skill.description}</p>
              <h5 style={{ margin: '8px 0 4px 0', fontSize: 12 }}>## 能力说明</h5>
              <p style={{ margin: '0 0 8px 0' }}>这是一个标准化的 Skill，提供专业的能力支持。</p>
              <h5 style={{ margin: '8px 0 4px 0', fontSize: 12 }}>## 使用约束</h5>
              <p style={{ margin: 0 }}>• 请确保输入参数符合规范<br/>• 调用频率限制：100次/分钟</p>
            </div>
          </Card>

          {/* Resources 文件列表 - 更紧凑 */}
          <Card title="Resources" size="small">
            <Table
              dataSource={[
                { name: 'scripts/', type: 'folder', size: '-' },
                { name: 'scripts/main.py', type: 'file', size: '12KB' },
                { name: 'references/', type: 'folder', size: '-' },
                { name: 'assets/', type: 'folder', size: '-' },
                { name: 'assets/config.json', type: 'file', size: '2KB' }
              ]}
              columns={[
                { title: '文件名', dataIndex: 'name', key: 'name', fontSize: 12 },
                { title: '类型', dataIndex: 'type', key: 'type', width: 60 },
                { title: '大小', dataIndex: 'size', key: 'size', width: 60 }
              ]}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </Card>
        </div>
      )
    },
    {
      key: 'usage',
      label: '关联使用',
      children: (
        <div>
          <Row gutter={12} style={{ marginBottom: 12 }}>
            <Col span={8}>
              <Card size="small">
                <Statistic title="已绑定 Agent 数量" value={12} valueStyle={{ color: '#1890ff', fontSize: 20 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="总调用次数" value={skill.callCount} valueStyle={{ color: '#52c41a', fontSize: 20 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="最近调用" value="2024-03-28 15:42" valueStyle={{ color: '#faad14', fontSize: 20 }} />
              </Card>
            </Col>
          </Row>

          <Card title="已绑定的 Agent" size="small">
            <Table
              dataSource={[
                { name: '客户服务助手', version: 'v1.2.0', owner: '张三', callCount: 5680, lastCall: '2024-03-28 15:42' },
                { name: '智能问答助手', version: 'v2.0.0', owner: '李四', callCount: 3890, lastCall: '2024-03-28 14:25' },
                { name: '知识库助手', version: 'v1.0.0', owner: '王五', callCount: 2990, lastCall: '2024-03-28 12:18' }
              ]}
              columns={[
                { title: 'Agent 名称', dataIndex: 'name', key: 'name', render: (text: string) => <a style={{ fontSize: 12 }}>{text}</a> },
                { title: '版本', dataIndex: 'version', key: 'version', width: 70 },
                { title: '负责人', dataIndex: 'owner', key: 'owner', width: 60 },
                { title: '调用次数', dataIndex: 'callCount', key: 'callCount', width: 70 },
                { title: '最近调用', dataIndex: 'lastCall', key: 'lastCall', width: 140 }
              ]}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </Card>
        </div>
      )
    },
    {
      key: 'evaluation',
      label: '技能评估',
      children: (
        <div>
          {/* 核心指标 - 横向展示 */}
          <Card size="small" style={{ marginBottom: 12 }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>调用成功率</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: colors.green }}>96.8%</div>
                  <div style={{ fontSize: 11, color: '#999' }}>近7天调用</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>有效结果率</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: colors.blue }}>92.8%</div>
                  <div style={{ fontSize: 11, color: '#999' }}>结果符合预期</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>平均耗时</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: colors.orange }}>0.8s</div>
                  <div style={{ fontSize: 11, color: '#999' }}>单次调用</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>综合评分</div>
                  <div style={{ fontSize: 22, fontWeight: 600, color: colors.purple }}>{skill.score.toFixed(2)}/100</div>
                  <div style={{ fontSize: 11, color: '#999' }}>综合评估</div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 版本迭代健康趋势 - 减小高度 */}
          <Card title="版本趋势" size="small" style={{ marginBottom: 12 }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={versionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                <XAxis dataKey="version" fontSize={11} />
                <YAxis yAxisId="left" domain={[0, 100]} fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 2]} fontSize={11} />
                <Tooltip />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke={colors.green} 
                  name="成功率" 
                  strokeWidth={2}
                  dot={{ fill: colors.green, r: 3 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="score" 
                  stroke={colors.blue} 
                  name="耗时" 
                  strokeWidth={2}
                  dot={{ fill: colors.blue, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 底部双栏 - 更紧凑 */}
          <Row gutter={12}>
            {/* 左：TOP3 错误类型 */}
            <Col span={12}>
              <Card title="TOP3 错误" size="small">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
                  {[
                    { name: '参数错误', count: 15, color: colors.red },
                    { name: '超时', count: 8, color: colors.lightRed },
                    { name: '格式错误', count: 5, color: colors.orange }
                  ].map((item, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text strong style={{ fontSize: 12 }}>{item.name}</Text>
                        <Text strong style={{ fontSize: 12 }}>{item.count}次</Text>
                      </div>
                      <Progress 
                        percent={(item.count / 15) * 100} 
                        strokeColor={item.color}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
            
            {/* 右：最近异常调用日志 */}
            <Col span={12}>
              <Card title="最近异常" size="small">
                <List
                  dataSource={[
                    { time: '14:32:15', error: '超时', input: '处理大型PDF文件' },
                    { time: '12:18:45', error: '参数错误', input: '缺失必填参数' },
                    { time: '10:05:22', error: '格式错误', input: '上传JSON格式错误' }
                  ]}
                  size="small"
                  renderItem={(item) => (
                    <List.Item style={{ padding: '6px 0' }}>
                      <List.Item.Meta
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Tag color={colors.red} style={{ fontSize: 10, padding: '0 6px', height: 20, lineHeight: '18px' }}>{item.error}</Tag>
                            <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
                          </div>
                        }
                        description={
                          <div style={{ marginTop: 4 }}>
                            <Text style={{ fontSize: 11 }}>输入：{item.input}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/skills')}>
          返回
        </Button>
      </div>

      <Card title={skill.name} style={{ marginBottom: 16 }}>
        <p style={{ color: '#666' }}>{skill.description}</p>
      </Card>

      <Tabs items={tabItems} />
    </div>
  )
}

export default SkillDetail
