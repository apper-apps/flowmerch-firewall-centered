const delay = () => new Promise(resolve => setTimeout(resolve, 350))

const mockWidgets = [
  {
    Id: 1,
    name: 'Holiday Sale Countdown',
    type: 'countdown',
    settings: {
      endDate: '2024-12-25T23:59:59Z',
      displayText: 'Holiday Sale Ends Soon!',
      theme: 'red'
    },
    placement: 'product-page',
    active: true,
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    Id: 2,
    name: 'Low Stock Alert',
    type: 'scarcity',
    settings: {
      threshold: 10,
      message: 'Only {stock} left in stock!',
      showWhenZero: false
    },
    placement: 'product-page',
    active: true,
    created_at: '2024-01-12T14:30:00Z'
  },
  {
    Id: 3,
    name: 'Newsletter Signup',
    type: 'form',
    settings: {
      title: 'Get 10% Off Your First Order',
      description: 'Subscribe to our newsletter for exclusive deals',
      discount: 10
    },
    placement: 'cart-page',
    active: false,
    created_at: '2024-01-14T09:15:00Z'
  }
]

let widgets = [...mockWidgets]

export const getAll = async () => {
  await delay()
  return [...widgets]
}

export const getById = async (id) => {
  await delay()
  const widget = widgets.find(w => w.Id === parseInt(id))
  if (!widget) {
    throw new Error('Widget not found')
  }
  return { ...widget }
}

export const create = async (widgetData) => {
  await delay()
  const newWidget = {
    ...widgetData,
    Id: Math.max(...widgets.map(w => w.Id)) + 1,
    created_at: new Date().toISOString()
  }
  widgets.push(newWidget)
  return { ...newWidget }
}

export const update = async (id, updates) => {
  await delay()
  const index = widgets.findIndex(w => w.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Widget not found')
  }
  
  widgets[index] = {
    ...widgets[index],
    ...updates,
    updated_at: new Date().toISOString()
  }
  return { ...widgets[index] }
}

export const delete_ = async (id) => {
  await delay()
  const index = widgets.findIndex(w => w.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Widget not found')
  }
  
  widgets.splice(index, 1)
  return { success: true }
}

// Export as 'delete' for convenience but keep the actual export as 'delete_'
export { delete_ as delete }