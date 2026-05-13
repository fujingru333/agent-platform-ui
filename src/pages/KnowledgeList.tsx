import React from 'react'
import { Card, Button, Table, Tag, Space, Typography } from 'antd'
import { PlusOutlined, FileTextOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockKnowledgeBases } from '../mockData'
import { KnowledgeBase } from '../types'

const { Title, Text } = Typography

const KnowledgeList: React.FC = () => {
  const navigate = useNavigate()

  const getStatusTag = (status: KnowledgeBase['status']) => {
    switch (status) {
      case 'ready':
        return <Tag color="success">就绪</Tag>
      case 'indexing':
        return <Tag color="blue">索引中</Tag>
      case 'error':
        return <Tag color="error">错误</Tag>
      default:
        return <Tag>未知</Tag>
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${bytes} B`
  }

  const columns = [
    {
      title: '知识库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: KnowledgeBase) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '文档数量',
      dataIndex: 'documentCount',
      key: 'documentCount',
      render: (count: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined />
          <span>{count} 个文档</span>
        </div>
      ),
    },
    {
      title: '分块数量',
      dataIndex: 'chunkCount',
      key: 'chunkCount',
      render: (count: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DatabaseOutlined />
          <span>{count.toLocaleString()} 个分块</span>
        </div>
      ),
    },
    {
      title: '存储大小',
      dataIndex: 'size',
      key: 'size',
      render: formatSize,
    },
    {
      title: '分块策略',
      key: 'chunking',
      render: (_: any, record: KnowledgeBase) => (
        <div>
          <Text strong>{record.chunkingStrategy.strategy === 'fixed' ? '固定大小' : record.chunkingStrategy.strategy === 'semantic' ? '语义分块' : 'Markdown'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.chunkingStrategy.chunkSize} tokens / {record.chunkingStrategy.chunkOverlap} overlap
          </Text>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: KnowledgeBase) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/knowledge/${record.id}`)}>
            详情
          </Button>
          {record.status === 'ready' && (
            <Button type="link" onClick={() => navigate(`/knowledge/${record.id}/test`)}>
              向量测试
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>知识中心</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/knowledge/new')}>
          新建知识库
        </Button>
      </div>

      <Card title="知识库列表">
        <Table
          columns={columns}
          dataSource={mockKnowledgeBases}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default KnowledgeList