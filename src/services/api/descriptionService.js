const delay = () => new Promise(resolve => setTimeout(resolve, 300))

const mockProducts = [
  {
    Id: 1,
    shopify_id: 'prod_123456789',
    name: 'Wireless Bluetooth Headphones',
    description_html: '<div class="product-description"><h3>Premium Audio Experience</h3><p>Experience crystal-clear sound with our premium wireless headphones featuring advanced noise cancellation technology.</p><ul><li>Active noise cancellation</li><li>30-hour battery life</li><li>Quick charge technology</li><li>Premium comfort padding</li></ul></div>'
  },
  {
    Id: 2,
    shopify_id: 'prod_987654321',
    name: 'Smart Fitness Watch',
    description_html: '<div class="product-description"><h3>Your Health Companion</h3><p>Track your fitness journey with advanced health monitoring and smart notifications.</p></div>'
  },
  {
    Id: 3,
    shopify_id: 'prod_456789123',
    name: 'Portable Power Bank',
    description_html: '<div class="product-description"><h3>Power On The Go</h3><p>Never run out of battery with our high-capacity portable power bank.</p></div>'
  },
  {
    Id: 4,
    shopify_id: 'prod_789123456',
    name: 'Wireless Charging Pad',
    description_html: ''
  },
  {
    Id: 5,
    shopify_id: 'prod_321654987',
    name: 'Bluetooth Speaker',
    description_html: ''
  }
]

const mockTemplates = [
  {
    Id: 1,
    name: 'Electronics Template',
    description: 'Professional template for electronic products',
    category: 'Electronics',
    content: '<div class="product-description"><h3>Premium Quality Electronics</h3><p>[PRODUCT_NAME] delivers exceptional performance and reliability.</p><h4>Key Features:</h4><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul><h4>Specifications:</h4><p>Add your product specifications here.</p></div>'
  },
  {
    Id: 2,
    name: 'Fashion Template',
    description: 'Stylish template for fashion items',
    category: 'Fashion',
    content: '<div class="product-description"><h3>Style Meets Comfort</h3><p>Discover the perfect blend of style and comfort with [PRODUCT_NAME].</p><h4>Features:</h4><ul><li>Premium materials</li><li>Modern design</li><li>Perfect fit</li></ul></div>'
  },
  {
    Id: 3,
    name: 'Home & Garden Template',
    description: 'Perfect for home and garden products',
    category: 'Home & Garden',
    content: '<div class="product-description"><h3>Transform Your Space</h3><p>Enhance your home with [PRODUCT_NAME].</p><h4>Benefits:</h4><ul><li>Easy to use</li><li>Durable construction</li><li>Great value</li></ul></div>'
  }
]

let products = [...mockProducts]
let templates = [...mockTemplates]

export const getProducts = async () => {
  await delay()
  return [...products]
}

export const getTemplates = async () => {
  await delay()
  return [...templates]
}

export const updateDescription = async (productId, description) => {
  await delay()
  const index = products.findIndex(p => p.Id === parseInt(productId))
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products[index].description_html = description
  return { ...products[index] }
}

export const createTemplate = async (templateData) => {
  await delay()
  const newTemplate = {
    ...templateData,
    Id: Math.max(...templates.map(t => t.Id)) + 1
  }
  templates.push(newTemplate)
  return { ...newTemplate }
}

export const updateTemplate = async (templateId, updates) => {
  await delay()
  const index = templates.findIndex(t => t.Id === parseInt(templateId))
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates[index] = { ...templates[index], ...updates }
  return { ...templates[index] }
}

export const deleteTemplate = async (templateId) => {
  await delay()
  const index = templates.findIndex(t => t.Id === parseInt(templateId))
  if (index === -1) {
    throw new Error('Template not found')
  }
  
  templates.splice(index, 1)
  return { success: true }
}