import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AgentList from './pages/AgentList'
import AgentNew from './pages/AgentNew'
import AgentDetail from './pages/AgentDetail'
import AgentRuns from './pages/AgentRuns'
import TraceDetail from './pages/TraceDetail'
import AgentChatDebug from './pages/AgentChatDebug'
import SkillList from './pages/SkillList'
import SkillNew from './pages/SkillNew'
import SkillUpload from './pages/SkillUpload'
import SkillDetail from './pages/SkillDetail'
import KnowledgeList from './pages/KnowledgeList'
import KnowledgeNew from './pages/KnowledgeNew'
import KnowledgeDetail from './pages/KnowledgeDetail'
import VectorTest from './pages/VectorTest'
import Settings from './pages/Settings'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents" element={<AgentList />} />
            <Route path="/agents/new" element={<AgentNew />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/agents/:agentId/runs" element={<AgentRuns />} />
            <Route path="/agents/:agentId/traces/:traceId" element={<TraceDetail />} />
            <Route path="/agents/:agentId/chat" element={<AgentChatDebug />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/new" element={<SkillNew />} />
            <Route path="/skills/upload" element={<SkillUpload />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            <Route path="/knowledge" element={<KnowledgeList />} />
            <Route path="/knowledge/new" element={<KnowledgeNew />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
            <Route path="/knowledge/:id/test" element={<VectorTest />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App