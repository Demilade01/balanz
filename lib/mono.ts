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
  accountAuth: '/v2/accounts/auth',
  transactions: '/v2/accounts/:id/transactions',
  identity: '/v2/accounts/:id/identity',
  income: '/v2/accounts/:id/income',
  statements: '/v2/accounts/:id/statement',
  connect: '/v2/connect',
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
    console.log('- Secret Key:', this.secretKey.substring(0, 15) + '...');

    return {
      'Content-Type': 'application/json',
      'mono-sec-key': this.secretKey,
      'Accept': 'application/json',
    };
  }

  // Enhanced error handling
  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    let data;

    try {
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (e) {
      data = null;
    }

    console.log('Response Details:');
    console.log('- Status:', response.status);
    console.log('- Status Text:', response.statusText);
    console.log('- Content-Type:', contentType);
    console.log('- Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      const errorMessage = (data as any)?.message || (data as any)?.error || response.statusText;
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    return data;
  }

  // Exchange authorization code for account ID (CRITICAL for Mono Connect flow)
  async getAccountByCode(code: string) {
    try {
      console.log('\n=== Exchanging Code for Account ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.accountAuth}`;
      console.log('Request URL:', url);
      console.log('Authorization Code:', code);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ code }),
      });

      const data = await this.handleResponse(response);
      console.log('Account ID:', (data as any)?.id);

      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getAccountByCode):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Fetch user accounts
  async getAccounts() {
    try {
      console.log('\n=== Fetching Accounts ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.accounts}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getAccounts):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Get account details by ID
  async getAccountById(accountId: string) {
    try {
      console.log('\n=== Fetching Account by ID ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.accounts}/${accountId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono Account Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Fetch account transactions
  async getTransactions(accountId: string, limit = 50, page = 1) {
    try {
      console.log('\n=== Fetching Transactions ===');
      const endpoint = MONO_ENDPOINTS.transactions.replace(':id', accountId);
      const url = `${this.baseUrl}${endpoint}?limit=${limit}&page=${page}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getTransactions):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Fetch account identity
  async getIdentity(accountId: string) {
    try {
      console.log('\n=== Fetching Identity ===');
      const endpoint = MONO_ENDPOINTS.identity.replace(':id', accountId);
      const url = `${this.baseUrl}${endpoint}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getIdentity):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Fetch account income information
  async getIncome(accountId: string) {
    try {
      console.log('\n=== Fetching Income ===');
      const endpoint = MONO_ENDPOINTS.income.replace(':id', accountId);
      const url = `${this.baseUrl}${endpoint}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getIncome):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Fetch account statements
  async getStatements(accountId: string, period?: string) {
    try {
      console.log('\n=== Fetching Statements ===');
      const endpoint = MONO_ENDPOINTS.statements.replace(':id', accountId);
      const url = period
        ? `${this.baseUrl}${endpoint}?period=${period}`
        : `${this.baseUrl}${endpoint}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono API Error (getStatements):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Test API connection with detailed diagnostics
  async testConnection() {
    try {
      console.log('\n=== Testing Mono API Connection ===');
      console.log('Environment Check:');
      console.log('- EXPO_PUBLIC_MONO_PUBLIC_KEY:', process.env.EXPO_PUBLIC_MONO_PUBLIC_KEY ? 'Set' : 'Not set (using default)');
      console.log('- EXPO_PUBLIC_MONO_SECRET_KEY:', process.env.EXPO_PUBLIC_MONO_SECRET_KEY ? 'Set' : 'Not set (using default)');
      console.log('- Secret Key Format:', this.secretKey.startsWith('test_sk_') ? 'Test Key' : this.secretKey.startsWith('live_sk_') ? 'Live Key' : 'Unknown Format');
      console.log('- Secret Key Length:', this.secretKey.length);

      const url = `${this.baseUrl}${MONO_ENDPOINTS.accounts}`;
      console.log('Test URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('Response Status:', response.status);

      const data = await this.handleResponse(response);

      return {
        success: true,
        status: response.status,
        data: data,
        message: 'API connection successful'
      };
    } catch (error) {
      console.error('Mono API Test Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        troubleshooting: [
          '1. Verify your API keys are correct in your .env file',
          '2. Make sure you have connected at least one bank account via Mono Connect',
          '3. Check if you need to use live keys instead of test keys',
          '4. Ensure your Mono account is active and verified',
          '5. Review Mono API documentation at https://docs.mono.co'
        ]
      };
    }
  }

  // Create connect session (for custom implementations)
  async createConnectSession(customerId?: string) {
    try {
      console.log('\n=== Creating Connect Session ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.connect}`;
      console.log('Request URL:', url);

      const body: any = {
        success_url: 'balanz://connect/success',
        failure_url: 'balanz://connect/failure',
      };

      if (customerId) {
        body.customer = { id: customerId };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono Connect Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Sync all connected accounts
  async syncAccounts() {
    try {
      console.log('\n=== Syncing Accounts ===');
      const result = await this.getAccounts();

      if (result.success && result.data) {
        const accounts = (result.data as any)?.data || result.data || [];
        console.log(`Found ${accounts.length} accounts`);
        return { success: true, data: accounts, count: accounts.length };
      }

      return result;
    } catch (error) {
      console.error('Mono Sync Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Validate API key format
  validateApiKey(): { valid: boolean; message: string } {
    if (!this.secretKey) {
      return { valid: false, message: 'Secret key is missing' };
    }

    if (!this.secretKey.startsWith('test_sk_') && !this.secretKey.startsWith('live_sk_')) {
      return {
        valid: false,
        message: 'Secret key format is invalid. Must start with "test_sk_" or "live_sk_"'
      };
    }

    if (this.secretKey.length < 20) {
      return { valid: false, message: 'Secret key appears to be too short' };
    }

    return { valid: true, message: 'Secret key format looks valid' };
  }

  // Relink an account (when authentication expires)
  async relinkAccount(accountId: string) {
    try {
      console.log('\n=== Relinking Account ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.accounts}/${accountId}/relink`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono Relink Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }

  // Unlink/delete an account
  async unlinkAccount(accountId: string) {
    try {
      console.log('\n=== Unlinking Account ===');
      const url = `${this.baseUrl}${MONO_ENDPOINTS.accounts}/${accountId}/unlink`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data = await this.handleResponse(response);
      return { success: true, data };
    } catch (error) {
      console.error('Mono Unlink Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }
}

// Type definitions for sync service responses
export interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  details?: any;
}

export interface ExchangeCodeResponse {
  account?: {
    id: string;
    account_name: string;
    bank_name: string;
    balance: number;
  };
  providerAccount?: any;
  message?: string;
}

export interface SyncAccountsResponse {
  summary?: {
    accountsProcessed: number;
    accountsSuccessful: number;
    totalTransactions: number;
  };
  results?: any[];
  message?: string;
}

// Sync service for connecting Mono with Supabase
export class SyncService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = 'https://jvmgqzpqjelaxlijclfb.supabase.co';
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bWdxenBxamVsYXhsaWpjbGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzk0MjAsImV4cCI6MjA3NDkxNTQyMH0.EGNH-llbqTUYpgGWjwEq_IbwQDO_6ojCIBaVEugqX3A';
  }

  // Exchange Mono authorization code for account and sync to Supabase
  async exchangeCodeAndSync(code: string, userId: string): Promise<SyncResult> {
    try {
      console.log('Exchanging code and syncing with Supabase:', { code, userId });

      const response = await fetch(`${this.supabaseUrl}/functions/v1/connect-exchange-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          code,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as ExchangeCodeResponse;
      console.log('Exchange and sync successful:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Sync service error (exchangeCodeAndSync):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Sync all accounts for a user
  async syncUserAccounts(userId: string, accountIds?: string[]): Promise<SyncResult> {
    try {
      console.log('Syncing user accounts:', { userId, accountIds });

      const response = await fetch(`${this.supabaseUrl}/functions/v1/sync-accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          userId,
          accountIds,
          forceSync: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as SyncAccountsResponse;
      console.log('Account sync successful:', result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Sync service error (syncUserAccounts):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Get user's accounts from Supabase
  async getUserAccounts(userId: string) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);

      const { data, error } = await supabase
        .from('accounts')
        .select(`
          id,
          bank_name,
          account_name,
          account_number_masked,
          type,
          currency,
          balance,
          last_synced_at,
          provider_accounts!inner(
            id,
            provider,
            status,
            linked_at
          )
        `)
        .eq('user_id', userId)
        .eq('provider_accounts.status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error('Sync service error (getUserAccounts):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Get user's transactions from Supabase
  async getUserTransactions(userId: string, limit = 50, offset = 0) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          posted_at,
          amount_minor,
          currency,
          description,
          merchant,
          category_id,
          is_manual,
          created_at,
          accounts!inner(
            bank_name,
            account_name
          ),
          categories(
            name,
            icon,
            color,
            is_income,
            is_expense
          )
        `)
        .eq('user_id', userId)
        .order('posted_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error('Sync service error (getUserTransactions):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Get user's total balance from Supabase
  async getUserTotalBalance(userId: string) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);

      const { data, error } = await supabase.rpc('get_user_total_balance', {
        user_uuid: userId,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || 0,
      };
    } catch (error) {
      console.error('Sync service error (getUserTotalBalance):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Auto-categorize a transaction
  async categorizeTransaction(transactionId: string) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);

      const { data, error } = await supabase.rpc('auto_categorize_transaction', {
        transaction_id: transactionId,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Sync service error (categorizeTransaction):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
    }
  }

  // Format currency amount from minor units
  formatCurrency(amountMinor: number, currency = 'NGN'): string {
    const amount = amountMinor / 100;

    switch (currency) {
      case 'NGN':
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'USD':
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'EUR':
        return `€${amount.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'GBP':
        return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  // Test the sync service connection
  async testConnection() {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);

      // Test basic connection
      const { data, error } = await supabase.from('categories').select('count').limit(1);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Sync service connection successful',
        data: {
          supabaseUrl: this.supabaseUrl,
          categoriesCount: data,
        },
      };
    } catch (error) {
      console.error('Sync service test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        troubleshooting: [
          '1. Verify your Supabase URL and anon key are correct',
          '2. Check if the database schema is properly set up',
          '3. Ensure RLS policies allow access to the data',
          '4. Review the Supabase project logs for any errors',
        ],
      };
    }
  }
}

// Export singleton instances
export const monoAPI = new MonoAPI();
export const syncService = new SyncService();