import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', path: '/', icon: 'BarChart3' },
    { name: 'Products', path: '/products', icon: 'Package' },
    { name: 'Sync Manager', path: '/sync', icon: 'RefreshCw' },
    { name: 'Descriptions', path: '/descriptions', icon: 'FileText' },
    { name: 'Widgets', path: '/widgets', icon: 'Zap' },
{ name: 'Bundles', path: '/bundles', icon: 'Layers' },
    { name: 'Collections', path: '/collections', icon: 'FolderOpen' },
    { name: 'Templates', path: '/templates', icon: 'FileEdit' },
    { name: 'Settings', path: '/settings', icon: 'Settings' }
  ]
  
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">FlowMerch</h1>
              <p className="text-xs text-gray-500">Pro</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </NavLink>
          )
        })}
      </nav>
      
      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Store Manager</p>
              <p className="text-xs text-gray-500">High Volume Store</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar