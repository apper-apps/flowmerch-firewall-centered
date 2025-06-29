import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import * as templateService from '@/services/api/templateService'
import { toast } from 'react-toastify'

const TemplateEditor = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [activeTab, setActiveTab] = useState('sections')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Form states
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'product',
    sections: [],
    placeholders: [],
    formatting: {
      theme: 'modern',
      spacing: 'comfortable',
      borderRadius: 'md',
      backgroundColor: 'white',
      padding: 'lg'
    },
    isActive: true
  })
  
  const [draggedSection, setDraggedSection] = useState(null)
  const [newPlaceholder, setNewPlaceholder] = useState({
    id: '',
    name: '',
    type: 'text',
    description: ''
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await templateService.getAll()
      setTemplates(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const created = await templateService.create(templateForm)
      setTemplates(prev => [...prev, created])
      setShowCreateModal(false)
      resetForm()
      toast.success('Template created successfully')
    } catch (err) {
      toast.error('Failed to create template')
    }
  }

  const handleUpdateTemplate = async (id, updates) => {
    try {
      const updated = await templateService.update(id, updates)
      setTemplates(prev => prev.map(t => t.Id === id ? updated : t))
      if (selectedTemplate?.Id === id) {
        setSelectedTemplate(updated)
      }
      toast.success('Template updated successfully')
    } catch (err) {
      toast.error('Failed to update template')
    }
  }

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      await templateService.delete(id)
      setTemplates(prev => prev.filter(t => t.Id !== id))
      if (selectedTemplate?.Id === id) {
        setSelectedTemplate(null)
      }
      toast.success('Template deleted successfully')
    } catch (err) {
      toast.error('Failed to delete template')
    }
  }

  const handleToggleActive = async (id, isActive) => {
    try {
      await handleUpdateTemplate(id, { isActive: !isActive })
    } catch (err) {
      toast.error('Failed to update template status')
    }
  }

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      name: 'New Section',
      type: 'text',
      content: '',
      formatting: {
        fontSize: 'base',
        fontWeight: 'normal',
        color: 'gray-700',
        alignment: 'left'
      },
      order: templateForm.sections.length + 1
    }
    
    setTemplateForm(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const updateSection = (sectionId, updates) => {
    setTemplateForm(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }))
  }

  const removeSection = (sectionId) => {
    setTemplateForm(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }))
  }

  const addPlaceholder = () => {
    if (!newPlaceholder.id || !newPlaceholder.name) {
      toast.error('Please fill in placeholder ID and name')
      return
    }
    
    setTemplateForm(prev => ({
      ...prev,
      placeholders: [...prev.placeholders, { ...newPlaceholder }]
    }))
    
    setNewPlaceholder({
      id: '',
      name: '',
      type: 'text',
      description: ''
    })
    
    toast.success('Placeholder added')
  }

  const removePlaceholder = (placeholderId) => {
    setTemplateForm(prev => ({
      ...prev,
      placeholders: prev.placeholders.filter(p => p.id !== placeholderId)
    }))
  }

  const handleDragStart = (e, section) => {
    setDraggedSection(section)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetSection) => {
    e.preventDefault()
    if (!draggedSection || draggedSection.id === targetSection.id) return

    const sections = [...templateForm.sections]
    const draggedIndex = sections.findIndex(s => s.id === draggedSection.id)
    const targetIndex = sections.findIndex(s => s.id === targetSection.id)

    // Reorder sections
    sections.splice(draggedIndex, 1)
    sections.splice(targetIndex, 0, draggedSection)

    // Update order numbers
    sections.forEach((section, index) => {
      section.order = index + 1
    })

    setTemplateForm(prev => ({ ...prev, sections }))
    setDraggedSection(null)
  }

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      category: 'product',
      sections: [],
      placeholders: [],
      formatting: {
        theme: 'modern',
        spacing: 'comfortable',
        borderRadius: 'md',
        backgroundColor: 'white',
        padding: 'lg'
      },
      isActive: true
    })
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'product', label: 'Product' },
    { value: 'email', label: 'Email' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'custom', label: 'Custom' }
  ]

  const sectionTypes = [
    { value: 'text', label: 'Text' },
    { value: 'richtext', label: 'Rich Text' },
    { value: 'image', label: 'Image' },
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'highlight', label: 'Highlight Box' }
  ]

  const placeholderTypes = [
    { value: 'text', label: 'Text' },
    { value: 'richtext', label: 'Rich Text' },
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'date', label: 'Date' },
    { value: 'image', label: 'Image' },
    { value: 'array', label: 'Array/List' }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTemplates} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Editor</h1>
          <p className="text-gray-600">Create and customize templates for dynamic content</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" size={16} />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterDropdown
          options={categoryOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
          placeholder="Category"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Templates ({filteredTemplates.length})</h3>
            
            {filteredTemplates.length === 0 ? (
              <Empty 
                title="No templates found"
                description="Create your first template to get started"
              />
            ) : (
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.Id}
                    layout
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.Id === template.Id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={template.category === 'product' ? 'primary' : 'secondary'}>
                            {template.category}
                          </Badge>
                          <Badge variant={template.isActive ? 'success' : 'warning'}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleActive(template.Id, template.isActive)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon 
                            name={template.isActive ? 'Eye' : 'EyeOff'} 
                            size={14}
                            className={template.isActive ? 'text-success' : 'text-gray-400'}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTemplate(template.Id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded text-error"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'sections', label: 'Sections', icon: 'Layout' },
                    { id: 'formatting', label: 'Formatting', icon: 'Palette' },
                    { id: 'placeholders', label: 'Placeholders', icon: 'Variable' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ApperIcon name={tab.icon} size={16} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'sections' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Template Sections</h3>
                      <Button size="sm" onClick={addSection}>
                        <ApperIcon name="Plus" size={14} />
                        Add Section
                      </Button>
                    </div>

                    {selectedTemplate.sections?.length === 0 ? (
                      <Empty 
                        title="No sections"
                        description="Add sections to build your template"
                      />
                    ) : (
                      <div className="space-y-3">
                        {selectedTemplate.sections?.map((section) => (
                          <motion.div
                            key={section.id}
                            layout
                            draggable
                            onDragStart={(e) => handleDragStart(e, section)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, section)}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-move hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-3">
                              <ApperIcon name="GripVertical" size={16} className="text-gray-400 mt-1" />
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Input
                                    label="Section Name"
                                    value={section.name}
                                    onChange={(e) => updateSection(section.id, { name: e.target.value })}
                                    className="flex-1 mr-4"
                                  />
                                  <select
                                    value={section.type}
                                    onChange={(e) => updateSection(section.id, { type: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  >
                                    {sectionTypes.map(type => (
                                      <option key={type.value} value={type.value}>
                                        {type.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <textarea
                                  placeholder="Section content..."
                                  value={section.content}
                                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                                />
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <select
                                    value={section.formatting?.fontSize || 'base'}
                                    onChange={(e) => updateSection(section.id, { 
                                      formatting: { ...section.formatting, fontSize: e.target.value }
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="xs">Extra Small</option>
                                    <option value="sm">Small</option>
                                    <option value="base">Base</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra Large</option>
                                    <option value="2xl">2X Large</option>
                                    <option value="3xl">3X Large</option>
                                  </select>
                                  
                                  <select
                                    value={section.formatting?.fontWeight || 'normal'}
                                    onChange={(e) => updateSection(section.id, { 
                                      formatting: { ...section.formatting, fontWeight: e.target.value }
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  >
                                    <option value="normal">Normal</option>
                                    <option value="medium">Medium</option>
                                    <option value="semibold">Semibold</option>
                                    <option value="bold">Bold</option>
                                  </select>
                                </div>
                              </div>
                              <button
                                onClick={() => removeSection(section.id)}
                                className="p-1 hover:bg-red-100 rounded text-error"
                              >
                                <ApperIcon name="X" size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'formatting' && (
                  <div className="space-y-6">
                    <h3 className="font-medium text-gray-900">Global Formatting</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          value={selectedTemplate.formatting?.theme || 'modern'}
                          onChange={(e) => {
                            const updated = {
                              ...selectedTemplate,
                              formatting: { ...selectedTemplate.formatting, theme: e.target.value }
                            }
                            handleUpdateTemplate(selectedTemplate.Id, { formatting: updated.formatting })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                          <option value="newsletter">Newsletter</option>
                          <option value="promotion">Promotion</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
                        <select
                          value={selectedTemplate.formatting?.spacing || 'comfortable'}
                          onChange={(e) => {
                            const updated = {
                              ...selectedTemplate,
                              formatting: { ...selectedTemplate.formatting, spacing: e.target.value }
                            }
                            handleUpdateTemplate(selectedTemplate.Id, { formatting: updated.formatting })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="compact">Compact</option>
                          <option value="comfortable">Comfortable</option>
                          <option value="spacious">Spacious</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                        <select
                          value={selectedTemplate.formatting?.borderRadius || 'md'}
                          onChange={(e) => {
                            const updated = {
                              ...selectedTemplate,
                              formatting: { ...selectedTemplate.formatting, borderRadius: e.target.value }
                            }
                            handleUpdateTemplate(selectedTemplate.Id, { formatting: updated.formatting })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="none">None</option>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
                        <select
                          value={selectedTemplate.formatting?.padding || 'lg'}
                          onChange={(e) => {
                            const updated = {
                              ...selectedTemplate,
                              formatting: { ...selectedTemplate.formatting, padding: e.target.value }
                            }
                            handleUpdateTemplate(selectedTemplate.Id, { formatting: updated.formatting })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="text"
                        value={selectedTemplate.formatting?.backgroundColor || 'white'}
                        onChange={(e) => {
                          const updated = {
                            ...selectedTemplate,
                            formatting: { ...selectedTemplate.formatting, backgroundColor: e.target.value }
                          }
                          handleUpdateTemplate(selectedTemplate.Id, { formatting: updated.formatting })
                        }}
                        placeholder="e.g., white, gray-50, gradient-to-r from-primary to-accent"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'placeholders' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">Dynamic Placeholders</h3>
                    </div>
                    
                    {/* Add New Placeholder */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Add New Placeholder</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Input
                          label="Placeholder ID"
                          value={newPlaceholder.id}
                          onChange={(e) => setNewPlaceholder(prev => ({ ...prev, id: e.target.value }))}
                          placeholder="e.g., product.title"
                        />
                        <Input
                          label="Display Name"
                          value={newPlaceholder.name}
                          onChange={(e) => setNewPlaceholder(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Product Title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={newPlaceholder.type}
                            onChange={(e) => setNewPlaceholder(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            {placeholderTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button onClick={addPlaceholder} className="w-full">
                            <ApperIcon name="Plus" size={14} />
                            Add Placeholder
                          </Button>
                        </div>
                      </div>
                      <Input
                        label="Description"
                        value={newPlaceholder.description}
                        onChange={(e) => setNewPlaceholder(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this placeholder"
                      />
                    </div>

                    {/* Existing Placeholders */}
                    {selectedTemplate.placeholders?.length === 0 ? (
                      <Empty 
                        title="No placeholders"
                        description="Add placeholders to make your template dynamic"
                      />
                    ) : (
                      <div className="space-y-3">
                        {selectedTemplate.placeholders?.map((placeholder) => (
                          <div key={placeholder.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                    {`{{${placeholder.id}}}`}
                                  </code>
                                  <Badge variant="secondary">{placeholder.type}</Badge>
                                </div>
                                <h4 className="font-medium text-gray-900">{placeholder.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{placeholder.description}</p>
                              </div>
                              <button
                                onClick={() => removePlaceholder(placeholder.id)}
                                className="p-1 hover:bg-red-100 rounded text-error"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <Empty 
                title="Select a template to edit"
                description="Choose a template from the list to start customizing"
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Template</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Template Name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this template is for"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-20 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="product">Product</option>
                    <option value="email">Email</option>
                    <option value="promotion">Promotion</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTemplate}
                  disabled={!templateForm.name.trim()}
                  className="flex-1"
                >
                  Create Template
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TemplateEditor