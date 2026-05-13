import React, { useState } from 'react'
import { Card, Button, Space, Typography, Input, Slider, List, Tag, Row, Col, Statistic, Divider } from 'antd'
import { LeftOutlined, SearchOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { mockKnowledgeBases, mockVectorSearchResults } from '../mockData'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const VectorTest: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const knowledgeBase = mockKnowledgeBases.find(kb => kb.id === id)
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(5)
  const [minScore, setMinScore] = useState(0.5)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  if (!knowledgeBase) {
    return <div>知识库不存在</div>
  }

  const handleSearch = () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    setTimeout(() => {
      setSearchResults(mockVectorSearchResults)
      setIsSearching(false)
    }, 800)
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#52c41a'
    if (score >= 0.6) return '#faad14'
    return '#ff4d4f'
  }

  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(0)}%`
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate(`/knowledge/${id}`)}>
          返回知识库
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card title={`向量检索测试 - ${knowledgeBase.name}`}>
            <div style={{ marginBottom: 16 }}>
              <TextArea
                rows={4}
                placeholder="输入检索查询，例如：如何申请退款？"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onPressEnter={(e) => e.ctrlKey && handleSearch()}
              />
              <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                按 Ctrl+Enter 快速搜索
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>返回结果数 (Top K): {topK}</Text>
                </div>
                <Slider
                  min={1}
                  max={20}
                  value={topK}
                  onChange={setTopK}
                  marks={{ 1: '1', 5: '5', 10: '10', 20: '20' }}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>最低相似度: {formatScore(minScore)}</Text>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.05}
                  value={minScore}
                  onChange={setMinScore}
                  marks={{ 0: '0%', 0.5: '50%', 0.8: '80%', 1: '100%' }}
                />
              </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={isSearching}
                size="large"
                disabled={!query.trim()}
              >
                开始检索
              </Button>
            </div>

            {hasSearched && (
              <>
                <Divider />
                
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="找到结果"
                      value={searchResults.length}
                      prefix={<DatabaseOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="最高相似度"
                      value={searchResults.length > 0 ? formatScore(searchResults[0].score) : '-'}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="查询耗时"
                      value="0.12"
                      suffix="s"
                    />
                  </Col>
                </Row>

                <List
                  itemLayout="vertical"
                  size="large"
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item
                      key={item.chunkId}
                      actions={[
                        <Tag color={getScoreColor(item.score)}>
                          相似度: {formatScore(item.score)}
                        </Tag>
                      ]}
                    >
                      <List.Item.Meta
                        title={<span>来源: {item.source}</span>}
                      />
                      <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                        <Paragraph>{item.content}</Paragraph>
                      </Card>
                      <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                        Chunk ID: {item.chunkId}
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default VectorTest