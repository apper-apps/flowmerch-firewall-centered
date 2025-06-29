const delay = () => new Promise(resolve => setTimeout(resolve, 400))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const getAll = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "products" } },
        { field: { Name: "pricing_rule" } },
        { field: { Name: "final_price" } },
        { field: { Name: "active" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('bundle', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching bundles:', error)
    throw error
  }
}

export const getById = async (id) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "products" } },
        { field: { Name: "pricing_rule" } },
        { field: { Name: "final_price" } },
        { field: { Name: "active" } }
      ]
    }
    
    const response = await apperClient.getRecordById('bundle', parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching bundle ${id}:`, error)
    throw error
  }
}

export const create = async (bundleData) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Calculate final price
    const totalPrice = bundleData.products.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    )
    
    let finalPrice = totalPrice
    if (bundleData.pricing_rule.type === 'discount') {
      finalPrice = totalPrice * (1 - bundleData.pricing_rule.value / 100)
    } else if (bundleData.pricing_rule.type === 'fixed') {
      finalPrice = Math.max(0, totalPrice - bundleData.pricing_rule.value)
    }
    
    // Only include Updateable fields
    const filteredData = {
      Name: bundleData.name || bundleData.Name,
      Tags: bundleData.Tags || '',
      Owner: bundleData.Owner ? parseInt(bundleData.Owner) : null,
      products: JSON.stringify(bundleData.products || []),
      pricing_rule: JSON.stringify(bundleData.pricing_rule || {}),
      final_price: parseFloat(finalPrice),
      active: bundleData.active !== undefined ? bundleData.active : true
    }
    
    const params = { records: [filteredData] }
    const response = await apperClient.createRecord('bundle', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success)
      const failedRecords = response.results.filter(result => !result.success)
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        throw new Error('Some records failed to create')
      }
      
      return successfulRecords[0]?.data
    }
  } catch (error) {
    console.error('Error creating bundle:', error)
    throw error
  }
}

export const update = async (id, updates) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Calculate final price if products or pricing rule changed
    let finalPrice = updates.final_price
    if (updates.products && updates.pricing_rule) {
      const totalPrice = updates.products.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0
      )
      
      if (updates.pricing_rule.type === 'discount') {
        finalPrice = totalPrice * (1 - updates.pricing_rule.value / 100)
      } else if (updates.pricing_rule.type === 'fixed') {
        finalPrice = Math.max(0, totalPrice - updates.pricing_rule.value)
      }
    }
    
    // Only include Updateable fields
    const filteredUpdates = {
      Id: parseInt(id),
      ...(updates.name && { Name: updates.name }),
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.Tags && { Tags: updates.Tags }),
      ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
      ...(updates.products && { products: JSON.stringify(updates.products) }),
      ...(updates.pricing_rule && { pricing_rule: JSON.stringify(updates.pricing_rule) }),
      ...(finalPrice !== undefined && { final_price: parseFloat(finalPrice) }),
      ...(updates.active !== undefined && { active: updates.active })
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('bundle', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success)
      const failedRecords = response.results.filter(result => !result.success)
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        throw new Error('Some records failed to update')
      }
      
      return successfulRecords[0]?.data
    }
  } catch (error) {
    console.error('Error updating bundle:', error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(id)] }
    const response = await apperClient.deleteRecord('bundle', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting bundle:', error)
    throw error
  }
}

// Export as 'delete' for convenience
export { delete_ as delete }