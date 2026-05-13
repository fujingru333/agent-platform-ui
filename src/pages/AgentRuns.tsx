import React, { useState } from 'react'
import { Card, Table, Button, Tag, Input, Select, Space, Typography } from 'antd'
import { SearchOutlined, EyeOutlined, LeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { mockTraces } from '../mockData'
import { Trace } from '../types'

const { Text } = Typography
const { Option } = Select

const AgentRuns: React.FC = () => {
  const navigate = useNavigate()
  const { agentId } = useParams<{ agentId: string }>()

  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // 过滤数据
  const filteredTraces = mockTraces.filter(trace => {
    const matchesAgent = agentId ? trace.agentId === agentId : true
    const matchesSearch = trace.input.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter ? trace.status === statusFilter : true
    return matchesAgent && matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Trace ID',
      dataIndex: 'traceId',
      key: 'traceId',
      render: (traceId: string) => <Text code>{traceId}</Text>,
    },
    {
      title: 'Agent',
      dataIndex: 'agentName',
      key: 'agentName',
      hidden: !!agentId,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = { success: 'green', error: 'red', running: 'blue' }
        const labels: Record<string, string> = { success: '成功', error: '失败', running: '运行中' }
        return <Tag color={colors[status]}>{labels[status]}</Tag>
      }
    },
    {
      title: '输入',
      dataIndex: 'input',
      key: 'input',
      ellipsis: true,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => duration ? `${duration.toFixed(1)}s` : '-',
    },
    {
      title: 'Token',
      dataIndex: 'tokenCount',
      key: 'tokenCount',
      render: (count: number) => count ? count.toLocaleString() : '-',
    },
    {
      title: '运行时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: Date) => time.toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Trace) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/agents/${record.agentId}/traces/${record.traceId}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate(agentId ? `/agents/${agentId}` : '/agents')}>
          返回
        </Button>
      </div>

      <Card title={agentId ? `${agentId} 的运行历史` : 'Agent 运行历史'}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索输入内容"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="状态筛选"
            style={{ width: 150 }}
            allowClear
            onChange={setStatusFilter}
          >
            <Option value="success">成功</Option>
            <Option value="error">失败</Option>
            <Option value="running">运行中</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredTraces}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default AgentRuns
