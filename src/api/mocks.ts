import { http, HttpResponse } from 'msw';
import type { 
  User, 
  Professional, 
  Service, 
  Booking, 
  Payment, 
  ConfigGlobal,
  AuthResponse,
  BookingResponse,
  PaymentInitiateResponse,
  AvailabilityResponse,
  TimeSlot
} from './types';
import { generateTimeSlots } from '@/utils/date';

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@exemplo.pt', role: 'client', phone: '+351912345678' },
  { id: '2', name: 'João Barber', email: 'joao@exemplo.pt', role: 'professional', phone: '+351987654321' },
  { id: '3', name: 'Maria Admin', email: 'maria@exemplo.pt', role: 'space_admin', phone: '+351966555444' },
  { id: '4', name: 'Admin Master', email: 'admin@exemplo.pt', role: 'master_admin', phone: '+351933222111' }
];

const mockProfessionals: Professional[] = [
  {
    id: '1',
    user_id: '2',
    space_id: '1',
    name: 'João Barber',
    tz: 'Europe/Lisbon',
    prefs: { multibanco_expiration_hours: 24 }
  },
  {
    id: '2',
    user_id: '3',
    space_id: '1',
    name: 'Maria Cabeleireira',
    tz: 'Europe/Lisbon',
    prefs: { multibanco_expiration_hours: 48 }
  }
];

const mockServices: Service[] = [
  {
    id: '1',
    professional_id: '1',
    space_id: '1',
    name: 'Corte de Cabelo',
    duration_min: 30,
    price: 12.50,
    active: true
  },
  {
    id: '2',
    professional_id: '1',
    space_id: '1',
    name: 'Barba',
    duration_min: 30,
    price: 10.00,
    active: true
  },
  {
    id: '3',
    professional_id: '2',
    space_id: '1',
    name: 'Corte Feminino',
    duration_min: 45,
    price: 25.00,
    active: true
  },
  {
    id: '4',
    professional_id: '2',
    space_id: '1',
    name: 'Coloração',
    duration_min: 120,
    price: 65.00,
    active: true
  }
];

let mockBookings: BookingResponse[] = [
  {
    id: '1',
    client_user_id: '1',
    professional_id: '1',
    service_id: '1',
    start_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'confirmed',
    reschedule_client_count: 0,
    created_at: new Date().toISOString(),
    service: mockServices[0],
    professional: mockProfessionals[0]
  }
];

let mockPayments: Payment[] = [];

const mockConfig: ConfigGlobal = {
  minimum_deposit_eur: 5,
  platform_commission_eur: 1,
  payment_methods_enabled: ['card', 'mb_way', 'multibanco'],
  reschedule_min_hours_for_client: 24,
  reschedule_client_max_times: 1,
  multibanco_pre_appointment_expire_minutes: 60,
  hold_minutes_on_session: 10
};

// Helper function to generate availability slots
const generateAvailabilitySlots = (
  professionalId: string, 
  from: string, 
  to: string, 
  serviceId?: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  // Generate slots for each day
  for (let date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    
    // Skip Sundays (0) - closed
    if (dayOfWeek === 0) continue;
    
    // Skip Friday if it's the next Friday (exception)
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));
    if (date.toDateString() === nextFriday.toDateString()) continue;
    
    // Generate time slots from 9:00 to 18:00
    const serviceDuration = serviceId ? mockServices.find(s => s.id === serviceId)?.duration_min || 30 : 30;
    const dateSlots = generateTimeSlots('09:00', '18:00', serviceDuration, date.toISOString(), 'Europe/Lisbon');
    
    // Filter out already booked slots
    const availableSlots = dateSlots.filter(slot => {
      return !mockBookings.some(booking => {
        const bookingStart = new Date(booking.start_at);
        const bookingEnd = new Date(booking.end_at);
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        
        return booking.professional_id === professionalId &&
               booking.status !== 'canceled' &&
               booking.status !== 'expired' &&
               ((slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd));
      });
    });
    
    slots.push(...availableSlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString()
    })));
  }
  
  return slots;
};

export const handlers = [
  // Auth endpoints
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const body = await request.json() as any;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      email: body.email,
      role: 'client',
      phone: body.phone
    };
    mockUsers.push(newUser);
    
    const response: AuthResponse = {
      user: newUser,
      token: `mock-token-${newUser.id}`,
      role: newUser.role
    };
    
    return HttpResponse.json(response, { status: 201 });
  }),

  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    const user = mockUsers.find(u => u.email === body.email);
    
    if (!user) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const response: AuthResponse = {
      user,
      token: `mock-token-${user.id}`,
      role: user.role
    };
    
    return HttpResponse.json(response);
  }),

  // Services endpoints
  http.get('/api/v1/services', () => {
    return HttpResponse.json(mockServices);
  }),

  http.get('/api/v1/professionals/:id/services', ({ params }) => {
    const professionalId = params.id as string;
    const services = mockServices.filter(s => s.professional_id === professionalId);
    return HttpResponse.json(services);
  }),

  http.post('/api/v1/services', async ({ request }) => {
    const body = await request.json() as any;
    const newService: Service = {
      id: Math.random().toString(36).substr(2, 9),
      ...body
    };
    mockServices.push(newService);
    return HttpResponse.json(newService, { status: 201 });
  }),

  http.put('/api/v1/services/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as any;
    const index = mockServices.findIndex(s => s.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    mockServices[index] = { ...mockServices[index], ...body };
    return HttpResponse.json(mockServices[index]);
  }),

  http.delete('/api/v1/services/:id', ({ params }) => {
    const id = params.id as string;
    const index = mockServices.findIndex(s => s.id === id);
    
    if (index === -1) {
      return HttpResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    mockServices.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),

  // Professionals endpoints
  http.get('/api/v1/professionals', () => {
    return HttpResponse.json(mockProfessionals);
  }),

  http.get('/api/v1/professionals/:id', ({ params }) => {
    const id = params.id as string;
    const professional = mockProfessionals.find(p => p.id === id);
    
    if (!professional) {
      return HttpResponse.json({ error: 'Professional not found' }, { status: 404 });
    }
    
    return HttpResponse.json(professional);
  }),

  // Availability endpoints
  http.get('/api/v1/professionals/:id/availability', ({ params, request }) => {
    const professionalId = params.id as string;
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || '';
    const to = url.searchParams.get('to') || '';
    const serviceId = url.searchParams.get('service_id') || undefined;
    
    const slots = generateAvailabilitySlots(professionalId, from, to, serviceId);
    
    const response: AvailabilityResponse = { slots };
    return HttpResponse.json(response);
  }),

  // Bookings endpoints
  http.post('/api/v1/bookings', async ({ request }) => {
    const body = await request.json() as any;
    const service = mockServices.find(s => s.id === body.service_id);
    const professional = mockProfessionals.find(p => p.id === body.professional_id);
    
    if (!service || !professional) {
      return HttpResponse.json({ error: 'Service or professional not found' }, { status: 404 });
    }
    
    const endTime = new Date(body.start_at);
    endTime.setMinutes(endTime.getMinutes() + service.duration_min);
    
    const newBooking: BookingResponse = {
      id: Math.random().toString(36).substr(2, 9),
      client_user_id: '1', // Mock client
      professional_id: body.professional_id,
      service_id: body.service_id,
      start_at: body.start_at,
      end_at: endTime.toISOString(),
      status: 'draft',
      reschedule_client_count: 0,
      created_at: new Date().toISOString(),
      service,
      professional
    };
    
    mockBookings.push(newBooking);
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  http.get('/api/v1/bookings/:id', ({ params }) => {
    const id = params.id as string;
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return HttpResponse.json(booking);
  }),

  http.post('/api/v1/bookings/:id/cancel', ({ params }) => {
    const id = params.id as string;
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    booking.status = 'canceled';
    return HttpResponse.json(booking);
  }),

  http.post('/api/v1/bookings/:id/reschedule', async ({ params, request }) => {
    const id = params.id as string;
    const body = await request.json() as any;
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const service = body.service_id ? 
      mockServices.find(s => s.id === body.service_id) : 
      booking.service;
    
    if (!service) {
      return HttpResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    const endTime = new Date(body.new_start_at);
    endTime.setMinutes(endTime.getMinutes() + service.duration_min);
    
    booking.start_at = body.new_start_at;
    booking.end_at = endTime.toISOString();
    booking.reschedule_client_count += 1;
    booking.last_rescheduled_at = new Date().toISOString();
    booking.service = service;
    
    return HttpResponse.json(booking);
  }),

  http.post('/api/v1/bookings/:id/generate-reschedule-link', ({ params }) => {
    const id = params.id as string;
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const token = `${id}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    return HttpResponse.json({
      reschedule_link: `/r/${token}`,
      expires_at: expiresAt.toISOString()
    }, { status: 201 });
  }),

  // Payments endpoints
  http.post('/api/v1/bookings/:id/initiate-payment', async ({ params, request }) => {
    const bookingId = params.id as string;
    const body = await request.json() as any;
    const booking = mockBookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const paymentId = Math.random().toString(36).substr(2, 9);
    const amount = booking.service.price;
    
    // Update booking status
    booking.status = 'pending_payment';
    
    let response: PaymentInitiateResponse;
    
    switch (body.payment_method) {
      case 'card':
      case 'mb_way':
        response = {
          payment_id: paymentId,
          method: body.payment_method,
          checkout_url: `https://checkout.stripe.com/mock-${paymentId}`,
          amount
        };
        break;
        
      case 'multibanco':
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2); // 2h expiry
        
        response = {
          payment_id: paymentId,
          method: 'multibanco',
          reference: {
            entity: '12345',
            reference: '123456789'
          },
          amount,
          expires_at: expiresAt.toISOString()
        };
        break;
        
      default:
        return HttpResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }
    
    // Create payment record
    const payment: Payment = {
      id: paymentId,
      booking_id: bookingId,
      method: body.payment_method,
      status: 'pending',
      amount,
      reference: response.reference,
      expires_at: response.expires_at,
      fees: amount * 0.029, // 2.9% fee
      platform_commission: mockConfig.platform_commission_eur,
      net_to_professional: amount - (amount * 0.029) - mockConfig.platform_commission_eur
    };
    
    mockPayments.push(payment);
    
    // Simulate payment success after delay for card/mb_way
    if (['card', 'mb_way'].includes(body.payment_method)) {
      setTimeout(() => {
        payment.status = 'succeeded';
        booking.status = 'confirmed';
      }, 2000);
    }
    
    return HttpResponse.json(response);
  }),

  http.get('/api/v1/payments/:id', ({ params }) => {
    const id = params.id as string;
    const payment = mockPayments.find(p => p.id === id);
    
    if (!payment) {
      return HttpResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    
    return HttpResponse.json(payment);
  }),

  // Config endpoints
  http.get('/api/v1/config', () => {
    return HttpResponse.json(mockConfig);
  }),

  http.put('/api/v1/config', async ({ request }) => {
    const body = await request.json() as any;
    Object.assign(mockConfig, body);
    return HttpResponse.json(mockConfig);
  })
];