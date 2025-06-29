import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Settings from "@/components/pages/Settings";
import Products from "@/components/pages/Products";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import * as descriptionService from "@/services/api/descriptionService";
import { getTemplates } from "@/services/api/collectionService";

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
  
  // LLM Generation State
  const [llmProvider, setLlmProvider] = useState('openrouter')
  const [llmSettings, setLlmSettings] = useState({
    apiKey: '',
    model: 'openai/gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000
  })
  const [customPrompt, setCustomPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])
  const [showLlmPanel, setShowLlmPanel] = useState(false)
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
    setCustomPrompt(template.llm_prompt || '')
    toast.success('Template applied')
  }
  
  const generateWithLLM = async () => {
    if (!selectedProduct || !llmSettings.apiKey) {
      toast.error('Please select a product and configure LLM settings')
      return
    }
    
    try {
      setGenerating(true)
      const generatedContent = await descriptionService.generateDescription({
        product: selectedProduct,
        template: selectedTemplate,
        customPrompt,
        provider: llmProvider,
        settings: llmSettings
      })
      
      setContent(generatedContent.html)
      setGenerationHistory(prev => [{
        id: Date.now(),
        content: generatedContent.html,
        timestamp: new Date(),
        prompt: customPrompt || generatedContent.prompt,
        provider: llmProvider
      }, ...prev.slice(0, 4)]) // Keep last 5 generations
      
      toast.success('Description generated successfully!')
    } catch (err) {
      toast.error('Failed to generate description: ' + err.message)
      console.error('LLM generation error:', err)
    } finally {
      setGenerating(false)
    }
  }
  
  const loadHistoryItem = (item) => {
    setContent(item.content)
    setCustomPrompt(item.prompt)
    toast.success('Previous generation loaded')
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
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Product List */}
        <div className="card">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Products</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {products.map(product => <button
                    key={product.Id}
                    onClick={() => selectProduct(product)}
className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${selectedProduct?.Id === product.Id ? "bg-primary/5 border-primary/20" : ""}`}>
                    <p className="font-medium text-gray-900 truncate">{product.Name}</p>
                    <p className="text-sm text-gray-500 truncate">ID: {product.shopify_id}</p>
                </button>)}
            </div>
        </div>
        {/* Editor */}
        <div className="xl:col-span-2">
            <div className="card">
                {/* Editor Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
<h2 className="font-semibold text-gray-900">
                            {selectedProduct ? selectedProduct.Name : "Select a Product"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLlmPanel(!showLlmPanel)}
                                className={showLlmPanel ? "bg-primary/10 text-primary" : ""}>
                                <ApperIcon name="Bot" className="h-4 w-4 mr-2" />AI Generate
                                                  </Button>
                            {selectedProduct && <Button onClick={saveDescription} loading={saving}>
                                <ApperIcon name="Save" className="h-4 w-4 mr-2" />Save
                                                    </Button>}
                        </div>
                    </div>
                    {/* Editor Mode Tabs */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setEditorMode("wysiwyg")}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${editorMode === "wysiwyg" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Visual
                                            </button>
                        <button
                            onClick={() => setEditorMode("html")}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${editorMode === "html" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>HTML
                                            </button>
                        <button
                            onClick={() => setEditorMode("preview")}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${editorMode === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Preview
                                            </button>
                    </div>
                </div>
                {/* Editor Content */}
                <div
                    className="p-4"
                    style={{
                        minHeight: "400px"
                    }}>
                    {selectedProduct ? <div className="h-full">
                        {editorMode === "wysiwyg" && <div className="border border-gray-300 rounded-lg p-4 h-full">
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full h-full resize-none border-none outline-none"
                                placeholder="Enter your product description..." />
                        </div>}
                        {editorMode === "html" && <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full h-full border border-gray-300 rounded-lg p-4 font-mono text-sm resize-none"
                            placeholder="<div>Enter HTML content...</div>" />}
                        {editorMode === "preview" && <div
                            className="w-full h-full border border-gray-300 rounded-lg p-4 overflow-auto prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: content
                            }} />}
                    </div> : <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <ApperIcon name="FileText" className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>Select a product to edit its description</p>
                        </div>
                    </div>}
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
                {templates.map(template => <motion.div
                    key={template.Id}
                    whileHover={{
                        scale: 1.02
                    }}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
onClick={() => applyTemplate(template)}>
                    <h3 className="font-medium text-gray-900 mb-1">{template.Name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{template.category}</span>
                        <ApperIcon name="ArrowRight" className="h-4 w-4 text-gray-400" />
                    </div>
                </motion.div>)}
            </div>
        </div>
        {/* Right Column - Preview & History */}
        <div className="space-y-6">
            <motion.div
                initial={{
                    opacity: 0,
                    transform: "translateX(20px)"
                }}
                animate={{
                    opacity: 1,
                    transform: "translateX(0px)"
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
                className="xl:col-span-2 space-y-6"
                style={{
                    willChange: "transform, opacity"
                }}>
                {/* LLM Settings */}
                <div className="bg-white rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">AI Generation Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                            </label></div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                                <select
                                    value={llmProvider}
                                    onChange={e => setLlmProvider(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="openrouter">OpenRouter</option>
                                    <option value="openai">OpenAI (ChatGPT)</option>
                                    <option value="anthropic">Anthropic (Claude)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                <Input
                                    type="password"
                                    value={llmSettings.apiKey}
                                    onChange={e => setLlmSettings(prev => ({
                                        ...prev,
                                        apiKey: e.target.value
                                    }))}
                                    placeholder="Enter your API key" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <select
                                        value={llmSettings.model}
                                        onChange={e => setLlmSettings(prev => ({
                                            ...prev,
                                            model: e.target.value
                                        }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                                        {llmProvider === "openrouter" && <>
                                            <option value="openai/gpt-4o-mini">GPT-4O Mini</option>
                                            <option value="openai/gpt-4o">GPT-4O</option>
                                            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                                            <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                                        </>}
                                        {llmProvider === "openai" && <>
                                            <option value="gpt-4o-mini">GPT-4O Mini</option>
                                            <option value="gpt-4o">GPT-4O</option>
                                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                        </>}
                                        {llmProvider === "anthropic" && <>
                                            <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                                            <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                                        </>}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={llmSettings.temperature}
                                        onChange={e => setLlmSettings(prev => ({
                                            ...prev,
                                            temperature: parseFloat(e.target.value)
                                        }))} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Custom Prompt */}
                    <div className="card">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <ApperIcon name="MessageSquare" className="h-5 w-5 mr-2" />Custom Prompt
                                                </h3>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={customPrompt}
                                onChange={e => setCustomPrompt(e.target.value)}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
                                placeholder="Enter custom instructions for the LLM (optional). Use [PRODUCT_NAME], [PRODUCT_FEATURES], [IMAGES] as placeholders." />
                            <div className="mt-3 flex justify-between items-center">
                                <p className="text-sm text-gray-500">Variables: [PRODUCT_NAME], [PRODUCT_FEATURES], [IMAGES]
                                                      </p>
                                <Button
                                    onClick={generateWithLLM}
                                    loading={generating}
                                    disabled={!selectedProduct || !llmSettings.apiKey}>
                                    <ApperIcon name="Sparkles" className="h-4 w-4 mr-2" />Generate Description
                                                      </Button>
                            </div>
                        </div>
                    </div>
                    {/* Generation History */}
                    {generationHistory.length > 0 && <div className="card">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <ApperIcon name="History" className="h-5 w-5 mr-2" />Generation History
                                                  </h3>
                        </div>
                        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                            {generationHistory.map(item => <motion.div
                                key={item.id}
                                initial={{
                                    opacity: 0,
                                    y: 10
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                className="p-3 border border-gray-200 rounded-lg hover:border-primary/30 cursor-pointer transition-colors"
                                onClick={() => loadHistoryItem(item)}>
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs text-gray-500">
                                        {item.timestamp.toLocaleTimeString()}- {item.provider}
                                    </span>
                                    <ApperIcon name="RotateCcw" className="h-4 w-4 text-gray-400" />
                                </div>
                                <p
                                    className="text-sm text-gray-700 line-clamp-3"
                                    dangerouslySetInnerHTML={{
                                        __html: item.content.substring(0, 150) + "..."
                                    }} />
                            </motion.div>)}
                        </div>
                    </div>}
                </div></motion.div>)
                  </div>
    </div></div>
  )
}

export default DescriptionEditor