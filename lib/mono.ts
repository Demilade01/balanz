// Mono API configuration and client
export const MONO_CONFIG = {
  // These should be your actual Mono API keys
  publicKey: process.env.EXPO_PUBLIC_MONO_PUBLIC_KEY || 'test_pk_ttanw4bnxxq8am746j4d',
  secretKey: process.env.EXPO_PUBLIC_MONO_SECRET_KEY || 'test_sk_deq76s0etufk9zd03xp2',
  baseUrl: 'https://api.withmono.com',
  connectUrl: 'https://connect.withmono.com',
};

// Mono API endpoints
export const MONO_ENDPOINTS = {
  accounts: '/v2/accounts',
  transactions: '/v2/accounts/:id/transactions',
  identity: '/v2/accounts/:id/identity',
  income: '/v2/accounts/:id/income',
  statements: '/v2/accounts/:id/statements',
};

// Mono API client class
export class MonoAPI {
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.secretKey = MONO_CONFIG.secretKey;
    this.baseUrl = MONO_CONFIG.baseUrl;
  }

  // Get headers for API requests
  private getHeaders() {
    console.log('Mono API Debug:');
    console.log('- Base URL:', this.baseUrl);
    console.log('- Secret Key:', this.secretKey.substring(0, 10) + '...');
    console.log('- Full URL:', `${this.baseUrl}${MONO_ENDPOINTS.accounts}`);

    return {
      'Content-Type': 'application/json',
      'mono-sec-key': this.secretKey,
    };
  }

  // Fetch user accounts
  async getAccounts() {
    try {
      const response = await fetch(`${this.baseUrl}${MONO_ENDPOINTS.accounts}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Fetch account transactions
  async getTransactions(accountId: string, limit = 10) {
    try {
      const endpoint = MONO_ENDPOINTS.transactions.replace(':id', accountId);
      const response = await fetch(`${this.baseUrl}${endpoint}?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Fetch account identity
  async getIdentity(accountId: string) {
    try {
      const endpoint = MONO_ENDPOINTS.identity.replace(':id', accountId);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Test API connection
  async testConnection() {
    try {
      // Use the correct Mono API endpoint for testing
      const response = await fetch(`${this.baseUrl}${MONO_ENDPOINTS.accounts}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return { success: response.ok, status: response.status, data: response.statusText };
    } catch (error) {
      console.error('Mono API Test Error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const monoAPI = new MonoAPI();
