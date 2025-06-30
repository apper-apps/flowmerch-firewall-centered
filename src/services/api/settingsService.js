const delay = () => new Promise(resolve => setTimeout(resolve, 300))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const getSettings = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "general" } },
        { field: { Name: "sync" } },
        { field: { Name: "integrations" } },
        { field: { Name: "notifications" } },
        { field: { Name: "security" } }
      ],
      pagingInfo: { limit: 1, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('settings', params)
    
if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    // If no settings exist, return default structure
    if (!response.data || response.data.length === 0) {
      return {
        general: JSON.stringify({
          storeName: 'FlowMerch Demo Store',
          storeUrl: 'https://demo-store.myshopify.com',
          currency: 'USD',
          timezone: 'America/New_York'
        }),
        sync: JSON.stringify({
          interval: 30,
          batchSize: 100,
          autoSync: true,
          autoResolveConflicts: false,
          syncImages: true
        }),
        integrations: JSON.stringify({
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
        }),
        notifications: JSON.stringify({
          syncComplete: true,
          syncErrors: true,
          lowInventory: false,
          conflictAlerts: true
        }),
        security: JSON.stringify({
          rateLimiting: true,
          auditLogging: true,
          dataEncryption: true
        })
      }
    }
    
    const settingsData = response.data[0]
    return {
      general: settingsData.general ? JSON.parse(settingsData.general) : {},
      sync: settingsData.sync ? JSON.parse(settingsData.sync) : {},
      integrations: settingsData.integrations ? JSON.parse(settingsData.integrations) : {},
      notifications: settingsData.notifications ? JSON.parse(settingsData.notifications) : {},
      security: settingsData.security ? JSON.parse(settingsData.security) : {}
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw error
  }
}

export const updateSettings = async (section, updates) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    // Get current settings first
    const currentSettings = await getSettings()
    currentSettings[section] = { ...currentSettings[section], ...updates }
    
    // Check if settings record exists
    const checkParams = {
      fields: [{ field: { Name: "Name" } }],
      pagingInfo: { limit: 1, offset: 0 }
    }
    
    const checkResponse = await apperClient.fetchRecords('settings', checkParams)
    
    const settingsData = {
      Name: 'Application Settings',
      general: JSON.stringify(currentSettings.general),
      sync: JSON.stringify(currentSettings.sync),
      integrations: JSON.stringify(currentSettings.integrations),
      notifications: JSON.stringify(currentSettings.notifications),
      security: JSON.stringify(currentSettings.security)
    }
    
    let response
    if (!checkResponse.success || !checkResponse.data || checkResponse.data.length === 0) {
      // Create new settings record
      const params = { records: [settingsData] }
      response = await apperClient.createRecord('settings', params)
    } else {
      // Update existing settings record
      const settingsId = checkResponse.data[0].Id
      const params = { records: [{ Id: settingsId, ...settingsData }] }
      response = await apperClient.updateRecord('settings', params)
    }
    
if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return currentSettings
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}

export const testConnection = async (integration) => {
  try {
    await delay()
    
    const settings = await getSettings()
    
    // Simulate connection test
    if (integration === 'Shopify') {
      if (!settings.integrations?.shopify?.storeUrl || !settings.integrations?.shopify?.accessToken) {
        throw new Error('Missing Shopify credentials')
      }
      return { success: true, message: 'Connection successful' }
    }
    
    if (integration === 'Google Sheets') {
      if (!settings.integrations?.googleSheets?.connected) {
        throw new Error('Google Sheets not connected')
      }
      return { success: true, message: 'Connection successful' }
    }
    
    throw new Error('Unknown integration')
  } catch (error) {
    console.error('Error testing connection:', error)
    throw error
  }
}

export const resetSettings = async () => {
  try {
    await delay()
    
    const defaultSettings = {
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
    
    // Update each section
    for (const [section, data] of Object.entries(defaultSettings)) {
      await updateSettings(section, data)
    }
    
    return defaultSettings
  } catch (error) {
    console.error('Error resetting settings:', error)
    throw error
  }
}