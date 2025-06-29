import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const [selectedStore, setSelectedStore] = useState('Main Store')
  
  const stores = [
    'Main Store',
    'Outlet Store',
    'Premium Collection'
  ]
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="mr-4 lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Manage your product catalog and sync operations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Store Selector */}
          <div className="relative">
            <select 
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="form-field pr-8 appearance-none bg-white"
            >
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
            <ApperIcon name="ChevronDown" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Sync Status */}
          <div className="flex items-center space-x-2">
            <div className="status-dot bg-success animate-pulse" />
            <span className="text-sm text-gray-600">Sync Active</span>
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header