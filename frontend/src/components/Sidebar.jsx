import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* 侧边栏 */}
      <div className={`sidebar ${mobileMenuOpen ? 'sidebar-mobile-visible' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">SubScribe</h1>
            <p className="text-sm text-gray-500">订阅管理系统</p>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  仪表盘
                </Link>
              </li>
              <li>
                <Link 
                  to="/subscriptions" 
                  className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/subscriptions') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  订阅管理
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`flex items-center p-3 rounded-md hover:bg-gray-100 ${isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  设置
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* 底部 */}
          <div className="p-4 border-t">
            <button className="flex items-center w-full p-3 rounded-md hover:bg-gray-100 text-gray-700">
              <LogOut className="w-5 h-5 mr-3" />
              退出登录
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端遮罩层 */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
} 