// API配置文件，支持不同部署环境

// 获取API基础URL
const getApiBaseUrl = () => {
  // 从环境变量获取API URL
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // 根据当前环境自动选择API URL
  const hostname = window.location.hostname;
  
  // Vercel部署
  if (hostname.includes('vercel.app')) {
    return 'https://subscribe-api.vercel.app/api';
  }
  
  // Cloudflare Pages部署
  if (hostname.includes('pages.dev')) {
    return 'https://subscribe-api.workers.dev/api';
  }
  
  // Firebase部署
  if (hostname.includes('web.app') || hostname.includes('firebaseapp.com')) {
    return 'https://us-central1-subscribe-app.cloudfunctions.net/api';
  }
  
  // 本地开发环境
  return 'http://localhost:5001/subscribe-app/us-central1/api';
};

// API端点配置
const API_ENDPOINTS = {
  // 订阅相关
  subscriptions: {
    getAll: '/subscriptions',
    getById: (id) => `/subscriptions/${id}`,
    create: '/subscriptions',
    update: (id) => `/subscriptions/${id}`,
    delete: (id) => `/subscriptions/${id}`,
  },
  
  // 用户相关
  users: {
    getProfile: '/users/profile',
    updateProfile: '/users/profile',
    getSettings: '/users/settings',
    updateSettings: '/users/settings',
  },
  
  // 通知相关
  notifications: {
    send: '/notifications/send',
    test: '/notifications/test',
    getChannels: '/notifications/channels',
  },
  
  // 统计相关
  statistics: {
    summary: '/statistics/summary',
    byCategory: '/statistics/by-category',
    byMonth: '/statistics/by-month',
  },
};

// API客户端
const apiClient = {
  // 基础URL
  baseUrl: getApiBaseUrl(),
  
  // 设置请求头
  getHeaders: (token) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },
  
  // GET请求
  async get(endpoint, token = null) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  },
  
  // POST请求
  async post(endpoint, data, token = null) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  },
  
  // PUT请求
  async put(endpoint, data, token = null) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  },
  
  // DELETE请求
  async delete(endpoint, token = null) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(token),
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  },
};

export { API_ENDPOINTS, apiClient };
export default apiClient; 