// Mock base44 client for development
// Replace with actual API client implementation

class Base44Client {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BASE44_API_URL || 'https://api.base44.ai';
    this.apiKey = process.env.NEXT_PUBLIC_BASE44_API_KEY;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // Return mock data for development
      return this.getMockData(endpoint, options);
    }
  }

  getMockData(endpoint, options) {
    if (endpoint.includes('/entities/Memory')) {
      if (options.method === 'GET') {
        return [
          {
            id: 'mock-1',
            content: 'Mock memory for development',
            category: 'fact',
            importance: 5,
            tags: ['mock'],
            last_accessed: new Date().toISOString(),
            access_count: 0,
            source: 'mock'
          }
        ];
      }
    }

    if (endpoint.includes('/entities/Conversation')) {
      if (options.method === 'POST') {
        return { id: 'mock-conversation-' + Date.now() };
      }
      if (options.method === 'GET') {
        return [
          {
            id: 'mock-conv-1',
            session_id: 'mock-session',
            messages: [],
            context: {},
            user_preferences: {},
            active_tasks: [],
            emotion_state: 'neutral',
            last_interaction: new Date().toISOString()
          }
        ];
      }
    }

    if (endpoint.includes('/integrations/Core/InvokeLLM')) {
      return "This is a mock AI response for development purposes.";
    }

    return {};
  }

  entities = {
    Memory: {
      list: (params = '') => this.request(`/entities/Memory${params ? '?' + new URLSearchParams(params) : ''}`),
      create: (data) => this.request('/entities/Memory', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
      update: (id, data) => this.request(`/entities/Memory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
      delete: (id) => this.request(`/entities/Memory/${id}`, {
        method: 'DELETE'
      })
    },
    Conversation: {
      list: (params = '') => this.request(`/entities/Conversation${params ? '?' + new URLSearchParams(params) : ''}`),
      create: (data) => this.request('/entities/Conversation', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
      update: (id, data) => this.request(`/entities/Conversation/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
      delete: (id) => this.request(`/entities/Conversation/${id}`, {
        method: 'DELETE'
      }),
      filter: (filters) => this.request('/entities/Conversation/filter', {
        method: 'POST',
        body: JSON.stringify(filters)
      })
    }
  };

  integrations = {
    Core: {
      InvokeLLM: (data) => this.request('/integrations/Core/InvokeLLM', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  };
}

export const base44 = new Base44Client();
