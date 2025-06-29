const delay = () => new Promise(resolve => setTimeout(resolve, 300))

export const getStats = async () => {
  await delay()
  return {
    totalProducts: 2847,
    syncedToday: 156,
    pendingConflicts: 8,
    revenueImpact: 47250
  }
}

export const getRecentActivity = async () => {
  await delay()
  return [
    {
      Id: 1,
      type: 'sync',
      title: 'Products synchronized',
      description: '127 products updated from Shopify',
      timestamp: '2 minutes ago'
    },
    {
      Id: 2,
      type: 'conflict',
      title: 'Sync conflict detected',
      description: 'Price mismatch for "Wireless Headphones"',
      timestamp: '15 minutes ago'
    },
    {
      Id: 3,
      type: 'success',
      title: 'Bundle created',
      description: 'New bundle "Summer Collection" created',
      timestamp: '1 hour ago'
    },
    {
      Id: 4,
      type: 'sync',
      title: 'Google Sheets import',
      description: '45 products imported from vendor sheet',
      timestamp: '2 hours ago'
    },
    {
      Id: 5,
      type: 'success',
      title: 'Widget activated',
      description: 'Countdown timer widget activated',
      timestamp: '3 hours ago'
    }
  ]
}