const delay = () => new Promise(resolve => setTimeout(resolve, 350))

const mockCollections = [
  {
    Id: 1,
    name: 'Electronics',
    description: 'All electronic products including headphones, speakers, and accessories',
    template: '',
    rules: [
      { type: 'tag', operator: 'contains', value: 'electronics' },
      { type: 'price', operator: 'greater_than', value: 50 }
    ],
    auto_update: true,
    active: true,
    product_count: 156,
    last_updated: '2024-01-15T10:30:00Z'
  },
  {
    Id: 2,
    name: 'Best Sellers',
    description: 'Top performing products based on sales data',
    template: 'bestseller',
    rules: [
      { type: 'inventory', operator: 'less_than', value: 20 }
    ],
    auto_update: true,
    active: true,
    product_count: 42,
    last_updated: '2024-01-15T09:15:00Z'
  },
  {
    Id: 3,
    name: 'Premium Collection',
    description: 'High-end products with premium pricing',
    template: '',
    rules: [
      { type: 'price', operator: 'greater_than', value: 200 }
    ],
    auto_update: false,
    active: false,
    product_count: 23,
    last_updated: '2024-01-14T16:45:00Z'
  }
]

const mockTemplates = [
  {
    Id: 1,
    name: 'Modern Grid',
    description: 'Clean grid layout with hover effects',
    category: 'Layout'
  },
  {
    Id: 2,
    name: 'Featured Carousel',
    description: 'Rotating carousel for featured products',
    category: 'Interactive'
  },
  {
    Id: 3,
    name: 'List View',
    description: 'Detailed list with product specifications',
    category: 'Detailed'
  }
]

let collections = [...mockCollections]
let templates = [...mockTemplates]

export const getAll = async () => {
  await delay()
  return [...collections]
}

export const getById = async (id) => {
  await delay()
  const collection = collections.find(c => c.Id === parseInt(id))
  if (!collection) {
    throw new Error('Collection not found')
  }
  return { ...collection }
}

export const getTemplates = async () => {
  await delay()
  return [...templates]
}

export const create = async (collectionData) => {
  await delay()
  const newCollection = {
    ...collectionData,
    Id: Math.max(...collections.map(c => c.Id)) + 1,
    product_count: 0,
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
  collections.push(newCollection)
  return { ...newCollection }
}

export const update = async (id, updates) => {
  await delay()
  const index = collections.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Collection not found')
  }
  
  collections[index] = {
    ...collections[index],
    ...updates,
    last_updated: new Date().toISOString()
  }
  return { ...collections[index] }
}

export const delete_ = async (id) => {
  await delay()
  const index = collections.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Collection not found')
  }
  
  collections.splice(index, 1)
  return { success: true }
}

// Export as 'delete' for convenience
export { delete_ as delete }