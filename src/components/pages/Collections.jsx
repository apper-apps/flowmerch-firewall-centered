import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import * as collectionService from '@/services/api/collectionService'
import { toast } from 'react-toastify'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  
  // Collection creation state
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    template: '',
    rules: [],
    auto_update: true,
    active: true
  })
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [collectionsData, templatesData] = await Promise.all([
        collectionService.getAll(),
        collectionService.getTemplates()
      ])
      setCollections(collectionsData)
      setTemplates(templatesData)
    } catch (err) {
      setError('Failed to load collections data. Please try again.')
      console.error('Collections loading error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const createCollection = async () => {
    try {
      if (!newCollection.name) {
        toast.error('Please enter collection name')
        return
      }
      
      const createdCollection = await collectionService.create(newCollection)
      setCollections(prev => [...prev, createdCollection])
      toast.success('Collection created successfully')
      resetForm()
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create collection')
      console.error('Collection creation error:', err)
    }
  }
  
  const updateCollection = async (collectionId, updates) => {
    try {
      const updatedCollection = await collectionService.update(collectionId, updates)
      setCollections(prev => prev.map(c => c.Id === collectionId ? updatedCollection : c))
      toast.success('Collection updated successfully')
    } catch (err) {
      toast.error('Failed to update collection')
      console.error('Collection update error:', err)
    }
  }
  
  const deleteCollection = async (collectionId) => {
    try {
      await collectionService.delete(collectionId)
      setCollections(prev => prev.filter(c => c.Id !== collectionId))
      toast.success('Collection deleted successfully')
    } catch (err) {
      toast.error('Failed to delete collection')
      console.error('Collection deletion error:', err)
    }
  }
  
  const addRule = () => {
    setNewCollection(prev => ({
      ...prev,
      rules: [...prev.rules, { type: 'tag', operator: 'contains', value: '' }]
    }))
  }
  
  const updateRule = (index, field, value) => {
    setNewCollection(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }))
  }
  
  const removeRule = (index) => {
    setNewCollection(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }
  
  const resetForm = () => {
    setNewCollection({
      name: '',
      description: '',
      template: '',
      rules: [],
      auto_update: true,
      active: true
    })
  }
  
  const ruleTypes = [
    { value: 'tag', label: 'Product Tag' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'price', label: 'Price' },
    { value: 'inventory', label: 'Inventory Level' },
    { value: 'type', label: 'Product Type' }
  ]
  
  const operators = {
    tag: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'not_contains', label: 'Does Not Contain' }
    ],
    vendor: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' }
    ],
    price: [
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
      { value: 'between', label: 'Between' }
    ],
    inventory: [
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
      { value: 'equals', label: 'Equals' }
    ],
    type: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' }
    ]
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600">Create and manage dynamic product collections</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>
      
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full">
            <Empty 
              message="No collections created yet" 
              description="Create dynamic collections to organize your products automatically"
              action={
                <Button onClick={() => setShowCreateModal(true)}>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              }
            />
          </div>
        ) : (
          collections.map((collection, index) => (
            <motion.div
              key={collection.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={collection.active ? 'success' : 'default'}>
                    {collection.active ? 'Active' : 'Inactive'}
                  </Badge>
                  {collection.auto_update && (
                    <Badge variant="info" size="sm">Auto</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{collection.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{collection.product_count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rules:</span>
                  <span className="font-medium">{collection.rules?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {collection.last_updated ? new Date(collection.last_updated).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateCollection(collection.Id, { active: !collection.active })}
                  className="flex-1"
                >
                  {collection.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Edit" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCollection(collection.Id)}
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Collection</h2>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Collection Name"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter collection name"
                      required
                    />
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={newCollection.description}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                        className="form-field w-full"
                        rows={3}
                        placeholder="Enter collection description"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Template (Optional)</label>
                      <select
                        value={newCollection.template}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, template: e.target.value }))}
                        className="form-field w-full"
                      >
                        <option value="">Select a template</option>
                        {templates.map(template => (
                          <option key={template.Id} value={template.Id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Collection Rules */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Collection Rules</h3>
                    <Button variant="secondary" size="sm" onClick={addRule}>
                      <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {newCollection.rules.map((rule, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Field</label>
                            <select
                              value={rule.type}
                              onChange={(e) => updateRule(index, 'type', e.target.value)}
                              className="form-field w-full"
                            >
                              {ruleTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Condition</label>
                            <select
                              value={rule.operator}
                              onChange={(e) => updateRule(index, 'operator', e.target.value)}
                              className="form-field w-full"
                            >
                              {operators[rule.type]?.map(op => (
                                <option key={op.value} value={op.value}>
                                  {op.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Value</label>
                            <input
                              type={rule.type === 'price' || rule.type === 'inventory' ? 'number' : 'text'}
                              value={rule.value}
                              onChange={(e) => updateRule(index, 'value', e.target.value)}
                              className="form-field w-full"
                              placeholder="Enter value"
                            />
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRule(index)}
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {newCollection.rules.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No rules added yet. Add rules to automatically populate this collection.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto_update"
                        checked={newCollection.auto_update}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, auto_update: e.target.checked }))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="auto_update" className="text-sm text-gray-700">
                        Auto-update collection when products change
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newCollection.active}
                        onChange={(e) => setNewCollection(prev => ({ ...prev, active: e.target.checked }))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="active" className="text-sm text-gray-700">
                        Collection is active
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={createCollection}>
                Create Collection
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Collections