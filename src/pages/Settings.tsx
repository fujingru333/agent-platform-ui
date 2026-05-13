import React from 'react'
import { Card, Form, Input, Button, Select, Switch, Space, Divider, message, Row, Col } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Option } = Select

const Settings: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Settings saved:', values)
    message.success('设置保存成功！')
  }

  return (
    <div>
      <Card title="系统设置" style={{ maxWidth: 800 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            langfuseEnabled: true,
            autoEvaluation: true,
            notificationEnabled: true
          }}
        >
          <Divider orientation="left">Langfuse 配置</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Langfuse API 地址" name="langfuseUrl">
                <Input placeholder="https://cloud.langfuse.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目 ID" name="langfuseProjectId">
                <Input placeholder="请输入项目 ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="公钥" name="langfusePublicKey">
                <Input.Password placeholder="请输入公钥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="私钥" name="langfuseSecretKey">
                <Input.Password placeholder="请输入私钥" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="启用 Langfuse 追踪" name="langfuseEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider orientation="left">评估配置</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="评估周期" name="evaluationPeriod">
                <Select>
                  <Option value="hourly">每小时</Option>
                  <Option value="daily">每日</Option>
                  <Option value="weekly">每周</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="质量告警阈值" name="alertThreshold">
                <Input placeholder="例如：80" suffix="分" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="自动评估" name="autoEvaluation" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider orientation="left">通知配置</Divider>

          <Form.Item label="启用通知" name="notificationEnabled" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="通知邮箱" name="notificationEmail">
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Settings
