import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarSlots } from '@/components/calendar/CalendarSlots';
import { RescheduleRulesNotice } from '@/components/notices/RescheduleRulesNotice';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/api/client';
import type { BookingResponse, TimeSlot } from '@/api/types';
import { formatDate, isValidRescheduleTime } from '@/utils/date';

const RescheduleToken = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Token inválido',
        description: 'O link de reagendamento é inválido.',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    loadBookingFromToken();
  }, [token]);

  const loadBookingFromToken = async () => {
    try {
      // Mock: extract booking ID from token (in real implementation, backend would validate token)
      const bookingId = token?.split('-')[0] || '';
      const bookingData = await apiClient.getBooking(bookingId);
      
      // Validate reschedule rules
      if (bookingData.reschedule_client_count >= 1) {
        toast({
          title: 'Reagendamento não permitido',
          description: 'Já foi utilizado o máximo de reagendamentos permitidos.',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setBooking(bookingData);
      
      // Load available slots (≥24h from now)
      const from = new Date();
      from.setHours(from.getHours() + 24); // 24h minimum
      const to = new Date(from);
      to.setDate(to.getDate() + 30); // Next 30 days
      
      const availability = await apiClient.getAvailability(
        bookingData.professional_id,
        from.toISOString(),
        to.toISOString(),
        bookingData.service_id
      );
      
      // Filter slots that are valid for rescheduling
      const validSlots = availability.slots.filter(slot => 
        isValidRescheduleTime(slot.start)
      );
      
      setAvailableSlots(validSlots);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do reagendamento.',
        variant: 'destructive'
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!booking || !selectedSlot) return;

    setRescheduleLoading(true);
    try {
      await apiClient.rescheduleBooking(booking.id, {
        new_start_at: selectedSlot.start,
        service_id: booking.service_id // Cannot change service in client reschedule
      });

      toast({
        title: 'Marcação reagendada',
        description: `Nova data: ${formatDate(selectedSlot.start, 'PPPp')}`
      });

      navigate(`/success/${booking.id}`);
    } catch (error) {
      toast({
        title: 'Erro no reagendamento',
        description: 'Não foi possível reagendar a marcação. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Marcação não encontrada.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Reagendar Marcação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Marcação Atual</h3>
              <p><strong>Serviço:</strong> {booking.service.name}</p>
              <p><strong>Profissional:</strong> {booking.professional.name}</p>
              <p><strong>Data atual:</strong> {formatDate(booking.start_at, 'PPPp')}</p>
              <p><strong>Preço:</strong> {booking.service.price.toFixed(2)}€</p>
            </div>

            <RescheduleRulesNotice />

            {availableSlots.length > 0 ? (
              <>
                <div>
                  <h3 className="font-semibold mb-4">Selecionar nova data e hora</h3>
                  <CalendarSlots
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    serviceDuration={booking.service.duration_min}
                  />
                </div>

                {selectedSlot && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold">Nova data selecionada:</p>
                    <p>{formatDate(selectedSlot.start, 'PPPp')}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleReschedule}
                    disabled={!selectedSlot || rescheduleLoading}
                    className="flex-1"
                  >
                    {rescheduleLoading ? 'A reagendar...' : 'Confirmar Reagendamento'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Não há horários disponíveis para reagendamento nas próximas semanas.
                </p>
                <Button onClick={() => navigate('/')}>
                  Voltar ao início
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RescheduleToken;