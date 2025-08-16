import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { apiClient } from '@/api/client';
import { formatDate, formatTime } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';
import dayjs from 'dayjs';

export default function Availability() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  const professionalId = searchParams.get('professionalId');
  const serviceId = searchParams.get('serviceId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const { data: availability, isLoading } = useQuery({
    queryKey: ['availability', professionalId, serviceId, from, to],
    queryFn: () => apiClient.getAvailability(professionalId!, { 
      from: from!, 
      to: to!, 
      service_id: serviceId! 
    }),
    enabled: !!(professionalId && serviceId && from && to),
  });

  const { data: service } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
    select: (services) => services.find(s => s.id === serviceId),
  });

  const { data: professional } = useQuery({
    queryKey: ['professional', professionalId],
    queryFn: () => apiClient.getProfessional(professionalId!),
    enabled: !!professionalId,
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: { service_id: string; professional_id: string; start_at: string }) =>
      apiClient.createBooking(data),
    onSuccess: (booking) => {
      toast({
        title: 'Marcação criada',
        description: 'Proceda ao pagamento para confirmar.',
      });
      navigate(`/checkout/${booking.id}`);
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a marcação.',
        variant: 'destructive',
      });
    },
  });

  const handleSlotSelect = (slotStart: string) => {
    setSelectedSlot(slotStart);
  };

  const handleBooking = () => {
    if (selectedSlot && serviceId && professionalId) {
      createBookingMutation.mutate({
        service_id: serviceId,
        professional_id: professionalId,
        start_at: selectedSlot,
      });
    }
  };

  // Group slots by date
  const slotsByDate = availability?.slots.reduce((acc, slot) => {
    const date = dayjs(slot.start).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, typeof availability.slots>) || {};

  if (!professionalId || !serviceId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Parâmetros inválidos</h1>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-primary">Horários Disponíveis</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Service & Professional Info */}
          {service && professional && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <p className="text-muted-foreground">com {professional.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration_min} min
                    </Badge>
                    <Badge>{formatCurrency(service.price)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>A carregar horários disponíveis...</p>
              </CardContent>
            </Card>
          )}

          {/* Slots Grid */}
          {!isLoading && Object.keys(slotsByDate).length > 0 && (
            <div className="space-y-6">
              {Object.entries(slotsByDate).map(([date, slots]) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {formatDate(date, 'dddd, DD [de] MMMM')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot === slot.start;
                        const isPast = dayjs(slot.start).isBefore(dayjs());
                        
                        return (
                          <Button
                            key={slot.start}
                            variant={isSelected ? "default" : "outline"}
                            className={`p-3 ${isSelected ? 'bg-gradient-primary shadow-primary' : ''} ${isPast ? 'opacity-50' : ''}`}
                            onClick={() => !isPast && handleSlotSelect(slot.start)}
                            disabled={isPast}
                          >
                            {formatTime(slot.start)}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No slots available */}
          {!isLoading && Object.keys(slotsByDate).length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Sem horários disponíveis</h3>
                <p className="text-muted-foreground mb-4">
                  Não há horários disponíveis para este período.
                </p>
                <Button onClick={() => navigate('/')}>
                  Escolher outro serviço
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Book Button */}
          {selectedSlot && (
            <Card className="mt-6 border-primary/20 bg-primary-50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">Horário selecionado:</p>
                    <p className="text-lg text-primary">
                      {formatDate(selectedSlot, 'DD/MM/YYYY')} às {formatTime(selectedSlot)}
                    </p>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-primary hover:shadow-primary"
                    onClick={handleBooking}
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}