export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'professional' | 'space_admin' | 'master_admin';
  phone?: string;
}

export interface Professional {
  id: string;
  user_id: string;
  space_id?: string;
  name: string;
  tz: string;
  prefs: {
    multibanco_expiration_hours?: number;
  };
}

export interface Service {
  id: string;
  professional_id?: string;
  space_id?: string;
  name: string;
  duration_min: number;
  price: number;
  active: boolean;
}

export interface AvailabilityRule {
  id: string;
  professional_id: string;
  weekday: number; // 0-6 (Sunday-Saturday)
  intervals: Array<{ start: string; end: string }>;
  timezone: string;
}

export interface AvailabilityException {
  id: string;
  professional_id: string;
  date: string;
  closed?: boolean;
  intervals?: Array<{ start: string; end: string }>;
}

export interface Booking {
  id: string;
  client_user_id: string;
  professional_id: string;
  service_id: string;
  start_at: string;
  end_at: string;
  status: 'draft' | 'pending_payment' | 'confirmed' | 'canceled' | 'expired';
  reschedule_client_count: number;
  last_rescheduled_at?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  method: 'card' | 'mb_way' | 'multibanco';
  status: 'pending' | 'succeeded' | 'failed' | 'expired' | 'refunded';
  amount: number;
  reference?: {
    entity: string;
    reference: string;
  };
  expires_at?: string;
  fees?: number;
  platform_commission?: number;
  net_to_professional?: number;
}

export interface ConfigGlobal {
  minimum_deposit_eur: number;
  platform_commission_eur: number;
  payment_methods_enabled: Array<'card' | 'mb_way' | 'multibanco'>;
  reschedule_min_hours_for_client: number;
  reschedule_client_max_times: number;
  multibanco_pre_appointment_expire_minutes: number;
  hold_minutes_on_session: number;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  slots: TimeSlot[];
}

export interface AuthResponse {
  user: User;
  token: string;
  role: string;
}

export interface BookingResponse extends Booking {
  service: Service;
  professional: Professional;
  payment?: Payment;
}

export interface PaymentInitiateResponse {
  payment_id: string;
  method: string;
  checkout_url?: string;
  reference?: {
    entity: string;
    reference: string;
  };
  amount: number;
  expires_at?: string;
}

export interface RescheduleTokenResponse {
  reschedule_link: string;
  expires_at: string;
}