const delay = () => new Promise(resolve => setTimeout(resolve, 400))

const mockBundles = [
  {
    Id: 1,
    name: 'Tech Essentials Bundle',
    products: [
      { Id: 1, name: 'Wireless Bluetooth Headphones', price: 149.99, quantity: 1 },
      { Id: 3, name: 'Portable Power Bank', price: 59.99, quantity: 1 },
      { Id: 4, name: 'Wireless Charging Pad', price: 39.99, quantity: 1 }
    ],
    pricing_rule: { type: 'discount', value: 15 },
    final_price: 212.48,
    active: true,
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    Id: 2,
    name: 'Audio Lover\'s Pack',
    products: [
      { Id: 1, name: 'Wireless Bluetooth Headphones', price: 149.99, quantity: 1 },
      { Id: 5, name: 'Bluetooth Speaker', price: 99.99, quantity: 1 }
    ],
    pricing_rule: { type: 'fixed', value: 30 },
    final_price: 219.98,
    active: true,
    created_at: '2024-01-12T14:30:00Z'
  },
  {
    Id: 3,
    name: 'Starter Kit',
    products: [
      { Id: 3, name: 'Portable Power Bank', price: 59.99, quantity: 2 },
      { Id: 6, name: 'USB-C Hub', price: 69.99, quantity: 1 }
    ],
    pricing_rule: { type: 'discount', value: 10 },
    final_price: 170.96,
    active: false,
    created_at: '2024-01-14T09:15:00Z'
  }
]

let bundles = [...mockBundles]

export const getAll = async () => {
  await delay()
  return [...bundles]
}

export const getById = async (id) => {
  await delay()
  const bundle = bundles.find(b => b.Id === parseInt(id))
  if (!bundle) {
    throw new Error('Bundle not found')
  }
  return { ...bundle }
}

export const create = async (bundleData) => {
  await delay()
  
  // Calculate final price
  const totalPrice = bundleData.products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  )
  
  let finalPrice = totalPrice
  if (bundleData.pricing_rule.type === 'discount') {
    finalPrice = totalPrice * (1 - bundleData.pricing_rule.value / 100)
  } else if (bundleData.pricing_rule.type === 'fixed') {
    finalPrice = Math.max(0, totalPrice - bundleData.pricing_rule.value)
  }
  
  const newBundle = {
    ...bundleData,
    Id: Math.max(...bundles.map(b => b.Id)) + 1,
    final_price: finalPrice,
    created_at: new Date().toISOString()
  }
  
  bundles.push(newBundle)
  return { ...newBundle }
}

export const update = async (id, updates) => {
  await delay()
  const index = bundles.findIndex(b => b.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Bundle not found')
  }
  
  bundles[index] = {
    ...bundles[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  return { ...bundles[index] }
}

export const delete_ = async (id) => {
  await delay()
  const index = bundles.findIndex(b => b.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Bundle not found')
  }
  
  bundles.splice(index, 1)
  return { success: true }
}

// Export as 'delete' for convenience
export { delete_ as delete }