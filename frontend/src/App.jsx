import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

// 页面导入
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscriptions'
import Settings from './pages/Settings'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// 组件导入
import Sidebar from './components/Sidebar'
import { useUserStore } from './store/userStore'

function App() {
  const { user, loading, checkAuth } = useUserStore()
  const [deployPlatform, setDeployPlatform] = useState('')
  
  useEffect(() => {
    checkAuth()
    
    // 检测部署平台
    const hostname = window.location.hostname
    if (hostname.includes('vercel.app')) {
      setDeployPlatform('Vercel')
    } else if (hostname.includes('pages.dev')) {
      setDeployPlatform('Cloudflare Pages')
    } else if (hostname.includes('web.app') || hostname.includes('firebaseapp.com')) {
      setDeployPlatform('Firebase')
    }
  }, [checkAuth])

  // 身份验证保护的路由
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">加载中...</div>
    return user ? children : <Navigate to="/login" replace />
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {user && <Sidebar />}
        <div className="flex-1 overflow-auto">
          {deployPlatform && (
            <div className="bg-blue-500 text-white text-center py-1 text-sm">
              当前部署平台: {deployPlatform}
            </div>
          )}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App 