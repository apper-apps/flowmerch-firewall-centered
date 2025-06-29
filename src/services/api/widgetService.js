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
        { field: { Name: "type" } },
        { field: { Name: "settings" } },
        { field: { Name: "placement" } },
        { field: { Name: "active" } },
        { field: { Name: "created_at" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('widget', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching widgets:', error)
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
        { field: { Name: "type" } },
        { field: { Name: "settings" } },
        { field: { Name: "placement" } },
        { field: { Name: "active" } },
        { field: { Name: "created_at" } }
      ]
    }
    
    const response = await apperClient.getRecordById('widget', parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching widget ${id}:`, error)
    throw error
  }
}

export const create = async (widgetData) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredData = {
      Name: widgetData.name || widgetData.Name,
      Tags: widgetData.Tags || '',
      Owner: widgetData.Owner ? parseInt(widgetData.Owner) : null,
      type: widgetData.type,
      settings: JSON.stringify(widgetData.settings || {}),
      placement: widgetData.placement,
      active: widgetData.active !== undefined ? widgetData.active : true,
      created_at: new Date().toISOString()
    }
    
    const params = { records: [filteredData] }
    const response = await apperClient.createRecord('widget', params)
    
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
    console.error('Error creating widget:', error)
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
      ...(updates.type && { type: updates.type }),
      ...(updates.settings && { settings: JSON.stringify(updates.settings) }),
      ...(updates.placement && { placement: updates.placement }),
      ...(updates.active !== undefined && { active: updates.active }),
      ...(updates.created_at && { created_at: updates.created_at })
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('widget', params)
    
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
    console.error('Error updating widget:', error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(id)] }
    const response = await apperClient.deleteRecord('widget', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting widget:', error)
    throw error
  }
}

// Export as 'delete' for convenience but keep the actual export as 'delete_'
export { delete_ as delete }