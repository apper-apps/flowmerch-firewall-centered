const delay = () => new Promise(resolve => setTimeout(resolve, 350))

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
        { field: { Name: "shopify_id" } },
        { field: { Name: "description_html" } },
        { field: { Name: "msrp" } },
        { field: { Name: "cost" } },
        { field: { Name: "price" } },
        { field: { Name: "inventory" } },
        { field: { Name: "last_synced" } },
        { field: { Name: "sync_status" } },
        { field: { Name: "image_urls" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('product', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
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
        { field: { Name: "shopify_id" } },
        { field: { Name: "description_html" } },
        { field: { Name: "msrp" } },
        { field: { Name: "cost" } },
        { field: { Name: "price" } },
        { field: { Name: "inventory" } },
        { field: { Name: "last_synced" } },
        { field: { Name: "sync_status" } },
        { field: { Name: "image_urls" } }
      ]
    }
    
    const response = await apperClient.getRecordById('product', parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

export const create = async (productData) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredData = {
      Name: productData.Name,
      Tags: productData.Tags,
      Owner: parseInt(productData.Owner),
      shopify_id: productData.shopify_id,
      description_html: productData.description_html,
      msrp: parseFloat(productData.msrp),
      cost: parseFloat(productData.cost),
      price: parseFloat(productData.price),
      inventory: parseInt(productData.inventory),
      last_synced: productData.last_synced,
      sync_status: productData.sync_status,
      image_urls: productData.image_urls
    }
    
    const params = { records: [filteredData] }
    const response = await apperClient.createRecord('product', params)
    
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
    console.error('Error creating product:', error)
    throw error
  }
}

export const update = async (id, updates) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredUpdates = {
      Id: parseInt(id),
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.Tags && { Tags: updates.Tags }),
      ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
      ...(updates.shopify_id && { shopify_id: updates.shopify_id }),
      ...(updates.description_html !== undefined && { description_html: updates.description_html }),
      ...(updates.msrp && { msrp: parseFloat(updates.msrp) }),
      ...(updates.cost && { cost: parseFloat(updates.cost) }),
      ...(updates.price && { price: parseFloat(updates.price) }),
      ...(updates.inventory !== undefined && { inventory: parseInt(updates.inventory) }),
      ...(updates.last_synced && { last_synced: updates.last_synced }),
      ...(updates.sync_status && { sync_status: updates.sync_status }),
      ...(updates.image_urls && { image_urls: updates.image_urls })
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('product', params)
    
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
    console.error('Error updating product:', error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(id)] }
    const response = await apperClient.deleteRecord('product', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export const bulkSync = async (productIds) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Update sync status for multiple products
    const records = productIds.map(id => ({
      Id: parseInt(id),
      last_synced: new Date().toISOString(),
      sync_status: 'synced'
    }))
    
    const params = { records }
    const response = await apperClient.updateRecord('product', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true, synced: productIds.length }
  } catch (error) {
    console.error('Error bulk syncing products:', error)
    throw error
  }
}

// Export as 'delete' for convenience
export { delete_ as delete }