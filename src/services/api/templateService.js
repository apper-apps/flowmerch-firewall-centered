import mockTemplates from '@/services/mockData/templates'

let templates = [...mockTemplates]
let nextId = Math.max(...templates.map(t => t.Id)) + 1

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getAll = async () => {
  await delay(500)
  return [...templates]
}

export const getById = async (id) => {
  await delay(300)
  const template = templates.find(t => t.Id === parseInt(id))
  if (!template) {
    throw new Error('Template not found')
  }
  return { ...template }
}

export const create = async (templateData) => {
  await delay(600)
  
  const newTemplate = {
    ...templateData,
    Id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  templates.push(newTemplate)
  return { ...newTemplate }
}

export const update = async (id, updates) => {
  await delay(500)
  
  const index = templates.findIndex(t => t.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates[index] = {
    ...templates[index],
    ...updates,
    Id: templates[index].Id, // Preserve original ID
    updatedAt: new Date().toISOString()
  }
  
  return { ...templates[index] }
}

export const delete_ = async (id) => {
  await delay(400)
  
  const index = templates.findIndex(t => t.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates.splice(index, 1)
  return { success: true }
}

export { delete_ as delete }