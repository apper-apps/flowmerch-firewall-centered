const delay = () => new Promise(resolve => setTimeout(resolve, 400))

const mockConflicts = [
  {
    Id: 1,
    product_id: 2,
    product_name: 'Smart Fitness Watch',
    field: 'price',
    local_value: 249.99,
    remote_value: 239.99,
    local_timestamp: '2024-01-15T09:30:00Z',
    remote_timestamp: '2024-01-15T09:45:00Z'
  },
  {
    Id: 2,
    product_id: 5,
    product_name: 'Bluetooth Speaker',
    field: 'inventory',
    local_value: 2,
    remote_value: 5,
    local_timestamp: '2024-01-15T08:15:00Z',
    remote_timestamp: '2024-01-15T08:20:00Z'
  }
]

const mockSyncHistory = [
  {
    Id: 1,
    operation: 'Full Sync',
    description: 'Complete synchronization with Shopify',
    status: 'synced',
    products_affected: 127,
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    Id: 2,
    operation: 'Partial Sync',
    description: 'Updated product prices from Google Sheets',
    status: 'synced',
    products_affected: 45,
    timestamp: '2024-01-15T09:15:00Z'
  },
  {
    Id: 3,
    operation: 'Image Sync',
    description: 'Downloaded vendor images for new products',
    status: 'error',
    products_affected: 12,
    timestamp: '2024-01-15T08:45:00Z'
  },
  {
    Id: 4,
    operation: 'Inventory Update',
    description: 'Updated stock levels from warehouse system',
    status: 'synced',
    products_affected: 234,
    timestamp: '2024-01-15T07:30:00Z'
  }
]

let conflicts = [...mockConflicts]
let syncHistory = [...mockSyncHistory]

export const getConflicts = async () => {
  await delay()
  return [...conflicts]
}

export const getSyncHistory = async () => {
  await delay()
  return [...syncHistory]
}

export const resolveConflict = async (conflictId, resolution) => {
  await delay()
  const index = conflicts.findIndex(c => c.Id === parseInt(conflictId))
  if (index === -1) {
    throw new Error('Conflict not found')
  }
  
  // Remove the resolved conflict
  conflicts.splice(index, 1)
  
  // Add to sync history
  const newHistoryEntry = {
    Id: Math.max(...syncHistory.map(s => s.Id)) + 1,
    operation: 'Conflict Resolution',
    description: `Resolved conflict using ${resolution} value`,
    status: 'synced',
    products_affected: 1,
    timestamp: new Date().toISOString()
  }
  syncHistory.unshift(newHistoryEntry)
  
  return { success: true }
}

export const triggerFullSync = async () => {
  await delay()
  
  const newHistoryEntry = {
    Id: Math.max(...syncHistory.map(s => s.Id)) + 1,
    operation: 'Full Sync',
    description: 'Manual full synchronization initiated',
    status: 'pending',
    products_affected: 0,
    timestamp: new Date().toISOString()
  }
  syncHistory.unshift(newHistoryEntry)
  
  return { success: true }
}