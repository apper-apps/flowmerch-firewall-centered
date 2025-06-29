import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import * as descriptionService from '@/services/api/descriptionService'
import { toast } from 'react-toastify'

const DescriptionEditor = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editorMode, setEditorMode] = useState('wysiwyg') // wysiwyg, html, preview
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [productsData, templatesData] = await Promise.all([
        descriptionService.getProducts(),
        descriptionService.getTemplates()
      ])
      setProducts(productsData)
      setTemplates(templatesData)
    } catch (err) {
      setError('Failed to load editor data. Please try again.')
      console.error('Description editor error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const selectProduct = async (product) => {
    setSelectedProduct(product)
    setContent(product.description_html || '')
  }
  
  const applyTemplate = (template) => {
    setSelectedTemplate(template)
    setContent(template.content)
    toast.success('Template applied')
  }
  
  const saveDescription = async () => {
    if (!selectedProduct) return
    
    try {
      setSaving(true)
      await descriptionService.updateDescription(selectedProduct.Id, content)
      toast.success('Description saved successfully')
      
      // Update the product in the list
      setProducts(prev => prev.map(p => 
        p.Id === selectedProduct.Id 
          ? { ...p, description_html: content }
          : p
      ))
    } catch (err) {
      toast.error('Failed to save description')
      console.error('Save description error:', err)
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Description Editor</h1>
        <p className="text-gray-600">Create and edit rich HTML descriptions for your products</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Product List */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Products</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {products.map((product) => (
              <button
                key={product.Id}
                onClick={() => selectProduct(product)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  selectedProduct?.Id === product.Id ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500 truncate">ID: {product.shopify_id}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Editor Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  {selectedProduct ? selectedProduct.name : 'Select a Product'}
                </h2>
                {selectedProduct && (
                  <Button onClick={saveDescription} loading={saving}>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
              
              {/* Editor Mode Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEditorMode('wysiwyg')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    editorMode === 'wysiwyg' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Visual
                </button>
                <button
                  onClick={() => setEditorMode('html')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    editorMode === 'html' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setEditorMode('preview')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    editorMode === 'preview' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
            
            {/* Editor Content */}
            <div className="p-4" style={{ minHeight: '400px' }}>
              {selectedProduct ? (
                <div className="h-full">
                  {editorMode === 'wysiwyg' && (
                    <div className="border border-gray-300 rounded-lg p-4 h-full">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full resize-none border-none outline-none"
                        placeholder="Enter your product description..."
                      />
                    </div>
                  )}
                  
                  {editorMode === 'html' && (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full border border-gray-300 rounded-lg p-4 font-mono text-sm resize-none"
                      placeholder="<div>Enter HTML content...</div>"
                    />
                  )}
                  
                  {editorMode === 'preview' && (
                    <div 
                      className="w-full h-full border border-gray-300 rounded-lg p-4 overflow-auto prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="FileText" className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a product to edit its description</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Templates */}
        <div className="card">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Templates</h2>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {templates.map((template) => (
              <motion.div
                key={template.Id}
                whileHover={{ scale: 1.02 }}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
                onClick={() => applyTemplate(template)}
              >
                <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{template.category}</span>
                  <ApperIcon name="ArrowRight" className="h-4 w-4 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionEditor