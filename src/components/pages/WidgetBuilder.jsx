import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import * as widgetService from '@/services/api/widgetService'
import { toast } from 'react-toastify'

const WidgetBuilder = () => {
  const [widgets, setWidgets] = useState([])
  const [selectedWidget, setSelectedWidget] = useState(null)
  const [widgetTypes] = useState([
    { 
      type: 'countdown', 
      name: 'Countdown Timer', 
      icon: 'Clock',
      description: 'Create urgency with countdown timers'
    },
    { 
      type: 'shipping', 
      name: 'Shipping Estimator', 
      icon: 'Truck',
      description: 'Show estimated delivery dates'
    },
    { 
      type: 'scarcity', 
      name: 'Scarcity Alert', 
      icon: 'AlertTriangle',
      description: 'Display low stock warnings'
    },
    { 
      type: 'form', 
      name: 'Lead Capture', 
      icon: 'Mail',
      description: 'Collect customer information'
    }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Widget configuration state
  const [widgetConfig, setWidgetConfig] = useState({
    type: 'countdown',
    settings: {},
    placement: 'product-page',
    active: true
  })
  
  useEffect(() => {
    loadWidgets()
  }, [])
  
  const loadWidgets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await widgetService.getAll()
      setWidgets(data)
    } catch (err) {
      setError('Failed to load widgets. Please try again.')
      console.error('Widget loading error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const createWidget = async () => {
    try {
      setSaving(true)
      const newWidget = await widgetService.create(widgetConfig)
      setWidgets(prev => [...prev, newWidget])
      toast.success('Widget created successfully')
      resetForm()
    } catch (err) {
      toast.error('Failed to create widget')
      console.error('Widget creation error:', err)
    } finally {
      setSaving(false)
    }
  }
  
  const updateWidget = async (widgetId, updates) => {
    try {
      const updatedWidget = await widgetService.update(widgetId, updates)
      setWidgets(prev => prev.map(w => w.Id === widgetId ? updatedWidget : w))
      toast.success('Widget updated successfully')
    } catch (err) {
      toast.error('Failed to update widget')
      console.error('Widget update error:', err)
    }
  }
  
  const deleteWidget = async (widgetId) => {
    try {
      await widgetService.delete(widgetId)
      setWidgets(prev => prev.filter(w => w.Id !== widgetId))
      toast.success('Widget deleted successfully')
    } catch (err) {
      toast.error('Failed to delete widget')
      console.error('Widget deletion error:', err)
    }
  }
  
  const resetForm = () => {
    setWidgetConfig({
      type: 'countdown',
      settings: {},
      placement: 'product-page',
      active: true
    })
    setSelectedWidget(null)
  }
  
  const getWidgetPreview = () => {
    switch (widgetConfig.type) {
      case 'countdown':
        return (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-error mb-2">Limited Time Offer!</p>
            <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-error">
              <span>02</span><span>:</span><span>45</span><span>:</span><span>30</span>
            </div>
            <p className="text-xs text-error/80 mt-2">Hours : Minutes : Seconds</p>
          </div>
        )
      case 'shipping':
        return (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Truck" className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-success">Free shipping!</span>
            </div>
            <p className="text-xs text-success/80 mt-1">Estimated delivery: Dec 15-18</p>
          </div>
        )
      case 'scarcity':
        return (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium text-warning">Only 3 left in stock!</span>
            </div>
            <p className="text-xs text-warning/80 mt-1">Order soon to avoid disappointment</p>
          </div>
        )
      case 'form':
        return (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="font-medium text-primary mb-2">Get 10% Off!</h3>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-3 py-2 text-sm border border-primary/30 rounded"
                disabled
              />
              <button className="w-full bg-primary text-white px-3 py-2 text-sm rounded">
                Subscribe
              </button>
            </div>
          </div>
        )
      default:
        return <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">Preview</div>
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadWidgets} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Widget Builder</h1>
        <p className="text-gray-600">Create dynamic widgets to enhance your product pages</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget Configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Widget Type Selection */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgetTypes.map((type) => (
                <motion.div
                  key={type.type}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    widgetConfig.type === type.type
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setWidgetConfig(prev => ({ ...prev, type: type.type }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      widgetConfig.type === type.type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <ApperIcon name={type.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Widget Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Widget Name"
                value={widgetConfig.name || ''}
                onChange={(e) => setWidgetConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter widget name"
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Placement</label>
                <select
                  value={widgetConfig.placement}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, placement: e.target.value }))}
                  className="form-field w-full"
                >
                  <option value="product-page">Product Page</option>
                  <option value="cart-page">Cart Page</option>
                  <option value="checkout">Checkout</option>
                  <option value="collection">Collection Page</option>
                </select>
              </div>
              
              {widgetConfig.type === 'countdown' && (
                <>
                  <Input
                    label="End Date"
                    type="datetime-local"
                    value={widgetConfig.settings?.endDate || ''}
                    onChange={(e) => setWidgetConfig(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, endDate: e.target.value }
                    }))}
                  />
                  <Input
                    label="Display Text"
                    value={widgetConfig.settings?.displayText || ''}
                    onChange={(e) => setWidgetConfig(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, displayText: e.target.value }
                    }))}
                    placeholder="Limited Time Offer!"
                  />
                </>
              )}
              
              {widgetConfig.type === 'scarcity' && (
                <>
                  <Input
                    label="Stock Threshold"
                    type="number"
                    value={widgetConfig.settings?.threshold || ''}
                    onChange={(e) => setWidgetConfig(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, threshold: parseInt(e.target.value) }
                    }))}
                    placeholder="10"
                  />
                  <Input
                    label="Alert Message"
                    value={widgetConfig.settings?.message || ''}
                    onChange={(e) => setWidgetConfig(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, message: e.target.value }
                    }))}
                    placeholder="Only {stock} left in stock!"
                  />
                </>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={widgetConfig.active}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, active: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Widget Active
                </label>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
                <Button onClick={createWidget} loading={saving}>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Widget
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview & Existing Widgets */}
        <div className="space-y-6">
          
          {/* Preview */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            {getWidgetPreview()}
          </div>
          
          {/* Existing Widgets */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Widgets</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {widgets.map((widget) => (
                <div key={widget.Id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{widget.name || widget.type}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={widget.active ? 'success' : 'default'}>
                        {widget.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWidget(widget.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{widget.placement}</p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateWidget(widget.Id, { active: !widget.active })}
                    >
                      {widget.active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
              
              {widgets.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <ApperIcon name="Zap" className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No widgets created yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WidgetBuilder