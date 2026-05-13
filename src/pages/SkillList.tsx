import React, { useState } from 'react'
import { Table, Button, Space, Tag, Input, Select, message } from 'antd'
import { PlusOutlined, SearchOutlined, UploadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockSkills } from '../mockData'
import { Skill } from '../types'

const { Option } = Select

// 统一的低饱和配色方案
const colors = {
  green: '#6d9f78',
  blue: '#7396b2',
  orange: '#d4a574',
  purple: '#998aaf',
  red: '#c68a8a'
}

const SkillList: React.FC = () => {
  const navigate = useNavigate()
  const [skills, setSkills] = useState<Skill[]>(mockSkills)
  const [searchText, setSearchText] = useState('')
  const [scopeFilter, setScopeFilter] = useState<string>('')

  const columns = [
    {
      title: 'Skill 名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Skill) => (
        <a onClick={() => navigate(`/skills/${record.id}`)}>{text}</a>
      )
    },
    {
      title: 'Skill ID',
      dataIndex: 'skillId',
      key: 'skillId'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
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
          enabled: colors.green,
          disabled: 'default',
          pending: colors.orange
        }
        const textMap: Record<string, string> = {
          enabled: '启用',
          disabled: '禁用',
          pending: '待审核'
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator'
    },
    {
      title: '评估总分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <span style={{ color: colors.orange, fontWeight: 'bold' }}>{score.toFixed(2)}</span>
    },
    {
      title: '调用次数',
      dataIndex: 'callCount',
      key: 'callCount'
    },
    {
      title: '公开范围',
      dataIndex: 'scope',
      key: 'scope',
      render: (scope: string) => (
        <Tag color={scope === 'public' ? colors.blue : colors.orange}>
          {scope === 'public' ? '公共' : '私有'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Skill) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/skills/${record.id}`)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          {record.status === 'enabled' ? (
            <Button type="link" size="small" danger>
              禁用
            </Button>
          ) : (
            <Button type="link" size="small">
              启用
            </Button>
          )}
        </Space>
      )
    }
  ]

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchText.toLowerCase()) || skill.skillId.toLowerCase().includes(searchText.toLowerCase())
    const matchesScope = !scopeFilter || skill.scope === scopeFilter
    return matchesSearch && matchesScope
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索 Skill 名称或 ID"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="范围筛选"
            style={{ width: 150 }}
            allowClear
            onChange={setScopeFilter}
          >
            <Option value="public">公共</Option>
            <Option value="private">私有</Option>
          </Select>
        </Space>
        <Space>
          <Button icon={<UploadOutlined />} onClick={() => navigate('/skills/upload')}>
            上传 Skill
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/skills/new')}>
            新建 Skill
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSkills}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default SkillList
