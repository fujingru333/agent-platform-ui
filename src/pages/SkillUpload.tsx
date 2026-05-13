import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  message,
  Upload,
  Row,
  Col,
  Typography,
  Alert,
  Divider,
  Table,
  Tag,
  Progress
} from 'antd';
import { SaveOutlined, LeftOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import JSZip from 'jszip';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  size?: number;
  children?: FileNode[];
}

interface SkillPackage {
  name?: string;
  skillId?: string;
  description?: string;
  version?: string;
  scope?: string;
  files: FileNode[];
  skillMd?: string;
}

const SkillUpload: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [skillPackage, setSkillPackage] = useState<SkillPackage | null>(null);
  const [parseStatus, setParseStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');

  // 解析 SKILL.md 中的 frontmatter
  const parseSkillMd = (content: string) => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return {};

    const frontmatter = frontmatterMatch[1];
    const result: any = {};

    frontmatter.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        result[match[1]] = match[2];
      }
    });

    return result;
  };

  // 处理上传
  const handleUpload = async (file: File) => {
    setUploading(true);
    setParseStatus('parsing');
    setParseProgress(0);

    try {
      const zip = await JSZip.loadAsync(file);
      const files = Object.values(zip.files);
      
      setParseProgress(30);

      // 查找 SKILL.md
      const skillMdFile = files.find(f => /SKILL\.md$/i.test(f.name));
      
      let skillMdContent = '';
      if (skillMdFile) {
        skillMdContent = await skillMdFile.async('text');
      }
      
      setParseProgress(60);
      
      const frontmatter = parseSkillMd(skillMdContent);
      
      // 读取所有文件内容
      const allFiles: FileNode[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.dir) continue;
        
        const content = await f.async('text');
        const fileWithData = f as unknown as { _data?: { uncompressedSize?: number } };
        allFiles.push({
          name: f.name,
          path: f.name,
          type: 'file',
          content: content,
          size: fileWithData._data?.uncompressedSize || 0
        });
        
        if (i % 5 === 0) {
          setParseProgress(Math.min(60 + (i / files.length) * 30, 90));
        }
      }
      
      setParseProgress(100);
      
      const newPackage: SkillPackage = {
        name: frontmatter.name || file.name.replace(/\.zip$/i, ''),
        skillId: frontmatter.skillId || '',
        description: frontmatter.description || '',
        version: frontmatter.version || '1.0.0',
        scope: frontmatter.scope || 'private',
        skillMd: skillMdContent,
        files: allFiles
      };
      
      setSkillPackage(newPackage);
      
      form.setFieldsValue({
        name: newPackage.name,
        skillId: newPackage.skillId,
        description: newPackage.description,
        version: newPackage.version,
        scope: newPackage.scope
      });
      
      setParseStatus('success');
      message.success('Skill 包解析成功');
      
    } catch (error) {
      console.error('解析失败:', error);
      setParseStatus('error');
      message.error('Skill 包解析失败');
    } finally {
      setUploading(false);
    }
    
    return false;
  };

  const handleFinish = (values: any) => {
    console.log('上传 Skill:', values);
    message.success('Skill 上传成功！');
    navigate('/skills');
  };

  const fileColumns = [
    {
      title: '文件路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => size ? `${(size / 1024).toFixed(1)} KB` : '-',
    },
    {
      title: '类型',
      dataIndex: 'name',
      key: 'type',
      render: (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (['js', 'ts', 'jsx', 'tsx', 'py'].includes(ext || '')) return <Tag color="blue">代码</Tag>;
        if (['md', 'txt'].includes(ext || '')) return <Tag color="green">文档</Tag>;
        if (['json', 'yaml', 'yml'].includes(ext || '')) return <Tag color="orange">配置</Tag>;
        return <Tag>文件</Tag>;
      }
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<LeftOutlined />} onClick={() => navigate('/skills')}>
          返回
        </Button>
      </div>

      <Row gutter={24}>
        <Col span={10}>
          <Card title="上传 Skill 包">
            <Alert
              message="Skill 包规范"
              description={
                <div>
                  <ul>
                    <li>必须包含 <Text code>SKILL.md</Text> 文件，使用 YAML frontmatter</li>
                    <li>推荐使用 zip 格式压缩</li>
                    <li>支持任意目录结构，推荐：<br />
                      <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4, fontFamily: 'monospace', fontSize: 12 }}>
                        <div>my-skill/</div>
                        <div>├─ SKILL.md</div>
                        <div>├─ src/</div>
                        <div>│  └─ main.js</div>
                        <div>└─ assets/</div>
                      </div>
                    </li>
                  </ul>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Dragger
              name="file"
              accept=".zip"
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={uploading}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽 zip 文件到这里上传</p>
              <p className="ant-upload-hint">支持单个 zip 格式文件，大小不超过 10MB</p>
            </Dragger>

            {uploading && (
              <div style={{ marginTop: 24 }}>
              <Progress percent={parseProgress} status="active" />
              <p style={{ textAlign: 'center', marginTop: 8, color: '#666' }}>
                {parseStatus === 'parsing' && '正在解析 Skill 包...' }
              </p>
            </div>
            )}

            {parseStatus === 'error' && (
              <Alert
                message="解析失败"
                description="请检查 zip 文件格式是否正确，是否包含 SKILL.md 文件"
                type="error"
                style={{ marginTop: 24 }}
              />
            )}
          </Card>
        </Col>
        
        <Col span={14}>
          <Card title="预览和确认">
            {!skillPackage ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <InboxOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <p style={{ color: '#999' }}>请上传 Skill 包查看预览</p>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Skill 名称"
                      name="name"
                      rules={[{ required: true, message: '请输入 Skill 名称' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Skill ID"
                      name="skillId"
                      rules={[{ required: true, message: '请输入 Skill ID' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="版本"
                      name="version"
                      rules={[{ required: true, message: '请输入版本号' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="范围"
                      name="scope"
                      rules={[{ required: true, message: '请选择范围' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="描述"
                  name="description"
                  rules={[{ required: true, message: '请输入描述' }]}
                >
                  <TextArea rows={2} />
                </Form.Item>

                <Divider />

                <Title level={5}>文件列表</Title>
                <Table
                  dataSource={skillPackage.files}
                  columns={fileColumns}
                  rowKey="path"
                  size="small"
                  pagination={false}
                  style={{ marginBottom: 16 }}
                />

                {skillPackage.skillMd && (
                  <>
                    <Divider />
                    <Title level={5}>SKILL.md 预览</Title>
                    <div style={{
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      padding: 16,
                      maxHeight: 300,
                      overflow: 'auto',
                      background: '#fafafa'
                    }}>
                      <ReactMarkdown>{skillPackage.skillMd}</ReactMarkdown>
                    </div>
                  </>
                )}

                <Divider />

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                      提交上传
                    </Button>
                    <Button onClick={() => {
                      setSkillPackage(null);
                      setParseStatus('idle');
                      form.resetFields();
                    }}>
                      重新上传
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SkillUpload;
