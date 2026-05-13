import React, { useState } from 'react'
import { Table, Button, Space, Tag, Input, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, PlayCircleOutlined, EditOutlined, CopyOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockAgents } from '../mockData'
import { Agent } from '../types'

const { Option } = Select

// 统一的低饱和配色方案
const colors = {
  green: '#6d9f78',
  blue: '#7396b2',
  orange: '#d4a574',
  purple: '#998aaf',
  red: '#c68a8a'
}

const AgentList: React.FC = () => {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const columns = [
    {
      title: 'Agent 名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Agent) => (
        <a onClick={() => navigate(`/agents/${record.id}`)}>{text}</a>
      )
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          online: colors.green,
          offline: 'default',
          draft: colors.orange
        }
        const textMap: Record<string, string> = {
          online: '在线',
          offline: '下线',
          draft: '草稿'
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      },
      filters: [
        { text: '在线', value: 'online' },
        { text: '下线', value: 'offline' },
        { text: '草稿', value: 'draft' }
      ],
      onFilter: (value: string, record: Agent) => record.status === value
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '绑定 Skill 数量',
      dataIndex: 'skillCount',
      key: 'skillCount'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Agent) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/agents/${record.id}`)}>
            详情
          </Button>
          {record.status !== 'online' ? (
            <Button type="link" size="small" icon={<PlayCircleOutlined />}>
              上线
            </Button>
          ) : (
            <Button type="link" size="small" danger icon={<PlayCircleOutlined />}>
              下线
            </Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<CopyOutlined />}>
            复制
          </Button>
          <Popconfirm
            title="确定删除这个 Agent？"
            onConfirm={() => {
              setAgents(agents.filter(a => a.id !== record.id))
              message.success('删除成功')
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = !statusFilter || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索 Agent 名称"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="状态筛选"
            style={{ width: 150 }}
            allowClear
            onChange={setStatusFilter}
          >
            <Option value="online">在线</Option>
            <Option value="offline">下线</Option>
            <Option value="draft">草稿</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/agents/new')}>
          新建 Agent
        </Button>
      </div>

      <Table
        columns={columns as any}
        dataSource={filteredAgents}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default AgentList
