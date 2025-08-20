const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Health Guides
  async getHealthGuides(params?: {
    locale?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.locale) searchParams.set('locale', params.locale)
    if (params?.status) searchParams.set('status', params.status)
    
    const query = searchParams.toString()
    return this.request(`/health-guides/admin${query ? `?${query}` : ''}`)
  }

  async getHealthGuide(id: number) {
    return this.request(`/health-guides/${id}`)
  }

  async createHealthGuide(data: Record<string, unknown>) {
    return this.request('/health-guides', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateHealthGuide(id: number, data: Record<string, unknown>) {
    return this.request(`/health-guides/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async publishHealthGuide(id: number) {
    return this.request(`/health-guides/${id}/publish`, {
      method: 'PATCH',
    })
  }

  async deleteHealthGuide(id: number) {
    return this.request(`/health-guides/${id}`, {
      method: 'DELETE',
    })
  }

  // Products
  async getProducts(params?: {
    tags?: string[]
    isExpressEligible?: boolean
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.tags) params.tags.forEach(tag => searchParams.append('tags', tag))
    if (params?.isExpressEligible !== undefined) searchParams.set('isExpressEligible', params.isExpressEligible.toString())
    if (params?.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString())
    if (params?.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString())
    if (params?.inStock !== undefined) searchParams.set('inStock', params.inStock.toString())
    if (params?.search) searchParams.set('search', params.search)
    
    const query = searchParams.toString()
    return this.request(`/products${query ? `?${query}` : ''}`)
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`)
  }

  async createProduct(data: Record<string, unknown>) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: number, data: Record<string, unknown>) {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async updateProductStock(id: number, quantity: number) {
    return this.request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Authentication
  async signIn(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async getProfile() {
    return this.request('/auth/profile')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

