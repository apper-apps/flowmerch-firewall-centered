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
        { field: { Name: "description" } },
        { field: { Name: "template" } },
        { field: { Name: "rules" } },
        { field: { Name: "auto_update" } },
        { field: { Name: "active" } },
        { field: { Name: "product_count" } },
        { field: { Name: "last_updated" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('collection', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching collections:', error)
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
        { field: { Name: "description" } },
        { field: { Name: "template" } },
        { field: { Name: "rules" } },
        { field: { Name: "auto_update" } },
        { field: { Name: "active" } },
        { field: { Name: "product_count" } },
        { field: { Name: "last_updated" } }
      ]
    }
    
    const response = await apperClient.getRecordById('collection', parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching collection ${id}:`, error)
    throw error
  }
}

export const getTemplates = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('template', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

export const create = async (collectionData) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredData = {
      Name: collectionData.name || collectionData.Name,
      Tags: collectionData.Tags || '',
      Owner: collectionData.Owner ? parseInt(collectionData.Owner) : null,
      description: collectionData.description,
      template: collectionData.template,
      rules: JSON.stringify(collectionData.rules || []),
      auto_update: collectionData.auto_update !== undefined ? collectionData.auto_update : true,
      active: collectionData.active !== undefined ? collectionData.active : true,
      product_count: 0,
      last_updated: new Date().toISOString()
    }
    
    const params = { records: [filteredData] }
    const response = await apperClient.createRecord('collection', params)
    
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
    console.error('Error creating collection:', error)
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
      ...(updates.name && { Name: updates.name }),
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.Tags && { Tags: updates.Tags }),
      ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.template !== undefined && { template: updates.template }),
      ...(updates.rules && { rules: JSON.stringify(updates.rules) }),
      ...(updates.auto_update !== undefined && { auto_update: updates.auto_update }),
      ...(updates.active !== undefined && { active: updates.active }),
      ...(updates.product_count !== undefined && { product_count: parseInt(updates.product_count) }),
      last_updated: new Date().toISOString()
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('collection', params)
    
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
    console.error('Error updating collection:', error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(id)] }
    const response = await apperClient.deleteRecord('collection', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting collection:', error)
    throw error
  }
}

// Export as 'delete' for convenience
export { delete_ as delete }