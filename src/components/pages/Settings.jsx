import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import * as settingsService from '@/services/api/settingsService'
import { toast } from 'react-toastify'

const Settings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'sync', name: 'Sync Settings', icon: 'RefreshCw' },
    { id: 'integrations', name: 'Integrations', icon: 'Link' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'security', name: 'Security', icon: 'Shield' }
  ]
  
  useEffect(() => {
    loadSettings()
  }, [])
  
  const loadSettings = async () => {
    try {
      setLoading(true)
      setError('')
const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings. Please try again.')
      console.error('Settings loading error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const updateSettings = async (section, updates) => {
    try {
      setSaving(true)
const updatedSettings = await settingsService.updateSettings(section, updates)
      setSettings(updatedSettings)
      toast.success('Settings updated successfully')
    } catch (err) {
      toast.error('Failed to update settings')
      console.error('Settings update error:', err)
    } finally {
      setSaving(false)
    }
  }
  
  const testConnection = async (integration) => {
    try {
      await settingsService.testConnection(integration)
      toast.success(`${integration} connection successful`)
    } catch (err) {
      toast.error(`${integration} connection failed`)
      console.error('Connection test error:', err)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSettings} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure FlowMerch Pro for your store</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Settings</h2>
          </div>
          <nav className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Store Name"
                      value={settings?.general?.storeName || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, storeName: e.target.value }
                      }))}
                      placeholder="Your Store Name"
                    />
                    
                    <Input
                      label="Store URL"
                      value={settings?.general?.storeUrl || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, storeUrl: e.target.value }
                      }))}
                      placeholder="https://your-store.myshopify.com"
                    />
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                      <select
                        value={settings?.general?.currency || 'USD'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, currency: e.target.value }
                        }))}
                        className="form-field w-full"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Timezone</label>
                      <select
                        value={settings?.general?.timezone || 'UTC'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          general: { ...prev.general, timezone: e.target.value }
                        }))}
                        className="form-field w-full"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => updateSettings('general', settings.general)}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Sync Settings */}
            {activeTab === 'sync' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Sync Interval (minutes)"
                        type="number"
                        value={settings?.sync?.interval || 30}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sync: { ...prev.sync, interval: parseInt(e.target.value) }
                        }))}
                        placeholder="30"
                      />
                      
                      <Input
                        label="Batch Size"
                        type="number"
                        value={settings?.sync?.batchSize || 100}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sync: { ...prev.sync, batchSize: parseInt(e.target.value) }
                        }))}
                        placeholder="100"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="autoSync"
                          checked={settings?.sync?.autoSync || false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            sync: { ...prev.sync, autoSync: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="autoSync" className="text-sm text-gray-700">
                          Enable automatic synchronization
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="conflictResolution"
                          checked={settings?.sync?.autoResolveConflicts || false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            sync: { ...prev.sync, autoResolveConflicts: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="conflictResolution" className="text-sm text-gray-700">
                          Auto-resolve sync conflicts (use remote data)
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="syncImages"
                          checked={settings?.sync?.syncImages || true}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            sync: { ...prev.sync, syncImages: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="syncImages" className="text-sm text-gray-700">
                          Sync product images automatically
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => updateSettings('sync', settings.sync)}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
                  <div className="space-y-6">
                    
                    {/* Shopify Integration */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Store" className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Shopify</h4>
                            <p className="text-sm text-gray-600">Connected to your Shopify store</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="success">Connected</Badge>
                          <Button variant="secondary" size="sm" onClick={() => testConnection('Shopify')}>
                            Test
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Store URL"
                          value={settings?.integrations?.shopify?.storeUrl || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              shopify: { ...prev.integrations?.shopify, storeUrl: e.target.value }
                            }
                          }))}
                          placeholder="your-store.myshopify.com"
                        />
                        <Input
                          label="Access Token"
                          type="password"
                          value={settings?.integrations?.shopify?.accessToken || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              shopify: { ...prev.integrations?.shopify, accessToken: e.target.value }
                            }
                          }))}
                          placeholder="Enter access token"
                        />
                      </div>
                    </div>
                    
                    {/* Google Sheets Integration */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ApperIcon name="FileSpreadsheet" className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Google Sheets</h4>
                            <p className="text-sm text-gray-600">Import/export product data</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="warning">Not Connected</Badge>
                          <Button variant="secondary" size="sm">
                            Connect
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Connect Google Sheets to import product data in bulk and keep your inventory synchronized.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => updateSettings('integrations', settings.integrations)}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Sync Completion</h4>
                          <p className="text-sm text-gray-600">Get notified when sync operations complete</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings?.notifications?.syncComplete || true}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, syncComplete: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Sync Errors</h4>
                          <p className="text-sm text-gray-600">Get notified when sync errors occur</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings?.notifications?.syncErrors || true}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, syncErrors: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Low Inventory Alerts</h4>
                          <p className="text-sm text-gray-600">Get alerted when products are running low</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings?.notifications?.lowInventory || false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, lowInventory: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => updateSettings('notifications', settings.notifications)}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Data Encryption</h4>
                          <p className="text-sm text-gray-600">Encrypt sensitive data at rest</p>
                        </div>
                        <Badge variant="success">Enabled</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">API Rate Limiting</h4>
                          <p className="text-sm text-gray-600">Limit API requests to prevent abuse</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings?.security?.rateLimiting || true}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, rateLimiting: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Audit Logging</h4>
                          <p className="text-sm text-gray-600">Log all system activities</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings?.security?.auditLogging || true}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, auditLogging: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Security Notice</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            FlowMerch Pro uses industry-standard security practices including field-level encryption
                            for sensitive data like product costs and vendor information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => updateSettings('security', settings.security)}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings