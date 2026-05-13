import React, { useState } from 'react'
import { Form, Input, Button, Card, Select, Space, message, Tag, Row, Col, Radio, Typography, Spin, Steps, Divider } from 'antd'
import { SaveOutlined, LeftOutlined, RobotOutlined, CodeOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockSkills, mockKnowledgeBases } from '../mockData'

const { TextArea } = Input
const { Option } = Select
const { Text, Paragraph } = Typography
const { Step } = Steps

type CreateMode = 'ai' | 'dev'

const AgentNew: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [aiForm] = Form.useForm()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([])
  const [mode, setMode] = useState<CreateMode>('ai')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedConfig, setGeneratedConfig] = useState<any>(null)

  const generateAgentId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (name) {
      const autoId = generateAgentId(name)
      form.setFieldValue('agentId', autoId)
    }
  }

  const handleAIGenerate = () => {
    aiForm.validateFields().then((values) => {
      setIsGenerating(true)
      
      setTimeout(() => {
        const name = values.description.split(' ').slice(0, 3).join('-')
        const config = {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description: values.description,
          systemPrompt: `你是一个${values.description}助手，请专业、礼貌地回答用户问题。`,
          recommendedSkills: ['skill-001', 'skill-003'],
          recommendedKnowledgeBases: ['kb-001'],
        }
        setGeneratedConfig(config)
        setIsGenerating(false)
        setCurrentStep(1)
        
        form.setFieldsValue({
          name: config.name,
          agentId: generateAgentId(config.name),
          description: config.description,
          systemPrompt: config.systemPrompt,
        })
        setSelectedSkills(config.recommendedSkills)
        setSelectedKnowledgeBases(config.recommendedKnowledgeBases)
      }, 2000)
    })
  }

  const applyAIGeneratedConfig = () => {
    setCurrentStep(2)
    setMode('dev')
  }

  const onFinish = (values: any) => {
    console.log('Form values:', { ...values, skills: selectedSkills, knowledgeBases: selectedKnowledgeBases })
    message.success('Agent 创建成功！')
    navigate('/agents/agent-1')
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/agents')}>
          返回
        </Button>
      </div>

      <Card title="新建 Agent">
        <Radio.Group 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          style={{ marginBottom: 24, width: '100%' }}
        >
          <Radio.Button value="ai" style={{ width: '50%', textAlign: 'center' }}>
            <RobotOutlined /> AI 模式 - 自然语言创建
          </Radio.Button>
          <Radio.Button value="dev" style={{ width: '50%', textAlign: 'center' }}>
            <CodeOutlined /> Dev 模式 - 高级配置
          </Radio.Button>
        </Radio.Group>

        {mode === 'ai' && (
          <div>
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
              <Step title="描述需求" description="用自然语言描述你的 Agent" />
              <Step title="AI 生成" description="AI 自动生成配置" />
              <Step title="确认创建" description="确认并创建 Agent" />
            </Steps>

            {currentStep === 0 && (
              <Card size="small">
                <Form form={aiForm} layout="vertical">
                  <Form.Item
                    label="描述你的 Agent"
                    name="description"
                    rules={[{ required: true, message: '请描述你的 Agent' }]}
                    extra="例如：我想要一个帮我看日报的 Agent"
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="请用自然语言描述你想要的 Agent 是做什么的，例如：
我想要一个帮我看日报的 Agent，它能够从日报文档中提取关键信息，总结当天的工作进展，识别风险点，并提供建议。"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    onClick={handleAIGenerate}
                    loading={isGenerating}
                  >
                    让 AI 帮我生成
                  </Button>
                </Form>
              </Card>
            )}

            {currentStep === 1 && generatedConfig && (
              <Card size="small" title="AI 已为您生成以下配置">
                <Spin spinning={isGenerating}>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Agent 名称：</Text>
                    <Paragraph>{generatedConfig.name}</Paragraph>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>功能描述：</Text>
                    <Paragraph>{generatedConfig.description}</Paragraph>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>System Prompt：</Text>
                    <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                      <Paragraph>{generatedConfig.systemPrompt}</Paragraph>
                    </Card>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>推荐 Skills：</Text>
                    <div style={{ marginTop: 8 }}>
                      {generatedConfig.recommendedSkills.map((skillId: string) => {
                        const skill = mockSkills.find(s => s.id === skillId)
                        return skill ? <Tag key={skillId} color="blue">{skill.name}</Tag> : null
                      })}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>推荐知识库：</Text>
                    <div style={{ marginTop: 8 }}>
                      {generatedConfig.recommendedKnowledgeBases.map((kbId: string) => {
                        const kb = mockKnowledgeBases.find(k => k.id === kbId)
                        return kb ? <Tag key={kbId} color="green">{kb.name}</Tag> : null
                      })}
                    </div>
                  </div>
                  <Space>
                    <Button type="primary" onClick={applyAIGeneratedConfig}>
                      应用此配置并继续
                    </Button>
                    <Button onClick={() => setCurrentStep(0)}>
                      重新描述
                    </Button>
                  </Space>
                </Spin>
              </Card>
            )}

            {currentStep === 2 && (
              <div>
                <Text type="success">配置已应用，请在 Dev 模式中继续完善配置</Text>
                <Divider />
                <Button type="primary" onClick={() => setMode('dev')}>
                  进入高级配置
                </Button>
              </div>
            )}
          </div>
        )}

        {mode === 'dev' && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              version: 'v1.0.0',
              systemPrompt: '你是一个有用的 AI 助手',
              description: '',
              ...(generatedConfig ? {
                name: generatedConfig.name,
                description: generatedConfig.description,
                systemPrompt: generatedConfig.systemPrompt,
              } : {})
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Agent 名称"
                  name="name"
                  rules={[{ required: true, message: '请输入 Agent 名称' }]}
                >
                  <Input
                    placeholder="请输入 Agent 名称"
                    onChange={handleNameChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="唯一标识 ID"
                  name="agentId"
                >
                  <Input placeholder="例如：customer-service-agent" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="版本号"
                  name="version"
                  rules={[{ required: true, message: '请输入版本号' }]}
                >
                  <Input placeholder="例如：v1.0.0" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="功能描述"
              name="description"
              tooltip="选填，可在详情页补充"
            >
              <TextArea rows={3} placeholder="（可选）请描述这个 Agent 的功能" />
            </Form.Item>

            <Form.Item
              label="System Prompt 配置"
              name="systemPrompt"
              tooltip="选填，已给默认值，可在详情页修改"
            >
              <TextArea rows={6} placeholder="请输入 System Prompt" />
            </Form.Item>

            <Form.Item label="绑定知识库">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {selectedKnowledgeBases.map(kbId => {
                    const kb = mockKnowledgeBases.find(k => k.id === kbId)
                    return kb ? (
                      <Tag
                        key={kbId}
                        closable
                        onClose={() => setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== kbId))}
                        color="green"
                      >
                        {kb.name}
                      </Tag>
                    ) : null
                  })}
                </div>
                <Select
                  mode="multiple"
                  placeholder="（可选）选择要绑定的知识库"
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false)
                  }
                  onChange={setSelectedKnowledgeBases}
                  value={selectedKnowledgeBases}
                >
                  {mockKnowledgeBases.map(kb => (
                    <Option key={kb.id} value={kb.id}>
                      <div>
                        <div>{kb.name}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{kb.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Space>
            </Form.Item>

            <Form.Item label="绑定 Skill" tooltip="选填，可在详情页添加">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {selectedSkills.map(skillId => {
                    const skill = mockSkills.find(s => s.id === skillId)
                    return skill ? (
                      <Tag
                        key={skillId}
                        closable
                        onClose={() => setSelectedSkills(selectedSkills.filter(id => id !== skillId))}
                        color="blue"
                      >
                        {skill.name}
                      </Tag>
                    ) : null
                  })}
                </div>
                <Select
                  mode="multiple"
                  placeholder="（可选）搜索并选择要绑定的 Skill"
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false)
                  }
                  onChange={setSelectedSkills}
                  value={selectedSkills}
                >
                  {mockSkills.map(skill => (
                    <Option key={skill.id} value={skill.id}>
                      <div>
                        <div>{skill.name}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{skill.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Space>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  提交创建
                </Button>
                <Button onClick={() => navigate('/agents')}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  )
}

export default AgentNew
