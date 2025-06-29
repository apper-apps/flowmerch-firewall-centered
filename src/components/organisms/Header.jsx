import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const stores = ['Main Store', 'Outlet Store', 'Premium Collection']

function Header({ onToggleSidebar, title }) {
  const [currentStore, setCurrentStore] = useState(stores[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
const { user, isAuthenticated } = useSelector((state) => state.user)
  const authContext = useContext(AuthContext)
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
              value={currentStore}
              onChange={(e) => setCurrentStore(e.target.value)}
              className="form-field pr-8 appearance-none bg-white"
            >
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
            <ApperIcon name="ChevronDown" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
{/* Notifications */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" className="h-5 w-5" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" className="h-4 w-4" />
          </Button>
          
          {/* User Menu */}
          {isAuthenticated && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
                </div>
                <span className="hidden md:block">{user.firstName || 'User'}</span>
                <ApperIcon name="ChevronDown" className="h-4 w-4" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-gray-500">{user.emailAddress}</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      authContext.logout()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header