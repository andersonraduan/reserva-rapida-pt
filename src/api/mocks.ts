import { http, HttpResponse } from 'msw';
import { 
  User, 
  Professional, 
  Service, 
  Booking, 
  Payment, 
  ConfigGlobal,
  AuthResponse,
  BookingResponse,
  PaymentInitiateResponse 
} from './types';
import { addMinutes, generateTimeSlots } from '@/utils/date';
import dayjs from 'dayjs';

// Mock data
const users: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    role: 'client',
    phone: '+351 912 345 678'
  },
  {
    id: '2',
    name: 'João Barber',
    email: 'joao@example.com',
    role: 'professional',
    phone: '+351 913 456 789'
  }
];

const professionals: Professional[] = [
  {
    id: '1',
    user_id: '2',
    name: 'João Barber',
    tz: 'Europe/Lisbon',
    prefs: {
      multibanco_expiration_hours: 24
    }
  }
];

const services: Service[] = [
  {
    id: '1',
    professional_id: '1',
    name: 'Corte de Cabelo',
    duration_min: 30,
    price: 12.5,
    active: true
  },
  {
    id: '2',
    professional_id: '1',
    name: 'Barba',
    duration_min: 30,
    price: 10,
    active: true
  }
];

let bookings: BookingResponse[] = [];
let payments: Payment[] = [];
let nextBookingId = 1;
let nextPaymentId = 1;

const config: ConfigGlobal = {
  minimum_deposit_eur: 5,
  platform_commission_eur: 1,
  payment_methods_enabled: ['card', 'mb_way', 'multibanco'],
  reschedule_min_hours_for_client: 24,
  reschedule_client_max_times: 1,
  multibanco_pre_appointment_expire_minutes: 60,
  hold_minutes_on_session: 10
};

export const handlers = [
  // Auth endpoints
  http.post('/api/v1/auth/signup', async ({ request }) => {
    const userData = await request.json() as any;
    const user: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: 'client',
      phone: userData.phone
    };
    users.push(user);

    const response: AuthResponse = {
      user,
      token: `mock-token-${user.id}`,
      role: user.role
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  http.post('/api/v1/auth/login', async ({ request }) => {
    const { email } = await request.json() as any;
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
    return HttpResponse.json(services);
  }),

  http.post('/api/v1/services', async ({ request }) => {
    const serviceData = await request.json() as any;
    const newService: Service = {
      id: (services.length + 1).toString(),
      ...serviceData
    };
    services.push(newService);
    return HttpResponse.json(newService, { status: 201 });
  }),

  // Professionals endpoints
  http.get('/api/v1/professionals', () => {
    return HttpResponse.json(professionals);
  }),

  http.get('/api/v1/professionals/:id', ({ params }) => {
    const { id } = params;
    const professional = professionals.find(p => p.id === id);
    
    if (!professional) {
      return HttpResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    return HttpResponse.json(professional);
  }),

  // Availability endpoints
  http.get('/api/v1/professionals/:id/availability', ({ request, params }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') || dayjs().format('YYYY-MM-DD');
    const to = url.searchParams.get('to') || dayjs().add(7, 'day').format('YYYY-MM-DD');
    const serviceId = url.searchParams.get('service_id');

    // Generate mock slots for the date range
    const slots = [];
    let currentDate = dayjs(from);
    const endDate = dayjs(to);

    while (currentDate.isSameOrBefore(endDate)) {
      // Skip Sundays
      if (currentDate.day() !== 0) {
        const dailySlots = generateTimeSlots(
          '09:00',
          '18:00',
          serviceId ? services.find(s => s.id === serviceId)?.duration_min || 30 : 30,
          currentDate.format('YYYY-MM-DD')
        );
        
        slots.push(...dailySlots.map(slot => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString()
        })));
      }
      currentDate = currentDate.add(1, 'day');
    }

    return HttpResponse.json({ slots });
  }),

  // Bookings endpoints
  http.post('/api/v1/bookings', async ({ request }) => {
    const bookingData = await request.json() as any;
    const service = services.find(s => s.id === bookingData.service_id);
    const professional = professionals.find(p => p.id === bookingData.professional_id);
    
    if (!service || !professional) {
      return HttpResponse.json({ error: 'Invalid service or professional' }, { status: 400 });
    }

    const booking: BookingResponse = {
      id: nextBookingId.toString(),
      client_user_id: '1', // Mock current user
      professional_id: bookingData.professional_id,
      service_id: bookingData.service_id,
      start_at: bookingData.start_at,
      end_at: addMinutes(bookingData.start_at, service.duration_min).toISOString(),
      status: 'draft',
      reschedule_client_count: 0,
      created_at: new Date().toISOString(),
      service,
      professional
    };

    bookings.push(booking);
    nextBookingId++;

    return HttpResponse.json(booking, { status: 201 });
  }),

  http.get('/api/v1/bookings/:id', ({ params }) => {
    const { id } = params;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return HttpResponse.json(booking);
  }),

  http.get('/api/v1/bookings', () => {
    return HttpResponse.json(bookings);
  }),

  http.post('/api/v1/bookings/:id/initiate-payment', async ({ request, params }) => {
    const { id } = params;
    const { payment_method } = await request.json() as any;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const payment: Payment = {
      id: nextPaymentId.toString(),
      booking_id: id as string,
      method: payment_method,
      status: 'pending',
      amount: booking.service.price,
      fees: payment_method === 'card' ? 0.5 : 0,
      platform_commission: 1,
      net_to_professional: booking.service.price - 1 - (payment_method === 'card' ? 0.5 : 0)
    };

    if (payment_method === 'multibanco') {
      payment.reference = {
        entity: '11604',
        reference: '123 456 789'
      };
      payment.expires_at = dayjs().add(24, 'hour').toISOString();
    }

    payments.push(payment);
    nextPaymentId++;

    const response: PaymentInitiateResponse = {
      payment_id: payment.id,
      method: payment_method,
      amount: payment.amount,
      ...(payment_method === 'multibanco' && {
        reference: payment.reference,
        expires_at: payment.expires_at
      }),
      ...(payment_method !== 'multibanco' && {
        checkout_url: `https://mock-stripe.com/checkout/${payment.id}`
      })
    };

    // Update booking status
    booking.status = 'pending_payment';
    booking.payment = payment;

    return HttpResponse.json(response);
  }),

  http.post('/api/v1/bookings/:id/cancel', ({ params }) => {
    const { id } = params;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    booking.status = 'canceled';
    return HttpResponse.json(booking);
  }),

  http.post('/api/v1/bookings/:id/reschedule', async ({ request, params }) => {
    const { id } = params;
    const { new_start_at } = await request.json() as any;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    booking.start_at = new_start_at;
    booking.end_at = addMinutes(new_start_at, booking.service.duration_min).toISOString();
    booking.reschedule_client_count += 1;
    booking.last_rescheduled_at = new Date().toISOString();

    return HttpResponse.json(booking);
  }),

  http.post('/api/v1/bookings/:id/generate-reschedule-link', ({ params }) => {
    const { id } = params;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const response = {
      reschedule_link: `/r/mock-token-${id}`,
      expires_at: dayjs().add(7, 'day').toISOString()
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  // Payments endpoints
  http.get('/api/v1/payments/:id', ({ params }) => {
    const { id } = params;
    const payment = payments.find(p => p.id === id);
    
    if (!payment) {
      return HttpResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return HttpResponse.json(payment);
  }),

  // Config endpoints
  http.get('/api/v1/config', () => {
    return HttpResponse.json(config);
  }),

  http.put('/api/v1/config', async ({ request }) => {
    const updates = await request.json() as any;
    Object.assign(config, updates);
    return HttpResponse.json(config);
  }),
];