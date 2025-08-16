import { useAuthStore } from '@/store/auth';
import { 
  AuthResponse, 
  AvailabilityResponse, 
  BookingResponse, 
  ConfigGlobal, 
  PaymentInitiateResponse,
  RescheduleTokenResponse,
  Service,
  Professional,
  Payment 
} from './types';

const BASE_URL = '/api/v1';

class ApiClient {
  private getHeaders() {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Services endpoints
  async getServices(): Promise<Service[]> {
    return this.request('/services');
  }

  async createService(data: Omit<Service, 'id'>): Promise<Service> {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string): Promise<void> {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Professionals endpoints
  async getProfessionals(): Promise<Professional[]> {
    return this.request('/professionals');
  }

  async getProfessional(id: string): Promise<Professional> {
    return this.request(`/professionals/${id}`);
  }

  // Availability endpoints
  async getAvailability(
    professionalId: string, 
    params: { from: string; to: string; service_id?: string }
  ): Promise<AvailabilityResponse> {
    const searchParams = new URLSearchParams(params);
    return this.request(`/professionals/${professionalId}/availability?${searchParams}`);
  }

  // Bookings endpoints
  async createBooking(data: {
    service_id: string;
    professional_id: string;
    start_at: string;
  }): Promise<BookingResponse> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBooking(id: string): Promise<BookingResponse> {
    return this.request(`/bookings/${id}`);
  }

  async getBookings(params?: { status?: string; from?: string; to?: string }): Promise<BookingResponse[]> {
    const searchParams = new URLSearchParams(params);
    return this.request(`/bookings?${searchParams}`);
  }

  async cancelBooking(id: string): Promise<BookingResponse> {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  async rescheduleBooking(id: string, data: {
    new_start_at: string;
    service_id?: string;
  }): Promise<BookingResponse> {
    return this.request(`/bookings/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateRescheduleLink(id: string): Promise<RescheduleTokenResponse> {
    return this.request(`/bookings/${id}/generate-reschedule-link`, {
      method: 'POST',
    });
  }

  // Payments endpoints
  async initiatePayment(bookingId: string, data: {
    payment_method: 'card' | 'mb_way' | 'multibanco';
  }): Promise<PaymentInitiateResponse> {
    return this.request(`/bookings/${bookingId}/initiate-payment`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request(`/payments/${id}`);
  }

  // Config endpoints
  async getConfig(): Promise<ConfigGlobal> {
    return this.request('/config');
  }

  async updateConfig(data: Partial<ConfigGlobal>): Promise<ConfigGlobal> {
    return this.request('/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();