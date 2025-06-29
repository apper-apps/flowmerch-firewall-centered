import ProductTable from '@/components/organisms/ProductTable'

const Products = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600">Manage your product catalog and sync operations</p>
      </div>
      
      {/* Product Table */}
      <ProductTable />
    </div>
  )
}

export default Products