import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Home } from 'lucide-react';
import { apiClient } from '@/api/client';
import { formatDateTime } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

export default function Success() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => apiClient.getBooking(bookingId!),
    enabled: !!bookingId,
  });

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <CardTitle className="text-2xl text-success">Marcação Confirmada!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking && (
              <>
                <div className="bg-primary-50 p-4 rounded-lg space-y-2">
                  <p><strong>Serviço:</strong> {booking.service.name}</p>
                  <p><strong>Profissional:</strong> {booking.professional.name}</p>
                  <p><strong>Data:</strong> {formatDateTime(booking.start_at)}</p>
                  <p><strong>Valor:</strong> {formatCurrency(booking.service.price)}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Receberá uma confirmação por email.</p>
                  <p>Para reagendar, utilize o link que será enviado.</p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1 bg-gradient-primary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Nova Marcação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}