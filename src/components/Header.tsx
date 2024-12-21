import { Link, useLocation } from "react-router-dom"
import { Home, LogIn, FileText } from "lucide-react"

export const Header = () => {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10 px-4 py-3 mb-8">
      <div className="container mx-auto flex items-center justify-center space-x-8">
        <Link 
          to="/" 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive('/') 
              ? 'bg-primary text-white' 
              : 'hover:bg-primary/10'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>主页</span>
        </Link>
        
        <Link 
          to="/login" 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive('/login') 
              ? 'bg-primary text-white' 
              : 'hover:bg-primary/10'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>登录</span>
        </Link>
        
        <Link 
          to="/editor" 
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isActive('/editor') 
              ? 'bg-primary text-white' 
              : 'hover:bg-primary/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>评估结果</span>
        </Link>
      </div>
    </nav>
  )
}