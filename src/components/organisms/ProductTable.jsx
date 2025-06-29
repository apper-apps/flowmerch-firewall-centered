import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import StatusDot from '@/components/atoms/StatusDot'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import * as productService from '@/services/api/productService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const ProductTable = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  
  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Synced', value: 'synced' },
    { label: 'Pending', value: 'pending' },
    { label: 'Conflicts', value: 'conflict' },
    { label: 'Error', value: 'error' }
  ]
  
  useEffect(() => {
    loadProducts()
  }, [])
  
  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, statusFilter, sortConfig])
  
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.shopify_id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || product.sync_status === statusFilter
      return matchesSearch && matchesStatus
    })
    
    // Sort products
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    setFilteredProducts(filtered)
  }
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.Id))
    }
  }
  
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }
  
  const handleBulkSync = async () => {
    try {
      setLoading(true)
      await productService.bulkSync(selectedProducts)
      toast.success(`Syncing ${selectedProducts.length} products`)
      setSelectedProducts([])
      await loadProducts()
    } catch (err) {
      toast.error('Failed to sync products')
      console.error('Bulk sync error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ChevronsUpDown'
    return sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProducts} />
  if (products.length === 0) return <Empty message="No products found" />
  
  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchBar
            placeholder="Search products..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:w-80"
          />
          <FilterDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="w-full sm:w-48"
          />
        </div>
        
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedProducts.length} selected
            </span>
            <Button onClick={handleBulkSync} size="sm">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Sync Selected
            </Button>
          </div>
        )}
      </div>
      
      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Product</span>
                    <ApperIcon name={getSortIcon('name')} className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Price</span>
                    <ApperIcon name={getSortIcon('price')} className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('inventory')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Inventory</span>
                    <ApperIcon name={getSortIcon('inventory')} className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="table-row-hover"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.Id)}
                        onChange={() => handleSelectProduct(product.Id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.shopify_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <StatusDot status={product.sync_status} />
                        <Badge variant={
                          product.sync_status === 'synced' ? 'success' :
                          product.sync_status === 'error' ? 'error' : 'warning'
                        }>
                          {product.sync_status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{formatCurrency(product.price)}</div>
                        {product.msrp && product.msrp !== product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            MSRP: {formatCurrency(product.msrp)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className={`font-medium ${product.inventory < 10 ? 'text-error' : product.inventory < 50 ? 'text-warning' : 'text-success'}`}>
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.last_synced ? format(new Date(product.last_synced), 'MMM d, HH:mm') : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="RefreshCw" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" disabled>
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm bg-primary text-white rounded">1</span>
            <Button variant="secondary" size="sm" disabled>
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductTable