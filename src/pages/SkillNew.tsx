import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Space,
  message,
  Steps,
  Typography,
  Alert,
  Divider,
  Row,
  Col,
  Tag,
  Tooltip
} from 'antd';
import { SaveOutlined, LeftOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text, Link } = Typography;

// SKILL.md 模板
const SKILL_TEMPLATE = `---
name: My Skill
skillId: my-skill
version: 1.0.0
description: 一个示例 Skill
category: 数据检索
scope: private
---

# My Skill

这是一个示例 Skill，你可以在这里编写你的 Skill 文档。

## 功能说明

- 功能点 1
- 功能点 2

## 使用示例

\`\`\`javascript
// 示例代码
const result = await skill.execute(params);
\`\`\`

## 输入参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| param1 | string | 是 | 参数1说明 |
| param2 | number | 否 | 参数2说明 |

## 输出结果

| 字段名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 执行是否成功 |
| data | object | 结果数据 |
`;

const categoryOptions = [
  { label: '数据检索', value: '数据检索' },
  { label: '开发工具', value: '开发工具' },
  { label: '文件处理', value: '文件处理' },
  { label: '数据库', value: '数据库' },
  { label: '可视化', value: '可视化' },
  { label: 'NLP', value: 'NLP' },
  { label: '图像识别', value: '图像识别' },
  { label: '音频处理', value: '音频处理' },
  { label: 'API调用', value: 'API调用' },
  { label: '逻辑推理', value: '逻辑推理' },
  { label: '其他', value: '其他' },
];

const SkillNew: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    { title: '基本信息', description: '填写 Skill 基本属性' },
    { title: '能力定义', description: '编写 SKILL.md 和配置' },
    { title: '预览确认', description: '确认并保存 Skill' },
  ];

  const handleNext = () => {
    form.validateFields()
      .then(() => setCurrentStep(currentStep + 1))
      .catch(errorInfo => console.log('表单验证失败:', errorInfo));
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values: any) => {
    console.log('创建 Skill:', values);
    message.success('Skill 创建成功！');
    navigate('/skills');
  };

  const loadTemplate = () => {
    form.setFieldValue('skillMd', SKILL_TEMPLATE);
    message.success('模板已加载');
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/skills')}>
          返回
        </Button>
      </div>

      <Card title="创建新 Skill">
        {/* 步骤条 */}
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            scope: 'private',
            category: '数据检索',
            skillMd: SKILL_TEMPLATE,
          }}
        >
          {/* 步骤1：基本信息 */}
          {currentStep === 0 && (
            <div>
              <Alert
                message="Skill 命名规范"
                description={
                  <div>
                    <ul>
                      <li>Skill ID: 使用小写字母、数字和连字符，如：<Text code>my-awesome-skill</Text></li>
                      <li>版本号: 遵循语义化版本规范，如：<Text code>1.0.0</Text></li>
                      <li>名称: 清晰描述 Skill 功能，不超过 50 字</li>
                    </ul>
                  </div>
                }
                type="info"
                icon={<InfoCircleOutlined />}
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Skill 名称"
                    name="name"
                    rules={[
                      { required: true, message: '请输入 Skill 名称' },
                      { max: 50, message: '名称不能超过 50 个字符' },
                    ]}
                  >
                    <Input placeholder="例如：企业知识库检索" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Skill ID"
                    name="skillId"
                    rules={[
                      { required: true, message: '请输入 Skill ID' },
                      { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和连字符' },
                      { max: 100, message: 'ID 不能超过 100 个字符' },
                    ]}
                  >
                    <Input placeholder="例如：enterprise-kb-retrieval" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="版本号"
                    name="version"
                    rules={[
                      { required: true, message: '请输入版本号' },
                      { pattern: /^\d+\.\d+\.\d+$/, message: '请使用语义化版本号，如：1.0.0' },
                    ]}
                  >
                    <Input placeholder="例如：1.0.0" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="分类"
                    name="category"
                    rules={[{ required: true, message: '请选择分类' }]}
                  >
                    <Select placeholder="请选择分类">
                      {categoryOptions.map(opt => (
                        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="功能描述"
                name="description"
                rules={[
                  { required: true, message: '请输入功能描述' },
                  { min: 10, message: '描述至少 10 个字符' },
                  { max: 500, message: '描述不能超过 500 个字符' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="请描述这个 Skill 的功能、用途和特点..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="公开范围"
                    name="scope"
                    rules={[{ required: true, message: '请选择公开范围' }]}
                  >
                    <Select>
                      <Option value="private">私有 - 仅自己可见使用</Option>
                      <Option value="public">公共 - 所有人可见使用</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Space>
                  <Button type="primary" onClick={handleNext}>下一步</Button>
                  <Button onClick={() => navigate('/skills')}>取消</Button>
                </Space>
              </Form.Item>
            </div>
          )}

          {/* 步骤2：能力定义 */}
          {currentStep === 1 && (
            <div>
              <Card
                type="inner"
                title={
                  <Space>
                    <span>SKILL.md 文档</span>
                    <Button size="small" onClick={loadTemplate}>加载模板</Button>
                    <Tooltip title="切换预览模式">
                      <Button
                        size="small"
                        type={previewMode ? 'primary' : 'default'}
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        {previewMode ? '编辑' : '预览'}
                      </Button>
                    </Tooltip>
                  </Space>
                }
                extra={
                  <Text type="secondary">使用 Markdown 格式</Text>
                }
              >
                {previewMode ? (
                  <div style={{ padding: 16, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, minHeight: 400 }}>
                    <ReactMarkdown>{form.getFieldValue('skillMd') || ''}</ReactMarkdown>
                  </div>
                ) : (
                  <Form.Item name="skillMd" noStyle rules={[{ required: true, message: '请编写 SKILL.md' }]}>
                    <TextArea
                      rows={16}
                      placeholder="# Skill 标题&#10;&#10;在这里编写你的 Skill 文档..."
                      style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: 13 }}
                    />
                  </Form.Item>
                )}
              </Card>

              <Divider />

              <Form.Item>
                <Space>
                  <Button onClick={handlePrev}>上一步</Button>
                  <Button type="primary" onClick={handleNext}>下一步</Button>
                </Space>
              </Form.Item>
            </div>
          )}

          {/* 步骤3：预览确认 */}
          {currentStep === 2 && (
            <div>
              <Card type="inner" title="Skill 信息预览" style={{ marginBottom: 16 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Paragraph>
                      <Text strong>Skill 名称：</Text>
                      <Text>{form.getFieldValue('name')}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Skill ID：</Text>
                      <Text code>{form.getFieldValue('skillId')}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>分类：</Text>
                      <Text>{form.getFieldValue('category')}</Text>
                    </Paragraph>
                  </Col>
                  <Col span={12}>
                    <Paragraph>
                      <Text strong>版本：</Text>
                      <Text code>{form.getFieldValue('version')}</Text>
                    </Paragraph>
                    <Paragraph>
                      <Text strong>范围：</Text>
                      <Tag color={form.getFieldValue('scope') === 'public' ? 'blue' : 'orange'}>
                        {form.getFieldValue('scope') === 'public' ? '公共' : '私有'}
                      </Tag>
                    </Paragraph>
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>功能描述</Title>
                <Paragraph>{form.getFieldValue('description')}</Paragraph>
              </Card>

              <Card type="inner" title="SKILL.md 预览">
                <div style={{ padding: 16, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <ReactMarkdown>{form.getFieldValue('skillMd') || ''}</ReactMarkdown>
                </div>
              </Card>

              <Divider />

              <Form.Item>
                <Space>
                  <Button onClick={handlePrev}>上一步</Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    创建 Skill
                  </Button>
                </Space>
              </Form.Item>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default SkillNew;
