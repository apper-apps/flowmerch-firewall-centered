const mockTemplates = [
  {
    Id: 1,
    name: "Product Description Template",
    description: "Standard template for product descriptions",
    category: "product",
    sections: [
      {
        id: "header",
        name: "Header Section",
        type: "text",
        content: "{{product.title}}",
        formatting: {
          fontSize: "2xl",
          fontWeight: "bold",
          color: "primary",
          alignment: "center"
        },
        order: 1
      },
      {
        id: "description",
        name: "Description",
        type: "richtext",
        content: "{{product.description}}",
        formatting: {
          fontSize: "base",
          lineHeight: "relaxed",
          color: "gray-700"
        },
        order: 2
      },
      {
        id: "features",
        name: "Features List",
        type: "list",
        content: "{{product.features}}",
        formatting: {
          listStyle: "bullet",
          spacing: "md"
        },
        order: 3
      }
    ],
    placeholders: [
      {
        id: "product.title",
        name: "Product Title",
        type: "text",
        description: "The main product title"
      },
      {
        id: "product.description",
        name: "Product Description",
        type: "richtext",
        description: "Detailed product description"
      },
      {
        id: "product.features",
        name: "Product Features",
        type: "array",
        description: "List of product features"
      },
      {
        id: "product.price",
        name: "Product Price",
        type: "currency",
        description: "Product price with currency formatting"
      }
    ],
    formatting: {
      theme: "modern",
      spacing: "comfortable",
      borderRadius: "md",
      backgroundColor: "white",
      padding: "lg"
    },
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z"
  },
  {
    Id: 2,
    name: "Email Newsletter Template",
    description: "Template for promotional email campaigns",
    category: "email",
    sections: [
      {
        id: "banner",
        name: "Header Banner",
        type: "image",
        content: "{{campaign.banner}}",
        formatting: {
          width: "full",
          height: "200px",
          objectFit: "cover"
        },
        order: 1
      },
      {
        id: "greeting",
        name: "Greeting",
        type: "text",
        content: "Hello {{customer.firstName}},",
        formatting: {
          fontSize: "lg",
          fontWeight: "medium",
          color: "gray-800"
        },
        order: 2
      },
      {
        id: "content",
        name: "Main Content",
        type: "richtext",
        content: "{{campaign.content}}",
        formatting: {
          fontSize: "base",
          lineHeight: "relaxed"
        },
        order: 3
      }
    ],
    placeholders: [
      {
        id: "campaign.banner",
        name: "Campaign Banner",
        type: "image",
        description: "Header banner image for the campaign"
      },
      {
        id: "customer.firstName",
        name: "Customer First Name",
        type: "text",
        description: "Customer's first name for personalization"
      },
      {
        id: "campaign.content",
        name: "Campaign Content",
        type: "richtext",
        description: "Main campaign message content"
      }
    ],
    formatting: {
      theme: "newsletter",
      spacing: "comfortable",
      borderRadius: "lg",
      backgroundColor: "gray-50",
      padding: "xl"
    },
    isActive: true,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-22T16:20:00Z"
  },
  {
    Id: 3,
    name: "Bundle Offer Template",
    description: "Template for product bundle promotions",
    category: "promotion",
    sections: [
      {
        id: "title",
        name: "Offer Title",
        type: "text",
        content: "Special Bundle Offer: {{bundle.name}}",
        formatting: {
          fontSize: "3xl",
          fontWeight: "bold",
          color: "success",
          alignment: "center"
        },
        order: 1
      },
      {
        id: "products",
        name: "Bundle Products",
        type: "grid",
        content: "{{bundle.products}}",
        formatting: {
          columns: 3,
          gap: "md",
          borderWidth: "1px",
          borderColor: "gray-300"
        },
        order: 2
      },
      {
        id: "savings",
        name: "Savings Information",
        type: "highlight",
        content: "Save {{bundle.discount}}% - Total: {{bundle.totalPrice}}",
        formatting: {
          backgroundColor: "warning",
          color: "white",
          padding: "lg",
          borderRadius: "md"
        },
        order: 3
      }
    ],
    placeholders: [
      {
        id: "bundle.name",
        name: "Bundle Name",
        type: "text",
        description: "Name of the product bundle"
      },
      {
        id: "bundle.products",
        name: "Bundle Products",
        type: "array",
        description: "Array of products in the bundle"
      },
      {
        id: "bundle.discount",
        name: "Bundle Discount",
        type: "number",
        description: "Percentage discount for the bundle"
      },
      {
        id: "bundle.totalPrice",
        name: "Bundle Total Price",
        type: "currency",
        description: "Total price after discount"
      }
    ],
    formatting: {
      theme: "promotion",
      spacing: "comfortable",
      borderRadius: "lg",
      backgroundColor: "gradient-to-r from-primary to-accent",
      padding: "xl"
    },
    isActive: false,
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-25T11:30:00Z"
  }
]

export default mockTemplates