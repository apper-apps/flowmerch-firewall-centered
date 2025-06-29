const delay = () => new Promise(resolve => setTimeout(resolve, 300))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const getStats = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Get product count
    const productParams = {
      aggregators: [
        {
          id: 'totalProducts',
          fields: [{ field: { Name: "Id" }, Function: "Count", Alias: "Count" }]
        }
      ]
    }
    
    // Get conflicts count
    const conflictParams = {
      aggregators: [
        {
          id: 'pendingConflicts',
          fields: [{ field: { Name: "Id" }, Function: "Count", Alias: "Count" }]
        }
      ]
    }
    
    // Get today's sync operations
    const syncParams = {
      aggregators: [
        {
          id: 'syncedToday',
          fields: [{ field: { Name: "products_affected" }, Function: "Sum", Alias: "Sum" }],
          where: [
            {
              FieldName: "timestamp",
              Operator: "RelativeMatch", 
              Values: ["Today"]
            }
          ]
        }
      ]
    }
    
    const [productResponse, conflictResponse, syncResponse] = await Promise.all([
      apperClient.fetchRecords('product', productParams),
      apperClient.fetchRecords('conflict', conflictParams),
      apperClient.fetchRecords('sync_history', syncParams)
    ])
    
    return {
      totalProducts: productResponse.success ? (productResponse.aggregators?.find(a => a.id === 'totalProducts')?.value || 0) : 0,
      syncedToday: syncResponse.success ? (syncResponse.aggregators?.find(a => a.id === 'syncedToday')?.value || 0) : 0,
      pendingConflicts: conflictResponse.success ? (conflictResponse.aggregators?.find(a => a.id === 'pendingConflicts')?.value || 0) : 0,
      revenueImpact: 47250 // This would require more complex calculation
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return fallback data
    return {
      totalProducts: 0,
      syncedToday: 0,
      pendingConflicts: 0,
      revenueImpact: 0
    }
  }
}

export const getRecentActivity = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "operation" } },
        { field: { Name: "description" } },
        { field: { Name: "status" } },
        { field: { Name: "timestamp" } }
      ],
      orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
      pagingInfo: { limit: 10, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('sync_history', params)
    
    if (!response.success) {
      console.error(response.message)
      return []
    }
    
    // Transform sync history into activity format
    return (response.data || []).map(record => ({
      Id: record.Id,
      type: record.status === 'error' ? 'error' : 
            record.operation?.includes('Conflict') ? 'conflict' : 
            record.status === 'synced' ? 'success' : 'sync',
      title: record.operation || 'Unknown Operation',
      description: record.description || 'No description',
      timestamp: record.timestamp ? formatRelativeTime(record.timestamp) : 'Unknown time'
    }))
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

const formatRelativeTime = (timestamp) => {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  } catch (error) {
    return 'Unknown time'
  }
}