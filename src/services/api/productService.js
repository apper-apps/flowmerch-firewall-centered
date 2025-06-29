const delay = () => new Promise(resolve => setTimeout(resolve, 350))

const mockProducts = [
  {
    Id: 1,
    shopify_id: 'prod_123456789',
    name: 'Wireless Bluetooth Headphones',
    description_html: '<p>Premium wireless headphones with noise cancellation</p>',
    msrp: 199.99,
    cost: 89.50,
    price: 149.99,
    inventory: 45,
    last_synced: '2024-01-15T10:30:00Z',
    sync_status: 'synced'
  },
  {
    Id: 2,
    shopify_id: 'prod_987654321',
    name: 'Smart Fitness Watch',
    description_html: '<p>Track your fitness with advanced health monitoring</p>',
    msrp: 299.99,
    cost: 145.00,
    price: 249.99,
    inventory: 8,
    last_synced: '2024-01-15T09:45:00Z',
    sync_status: 'conflict'
  },
  {
    Id: 3,
    shopify_id: 'prod_456789123',
    name: 'Portable Power Bank',
    description_html: '<p>High-capacity power bank for all devices</p>',
    msrp: 79.99,
    cost: 35.00,
    price: 59.99,
    inventory: 123,
    last_synced: '2024-01-15T11:15:00Z',
    sync_status: 'synced'
  },
  {
    Id: 4,
    shopify_id: 'prod_789123456',
    name: 'Wireless Charging Pad',
    description_html: '<p>Fast wireless charging for compatible devices</p>',
    msrp: 49.99,
    cost: 22.50,
    price: 39.99,
    inventory: 67,
    last_synced: null,
    sync_status: 'pending'
  },
  {
    Id: 5,
    shopify_id: 'prod_321654987',
    name: 'Bluetooth Speaker',
    description_html: '<p>Portable speaker with rich, room-filling sound</p>',
    msrp: 129.99,
    cost: 58.00,
    price: 99.99,
    inventory: 2,
    last_synced: '2024-01-15T08:20:00Z',
    sync_status: 'error'
  },
  {
    Id: 6,
    shopify_id: 'prod_654987321',
    name: 'USB-C Hub',
    description_html: '<p>Multi-port hub for modern laptops</p>',
    msrp: 89.99,
    cost: 41.00,
    price: 69.99,
    inventory: 89,
    last_synced: '2024-01-15T10:45:00Z',
    sync_status: 'synced'
  }
]

let products = [...mockProducts]

export const getAll = async () => {
  await delay()
  return [...products]
}

export const getById = async (id) => {
  await delay()
  const product = products.find(p => p.Id === parseInt(id))
  if (!product) {
    throw new Error('Product not found')
  }
  return { ...product }
}

export const create = async (productData) => {
  await delay()
  const newProduct = {
    ...productData,
    Id: Math.max(...products.map(p => p.Id)) + 1,
    last_synced: new Date().toISOString(),
    sync_status: 'synced'
  }
  products.push(newProduct)
  return { ...newProduct }
}

export const update = async (id, updates) => {
  await delay()
  const index = products.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    last_synced: new Date().toISOString()
  }
  
  return { ...products[index] }
}

export const delete_ = async (id) => {
  await delay()
  const index = products.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products.splice(index, 1)
  return { success: true }
}

export const bulkSync = async (productIds) => {
  await delay()
  productIds.forEach(id => {
    const index = products.findIndex(p => p.Id === parseInt(id))
    if (index !== -1) {
      products[index].last_synced = new Date().toISOString()
      products[index].sync_status = 'synced'
    }
  })
  return { success: true, synced: productIds.length }
}