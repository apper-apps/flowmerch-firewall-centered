const delay = () => new Promise(resolve => setTimeout(resolve, 400))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const getConflicts = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "product_name" } },
        { field: { Name: "field" } },
        { field: { Name: "local_value" } },
        { field: { Name: "remote_value" } },
        { field: { Name: "local_timestamp" } },
        { field: { Name: "remote_timestamp" } },
        { field: { Name: "product_id" } }
      ],
      orderBy: [{ fieldName: "local_timestamp", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('conflict', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching conflicts:', error)
    throw error
  }
}

export const getSyncHistory = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "operation" } },
        { field: { Name: "description" } },
        { field: { Name: "status" } },
        { field: { Name: "products_affected" } },
        { field: { Name: "timestamp" } }
      ],
      orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('sync_history', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching sync history:', error)
    throw error
  }
}

export const resolveConflict = async (conflictId, resolution) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Delete the conflict
    const deleteParams = { RecordIds: [parseInt(conflictId)] }
    const deleteResponse = await apperClient.deleteRecord('conflict', deleteParams)
    
    if (!deleteResponse.success) {
      console.error(deleteResponse.message)
      throw new Error(deleteResponse.message)
    }
    
    // Add to sync history
    const historyData = {
      Name: `Conflict Resolution - ${Date.now()}`,
      operation: 'Conflict Resolution',
      description: `Resolved conflict using ${resolution} value`,
      status: 'synced',
      products_affected: 1,
      timestamp: new Date().toISOString()
    }
    
    const historyParams = { records: [historyData] }
    const historyResponse = await apperClient.createRecord('sync_history', historyParams)
    
    if (!historyResponse.success) {
      console.error(historyResponse.message)
      // Don't throw error here as conflict was already resolved
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error resolving conflict:', error)
    throw error
  }
}

export const triggerFullSync = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Add to sync history
    const historyData = {
      Name: `Full Sync - ${Date.now()}`,
      operation: 'Full Sync',
      description: 'Manual full synchronization initiated',
      status: 'pending',
      products_affected: 0,
      timestamp: new Date().toISOString()
    }
    
    const params = { records: [historyData] }
    const response = await apperClient.createRecord('sync_history', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error triggering full sync:', error)
    throw error
  }
}