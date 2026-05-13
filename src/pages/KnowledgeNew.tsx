import React, { useState } from 'react'
import { Form, Input, Button, Card, Select, Space, message, Row, Col, Radio, InputNumber, Tag, Upload } from 'antd'
import { SaveOutlined, LeftOutlined, UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { Option } = Select

const KnowledgeNew: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const onFinish = (values: any) => {
    console.log('Form values:', { ...values, tags, files: fileList })
    message.success('知识库创建成功！')
    navigate('/knowledge')
  }

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    setTags(newTags)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue])
    }
    setInputVisible(false)
    setInputValue('')
  }

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file])
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

      <Card title="新建知识库" style={{ maxWidth: 900 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            embeddingModel: 'text-embedding-3-small',
            chunkingStrategy: 'fixed',
            chunkSize: 512,
            chunkOverlap: 128,
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="知识库名称"
                name="name"
                rules={[{ required: true, message: '请输入知识库名称' }]}
              >
                <Input placeholder="例如：客户服务知识库" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="知识库描述"
            name="description"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <TextArea rows={3} placeholder="请描述这个知识库的用途和内容" />
          </Form.Item>

          <Form.Item label="标签">
            <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleTagClose(tag)}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  autoFocus
                />
              ) : (
                <Tag onClick={showInput} style={{ cursor: 'pointer' }}>
                  + 添加标签
                </Tag>
              )}
            </Space>
          </Form.Item>

          <Form.Item
            label="嵌入模型"
            name="embeddingModel"
            rules={[{ required: true, message: '请选择嵌入模型' }]}
          >
            <Select placeholder="选择嵌入模型">
              <Option value="text-embedding-3-small">text-embedding-3-small</Option>
              <Option value="text-embedding-3-large">text-embedding-3-large</Option>
              <Option value="text-embedding-ada-002">text-embedding-ada-002</Option>
              <Option value="m3e-base">m3e-base (中文)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="分块策略"
            name="chunkingStrategy"
            rules={[{ required: true, message: '请选择分块策略' }]}
          >
            <Radio.Group>
              <Radio.Button value="fixed">固定大小</Radio.Button>
              <Radio.Button value="semantic">语义分块</Radio.Button>
              <Radio.Button value="markdown">Markdown</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="分块大小 (tokens)"
                name="chunkSize"
                rules={[{ required: true, message: '请输入分块大小' }]}
              >
                <InputNumber style={{ width: '100%' }} min={128} max={4096} step={64} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="重叠大小 (tokens)"
                name="chunkOverlap"
                rules={[{ required: true, message: '请输入重叠大小' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={512} step={32} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="上传文档">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              支持 PDF、DOCX、TXT、MD、HTML 格式
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                创建知识库
              </Button>
              <Button onClick={() => navigate('/knowledge')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default KnowledgeNew
