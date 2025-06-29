import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import * as bundleService from '@/services/api/bundleService'
import * as productService from '@/services/api/productService'
import { toast } from 'react-toastify'

const BundleManager = () => {
  const [bundles, setBundles] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Bundle creation state
  const [newBundle, setNewBundle] = useState({
    name: '',
    products: [],
    pricing_rule: { type: 'discount', value: 10 },
    active: true
  })
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [bundlesData, productsData] = await Promise.all([
        bundleService.getAll(),
        productService.getAll()
      ])
      setBundles(bundlesData)
      setProducts(productsData)
      setFilteredProducts(productsData)
    } catch (err) {
      setError('Failed to load bundle data. Please try again.')
      console.error('Bundle loading error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const createBundle = async () => {
    try {
      if (!newBundle.name || newBundle.products.length === 0) {
        toast.error('Please enter bundle name and select products')
        return
      }
      
      const createdBundle = await bundleService.create(newBundle)
      setBundles(prev => [...prev, createdBundle])
      toast.success('Bundle created successfully')
      resetBundleForm()
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create bundle')
      console.error('Bundle creation error:', err)
    }
  }
  
  const toggleBundleStatus = async (bundleId, active) => {
    try {
      const updatedBundle = await bundleService.update(bundleId, { active })
      setBundles(prev => prev.map(b => b.Id === bundleId ? updatedBundle : b))
      toast.success(`Bundle ${active ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to update bundle')
      console.error('Bundle update error:', err)
    }
  }
  
  const deleteBundle = async (bundleId) => {
    try {
      await bundleService.delete(bundleId)
      setBundles(prev => prev.filter(b => b.Id !== bundleId))
      toast.success('Bundle deleted successfully')
    } catch (err) {
      toast.error('Failed to delete bundle')
      console.error('Bundle deletion error:', err)
    }
  }
  
  const addProductToBundle = (product) => {
    if (!newBundle.products.find(p => p.Id === product.Id)) {
      setNewBundle(prev => ({
        ...prev,
        products: [...prev.products, { ...product, quantity: 1 }]
      }))
    }
  }
  
  const removeProductFromBundle = (productId) => {
    setNewBundle(prev => ({
      ...prev,
      products: prev.products.filter(p => p.Id !== productId)
    }))
  }
  
  const updateProductQuantity = (productId, quantity) => {
    setNewBundle(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.Id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    }))
  }
  
  const calculateBundlePrice = () => {
    const totalPrice = newBundle.products.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    )
    
    if (newBundle.pricing_rule.type === 'discount') {
      return totalPrice * (1 - newBundle.pricing_rule.value / 100)
    } else if (newBundle.pricing_rule.type === 'fixed') {
      return Math.max(0, totalPrice - newBundle.pricing_rule.value)
    }
    
    return totalPrice
  }
  
  const resetBundleForm = () => {
    setNewBundle({
      name: '',
      products: [],
      pricing_rule: { type: 'discount', value: 10 },
      active: true
    })
    setSearchTerm('')
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bundle Manager</h1>
          <p className="text-gray-600">Create and manage product bundles to increase average order value</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Bundle
        </Button>
      </div>
      
      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                <Badge variant={bundle.active ? 'success' : 'default'}>
                  {bundle.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                {bundle.products.slice(0, 3).map((product) => (
                  <div key={product.Id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Package" className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {product.quantity} × {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {bundle.products.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{bundle.products.length - 3} more products
                  </p>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Bundle Price:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(bundle.final_price || 0)}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleBundleStatus(bundle.Id, !bundle.active)}
                    className="flex-1"
                  >
                    {bundle.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBundle(bundle.Id)}
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bundles.length === 0 && (
          <div className="col-span-full">
            <Empty 
              message="No bundles created yet" 
              description="Create your first bundle to increase average order value"
              action={
                <Button onClick={() => setShowCreateModal(true)}>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              }
            />
          </div>
        )}
      </div>
      
      {/* Create Bundle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Bundle</h2>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Bundle Configuration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Bundle Details</h3>
                    <div className="space-y-4">
                      <Input
                        label="Bundle Name"
                        value={newBundle.name}
                        onChange={(e) => setNewBundle(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter bundle name"
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Pricing Type</label>
                          <select
                            value={newBundle.pricing_rule.type}
                            onChange={(e) => setNewBundle(prev => ({
                              ...prev,
                              pricing_rule: { ...prev.pricing_rule, type: e.target.value }
                            }))}
                            className="form-field w-full"
                          >
                            <option value="discount">Percentage Discount</option>
                            <option value="fixed">Fixed Amount Off</option>
                          </select>
                        </div>
                        
                        <Input
                          label={newBundle.pricing_rule.type === 'discount' ? 'Discount %' : 'Amount Off'}
                          type="number"
                          value={newBundle.pricing_rule.value}
                          onChange={(e) => setNewBundle(prev => ({
                            ...prev,
                            pricing_rule: { ...prev.pricing_rule, value: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Products */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Products</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {newBundle.products.map((product) => (
                        <div key={product.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => updateProductQuantity(product.Id, parseInt(e.target.value))}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProductFromBundle(product.Id)}
                            >
                              <ApperIcon name="X" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {newBundle.products.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No products selected</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Pricing Summary */}
                  {newBundle.products.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Pricing Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Original Price:</span>
                          <span className="text-blue-800">
                            {formatCurrency(newBundle.products.reduce((sum, p) => sum + (p.price * p.quantity), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Discount:</span>
                          <span className="text-blue-800">
                            -{newBundle.pricing_rule.type === 'discount' ? `${newBundle.pricing_rule.value}%` : formatCurrency(newBundle.pricing_rule.value)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-900 pt-2 border-t border-blue-200">
                          <span>Bundle Price:</span>
                          <span>{formatCurrency(calculateBundlePrice())}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Product Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Products</h3>
                  <div className="space-y-4">
                    <SearchBar
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={setSearchTerm}
                    />
                    
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.Id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            newBundle.products.find(p => p.Id === product.Id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => addProductToBundle(product)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                          </div>
                          {newBundle.products.find(p => p.Id === product.Id) ? (
                            <ApperIcon name="Check" className="h-5 w-5 text-primary" />
                          ) : (
                            <ApperIcon name="Plus" className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={createBundle}>
                Create Bundle
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BundleManager