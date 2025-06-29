const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
    await delay(500)
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "content" } },
        { field: { Name: "llm_prompt" } },
        { field: { Name: "sections" } },
        { field: { Name: "placeholders" } },
        { field: { Name: "formatting" } },
        { field: { Name: "is_active" } }
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

export const getById = async (id) => {
  try {
    await delay(300)
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "content" } },
        { field: { Name: "llm_prompt" } },
        { field: { Name: "sections" } },
        { field: { Name: "placeholders" } },
        { field: { Name: "formatting" } },
        { field: { Name: "is_active" } }
      ]
    }
    
    const response = await apperClient.getRecordById('template', parseInt(id), params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error)
    throw error
  }
}

export const create = async (templateData) => {
  try {
    await delay(600)
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredData = {
      Name: templateData.name || templateData.Name,
      Tags: templateData.Tags || '',
      Owner: templateData.Owner ? parseInt(templateData.Owner) : null,
      description: templateData.description,
      category: templateData.category,
      content: templateData.content || '',
      llm_prompt: templateData.llm_prompt || '',
      sections: JSON.stringify(templateData.sections || []),
      placeholders: JSON.stringify(templateData.placeholders || []),
      formatting: JSON.stringify(templateData.formatting || {}),
      is_active: templateData.isActive !== undefined ? templateData.isActive : true
    }
    
    const params = { records: [filteredData] }
    const response = await apperClient.createRecord('template', params)
    
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
    console.error('Error creating template:', error)
    throw error
  }
}

export const update = async (id, updates) => {
  try {
    await delay(500)
    const apperClient = getApperClient()
    
    // Only include Updateable fields
    const filteredUpdates = {
      Id: parseInt(id),
      ...(updates.name && { Name: updates.name }),
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.Tags && { Tags: updates.Tags }),
      ...(updates.Owner && { Owner: parseInt(updates.Owner) }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.category && { category: updates.category }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.llm_prompt !== undefined && { llm_prompt: updates.llm_prompt }),
      ...(updates.sections && { sections: JSON.stringify(updates.sections) }),
      ...(updates.placeholders && { placeholders: JSON.stringify(updates.placeholders) }),
      ...(updates.formatting && { formatting: JSON.stringify(updates.formatting) }),
      ...(updates.isActive !== undefined && { is_active: updates.isActive }),
      ...(updates.is_active !== undefined && { is_active: updates.is_active })
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('template', params)
    
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
    console.error('Error updating template:', error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    await delay(400)
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(id)] }
    const response = await apperClient.deleteRecord('template', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting template:', error)
    throw error
  }
}

export { delete_ as delete }