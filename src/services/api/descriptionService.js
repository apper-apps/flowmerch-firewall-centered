import axios from 'axios'
import { convert } from 'html-to-text'

const delay = () => new Promise(resolve => setTimeout(resolve, 300))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const getProducts = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "shopify_id" } },
        { field: { Name: "description_html" } },
        { field: { Name: "price" } },
        { field: { Name: "msrp" } },
        { field: { Name: "inventory" } },
        { field: { Name: "image_urls" } }
      ],
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    }
    
    const response = await apperClient.fetchRecords('product', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getTemplates = async () => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "description" } },
        { field: { Name: "category" } },
        { field: { Name: "content" } },
        { field: { Name: "llm_prompt" } }
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

export const updateDescription = async (productId, description) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const filteredUpdates = {
      Id: parseInt(productId),
      description_html: description
    }
    
    const params = { records: [filteredUpdates] }
    const response = await apperClient.updateRecord('product', params)
    
    if (!response.success) {
      console.error(response.message)
      throw new Error(response.message)
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success)
      const failedRecords = response.results.filter(result => !result.success)
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        throw new Error('Failed to update product description')
      }
      
      return successfulRecords[0]?.data
    }
  } catch (error) {
    console.error('Error updating description:', error)
    throw error
  }
}

export const createTemplate = async (templateData) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const filteredData = {
      Name: templateData.name || templateData.Name,
      description: templateData.description,
      category: templateData.category,
      content: templateData.content,
      llm_prompt: templateData.llm_prompt
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
        throw new Error('Failed to create template')
      }
      
      return successfulRecords[0]?.data
    }
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

export const updateTemplate = async (templateId, updates) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const filteredUpdates = {
      Id: parseInt(templateId),
      ...(updates.name && { Name: updates.name }),
      ...(updates.Name && { Name: updates.Name }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.category && { category: updates.category }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.llm_prompt !== undefined && { llm_prompt: updates.llm_prompt })
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
        throw new Error('Failed to update template')
      }
      
      return successfulRecords[0]?.data
    }
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}

export const deleteTemplate = async (templateId) => {
  try {
    await delay()
    const apperClient = getApperClient()
    
    const params = { RecordIds: [parseInt(templateId)] }
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

export const generateDescription = async ({ product, template, customPrompt, provider, settings }) => {
  await delay()
  
  try {
    // Extract images from product
    const images = extractProductImages(product)
    
    // Build the generation prompt
    const basePrompt = customPrompt || template?.llm_prompt || 'Create a compelling product description for this product.'
    const enhancedPrompt = enhancePromptWithProductData(basePrompt, product, images)
    
    // Generate description based on provider
    let generatedContent
    switch (provider) {
      case 'openai':
        generatedContent = await generateWithOpenAI(enhancedPrompt, settings)
        break
      case 'anthropic':
        generatedContent = await generateWithClaude(enhancedPrompt, settings)
        break
      case 'openrouter':
        generatedContent = await generateWithOpenRouter(enhancedPrompt, settings)
        break
      default:
        throw new Error('Unsupported LLM provider')
    }
    
    // Enhance content with images
    const finalContent = integrateImagesIntoContent(generatedContent, images)
    
    return {
      html: finalContent,
      prompt: enhancedPrompt,
      images: images,
      provider: provider,
      model: settings.model
    }
  } catch (error) {
    console.error('LLM generation error:', error)
    throw new Error(`Failed to generate description: ${error.message}`)
  }
}

const extractProductImages = (product) => {
  const images = []
  
  // Extract from product image_urls field
  if (product.image_urls && Array.isArray(product.image_urls)) {
    images.push(...product.image_urls)
  }
  
  // Extract from description HTML if any
  if (product.description_html) {
    const imgMatches = product.description_html.match(/<img[^>]+src="([^"]+)"/g)
    if (imgMatches) {
      imgMatches.forEach(match => {
        const src = match.match(/src="([^"]+)"/)?.[1]
        if (src && !images.includes(src)) {
          images.push(src)
        }
      })
    }
  }
  
  // Simulate vendor image extraction (placeholder for real implementation)
  if (images.length === 0) {
    images.push(
      `https://images.unsplash.com/800x600/?${product.Name?.toLowerCase().replace(/\s+/g, ',')}`,
      `https://images.unsplash.com/400x400/?${product.Name?.toLowerCase().replace(/\s+/g, ',')}`,
    )
  }
  
  return images.slice(0, 5) // Limit to 5 images max
}

const enhancePromptWithProductData = (basePrompt, product, images) => {
  let enhancedPrompt = basePrompt
    .replace(/\[PRODUCT_NAME\]/g, product.Name || 'this product')
    .replace(/\[PRODUCT_FEATURES\]/g, generateProductFeatures(product))
    .replace(/\[IMAGES\]/g, images.length > 0 ? `Product images available: ${images.join(', ')}` : 'No product images available')
  
  // Add product context
  enhancedPrompt += `\n\nProduct Details:
- Name: ${product.Name}
- Price: $${product.price}
- MSRP: $${product.msrp}
- Current Description: ${product.description_html ? convert(product.description_html, { wordwrap: false }) : 'No description'}
- Images: ${images.length} available

Generate a compelling, sales-focused HTML description that highlights the product's value proposition and encourages purchases. Format as clean HTML with proper structure.`

  return enhancedPrompt
}

const generateProductFeatures = (product) => {
  const features = []
  
  if (product.price && product.msrp && product.price < product.msrp) {
    const savings = ((product.msrp - product.price) / product.msrp * 100).toFixed(0)
    features.push(`${savings}% savings off MSRP`)
  }
  
  if (product.inventory) {
    if (product.inventory < 10) {
      features.push('Limited stock available')
    } else if (product.inventory > 100) {
      features.push('In stock and ready to ship')
    }
  }
  
  // Add generic features if none specific
  if (features.length === 0) {
    features.push('High quality construction', 'Excellent value', 'Customer satisfaction guaranteed')
  }
  
  return features.join(', ')
}

const generateWithOpenAI = async (prompt, settings) => {
  // Simulate API call - in real implementation, use OpenAI API
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return `<div class="product-description">
    <h2>🔥 ${prompt.includes('LIMITED TIME') ? 'FLASH SALE - ' : ''}Premium Quality Product</h2>
    <p><strong>Transform your experience with this exceptional product that delivers outstanding results.</strong></p>
    
    <h3>✨ Key Benefits:</h3>
    <ul>
      <li>✅ Superior performance and reliability</li>
      <li>✅ Premium materials and construction</li>
      <li>✅ Excellent value for money</li>
      <li>✅ Satisfaction guaranteed</li>
    </ul>
    
    <h3>💎 Why Choose This Product:</h3>
    <p>This isn't just another product - it's a game-changer that will exceed your expectations. With attention to every detail and commitment to quality, you're making an investment in excellence.</p>
    
    <div class="highlight-box" style="background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
      <p><strong>🎯 Perfect for:</strong> Anyone who values quality, reliability, and exceptional performance.</p>
    </div>
    
    <p><em>Join thousands of satisfied customers who have made the smart choice. Order now and experience the difference!</em></p>
  </div>`
}

const generateWithClaude = async (prompt, settings) => {
  // Simulate API call - in real implementation, use Anthropic API
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  return `<div class="product-description">
    <h2>Discover Excellence</h2>
    
    <p>In a world full of ordinary products, this stands apart as something truly exceptional. Carefully crafted with attention to every detail, it represents the perfect balance of form, function, and value.</p>
    
    <h3>What Makes This Special:</h3>
    <div style="display: grid; gap: 15px; margin: 20px 0;">
      <div style="padding: 15px; border: 1px solid #e1e5e9; border-radius: 8px;">
        <h4>🏆 Premium Quality</h4>
        <p>Built to last with the finest materials and meticulous attention to detail.</p>
      </div>
      <div style="padding: 15px; border: 1px solid #e1e5e9; border-radius: 8px;">
        <h4>⚡ Outstanding Performance</h4>
        <p>Engineered to exceed expectations and deliver consistent, reliable results.</p>
      </div>
      <div style="padding: 15px; border: 1px solid #e1e5e9; border-radius: 8px;">
        <h4>💝 Exceptional Value</h4>
        <p>An investment that pays dividends in satisfaction, performance, and longevity.</p>
      </div>
    </div>
    
    <h3>The Promise:</h3>
    <p>We believe in this product so completely that we stand behind it with our full guarantee. Your satisfaction isn't just our goal—it's our commitment.</p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
      <p style="margin: 0; font-size: 18px;"><strong>Ready to experience the difference? Your journey to excellence starts here.</strong></p>
    </div>
  </div>`
}

const generateWithOpenRouter = async (prompt, settings) => {
  // Simulate API call - in real implementation, use OpenRouter API
  await new Promise(resolve => setTimeout(resolve, 1800))
  
  return `<div class="product-description">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 10px;">🌟 Game-Changing Innovation</h1>
      <p style="font-size: 18px; color: #4a5568;"><em>Where cutting-edge technology meets exceptional design</em></p>
    </div>
    
    <div style="background: linear-gradient(to right, #f7fafc, #edf2f7); padding: 25px; border-radius: 12px; margin: 20px 0;">
      <h2 style="color: #2b6cb0; margin-bottom: 15px;">🚀 Revolutionary Features</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div>
          <h4>⚡ Lightning Performance</h4>
          <p>Experience unmatched speed and efficiency that transforms how you work and play.</p>
        </div>
        <div>
          <h4>🎯 Precision Engineering</h4>
          <p>Every component meticulously designed and tested for optimal performance and durability.</p>
        </div>
        <div>
          <h4>💎 Premium Build Quality</h4>
          <p>Crafted from the finest materials with attention to every detail, inside and out.</p>
        </div>
        <div>
          <h4>🔒 Trusted Reliability</h4>
          <p>Built to exceed industry standards with comprehensive quality assurance.</p>
        </div>
      </div>
    </div>
    
    <div style="border: 3px solid #48bb78; border-radius: 10px; padding: 20px; margin: 25px 0; background: #f0fff4;">
      <h3 style="color: #2f855a; margin-bottom: 10px;">🎁 Exclusive Benefits</h3>
      <ul style="color: #2f855a; font-weight: 500;">
        <li>✅ 30-day money-back guarantee</li>
        <li>✅ Free shipping and handling</li>
        <li>✅ Priority customer support</li>
        <li>✅ Extended warranty protection</li>
      </ul>
    </div>
    
    <div style="text-align: center; background: #1a202c; color: white; padding: 30px; border-radius: 10px; margin: 30px 0;">
      <h3 style="color: #ffd700; margin-bottom: 15px;">⭐ Join Over 50,000 Satisfied Customers</h3>
      <p style="font-size: 16px; margin-bottom: 20px;">"This product has completely transformed my daily routine. I can't imagine going back to the old way of doing things!" - Sarah M.</p>
      <div style="background: #e53e3e; padding: 12px 25px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
        🔥 LIMITED TIME: Special Launch Pricing
      </div>
    </div>
  </div>`
}

const integrateImagesIntoContent = (content, images) => {
  if (images.length === 0) return content
  
  // Insert first image after the first paragraph
  let enhancedContent = content
  const firstParagraphEnd = content.indexOf('</p>')
  
  if (firstParagraphEnd !== -1 && images[0]) {
    const imageHtml = `\n    <div style="text-align: center; margin: 20px 0;">
      <img src="${images[0]}" alt="Product showcase" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    </div>`
    
    enhancedContent = content.slice(0, firstParagraphEnd + 4) + imageHtml + content.slice(firstParagraphEnd + 4)
  }
  
  // Add image gallery at the end if multiple images
  if (images.length > 1) {
    const galleryHtml = `
    <div style="margin-top: 30px;">
      <h4>📸 Product Gallery</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 15px 0;">
        ${images.slice(1, 4).map(img => `<img src="${img}" alt="Product view" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />`).join('')}
      </div>
    </div>`
    
    enhancedContent += galleryHtml
  }
  
  return enhancedContent
}