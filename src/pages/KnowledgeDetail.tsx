import React, { useState } from 'react'
import { Card, Button, Space, Typography, Tag, Row, Col, Statistic, Table, Progress, Upload, message } from 'antd'
import { LeftOutlined, UploadOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { mockKnowledgeBases, mockDocuments } from '../mockData'
import { Document } from '../types'

const { Title, Text } = Typography

const KnowledgeDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const knowledgeBase = mockKnowledgeBases.find(kb => kb.id === id)
  const [fileList, setFileList] = useState<any[]>([])

  if (!knowledgeBase) {
    return <div>知识库不存在</div>
  }

  const documents = mockDocuments.filter(doc => doc.knowledgeBaseId === id)

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'processing':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />
      case 'failed':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      default:
        return null
    }
  }

  const getKBStatusColor = (status: typeof knowledgeBase.status) => {
    switch (status) {
      case 'ready':
        return '#52c41a'
      case 'indexing':
        return '#1890ff'
      case 'error':
        return '#ff4d4f'
      default:
        return '#999'
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
      title: '文档',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Document) => (
        <Space>
          {getStatusIcon(record.status)}
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.type.toUpperCase()} · {formatSize(record.size)}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Document['status']) => {
        const statusMap: Record<string, string> = {
          processed: '已处理',
          processing: '处理中',
          failed: '失败'
        }
        return <span>{statusMap[status]}</span>
      },
    },
    {
      title: '分块数量',
      dataIndex: 'chunkCount',
      key: 'chunkCount',
      render: (count: number) => (
        <span>{count > 0 ? `${count} 个分块` : '-'}</span>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">删除</Button>
        </Space>
      ),
    },
  ]

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file])
      message.success('文件已添加，点击"上传"按钮开始上传')
      return false
    },
    fileList,
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/knowledge')}>
          返回
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card title={knowledgeBase.name}>
            <Row gutter={16}>
              <Col span={4}>
                <Statistic
                  title="状态"
                  value={knowledgeBase.status === 'ready' ? '就绪' : knowledgeBase.status === 'indexing' ? '索引中' : '错误'}
                  valueStyle={{ color: getKBStatusColor(knowledgeBase.status) }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="文档数量"
                  value={knowledgeBase.documentCount}
                  prefix={<FileTextOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="分块数量"
                  value={knowledgeBase.chunkCount}
                  prefix={<DatabaseOutlined />}
                  formatter={(value) => value.toLocaleString()}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="存储大小"
                  value={formatSize(knowledgeBase.size)}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="嵌入模型"
                  value={knowledgeBase.embeddingModel}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="创建者"
                  value={knowledgeBase.creator}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Text type="secondary">{knowledgeBase.description}</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Space size={[0, 4]} wrap>
                {knowledgeBase.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <Card size="small" title="分块策略" type="inner">
                  <div>
                    <Text strong>策略：</Text>
                    <span>{knowledgeBase.chunkingStrategy.strategy === 'fixed' ? '固定大小' : knowledgeBase.chunkingStrategy.strategy === 'semantic' ? '语义分块' : 'Markdown'}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text strong>分块大小：</Text>
                    <span>{knowledgeBase.chunkingStrategy.chunkSize} tokens</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text strong>重叠大小：</Text>
                    <span>{knowledgeBase.chunkingStrategy.chunkOverlap} tokens</span>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                {knowledgeBase.status === 'indexing' && (
                  <Card size="small" title="索引进度" type="inner">
                    <Progress percent={65} status="active" />
                    <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                      正在处理文档并生成向量嵌入...
                    </div>
                  </Card>
                )}
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Space>
                {knowledgeBase.status === 'ready' && (
                  <Button type="primary" onClick={() => navigate(`/knowledge/${id}/test`)}>
                    向量检索测试
                  </Button>
                )}
                <Button>重新索引</Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="文档列表"
            extra={
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传文档</Button>
              </Upload>
            }
          >
            <Table
              columns={columns}
              dataSource={documents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default KnowledgeDetail
