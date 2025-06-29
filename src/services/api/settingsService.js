const delay = () => new Promise(resolve => setTimeout(resolve, 300))

const mockSettings = {
  general: {
    storeName: 'FlowMerch Demo Store',
    storeUrl: 'https://demo-store.myshopify.com',
    currency: 'USD',
    timezone: 'America/New_York'
  },
  sync: {
    interval: 30,
    batchSize: 100,
    autoSync: true,
    autoResolveConflicts: false,
    syncImages: true
  },
  integrations: {
    shopify: {
      storeUrl: 'demo-store.myshopify.com',
      accessToken: '***************',
      connected: true
    },
    googleSheets: {
      connected: false,
      clientId: '',
      clientSecret: ''
    }
  },
  notifications: {
    syncComplete: true,
    syncErrors: true,
    lowInventory: false,
    conflictAlerts: true
  },
  security: {
    rateLimiting: true,
    auditLogging: true,
    dataEncryption: true
  }
}

let settings = { ...mockSettings }

export const getSettings = async () => {
  await delay()
  return { ...settings }
}

export const updateSettings = async (section, updates) => {
  await delay()
  settings[section] = { ...settings[section], ...updates }
  return { ...settings }
}

export const testConnection = async (integration) => {
  await delay()
  
  // Simulate connection test
  if (integration === 'Shopify') {
    if (!settings.integrations.shopify.storeUrl || !settings.integrations.shopify.accessToken) {
      throw new Error('Missing Shopify credentials')
    }
    return { success: true, message: 'Connection successful' }
  }
  
  if (integration === 'Google Sheets') {
    if (!settings.integrations.googleSheets.connected) {
      throw new Error('Google Sheets not connected')
    }
    return { success: true, message: 'Connection successful' }
  }
  
  throw new Error('Unknown integration')
}

export const resetSettings = async () => {
  await delay()
  settings = { ...mockSettings }
  return { ...settings }
}