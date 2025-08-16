import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Building, Loader2 } from 'lucide-react';
import { apiClient } from '@/api/client';
import { formatDateTime } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mb_way' | 'multibanco'>('card');

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => apiClient.getBooking(bookingId!),
    enabled: !!bookingId,
  });

  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => apiClient.getConfig(),
  });

  const paymentMutation = useMutation({
    mutationFn: (method: string) => 
      apiClient.initiatePayment(bookingId!, { payment_method: method as any }),
    onSuccess: (response) => {
      if (response.checkout_url) {
        // Simulate redirect to Stripe
        window.location.href = response.checkout_url;
      } else {
        toast({
          title: 'Pagamento iniciado',
          description: 'Siga as instruções para completar o pagamento.',
        });
        navigate(`/success/${bookingId}`);
      }
    },
  });

  const enabledMethods = config?.payment_methods_enabled || ['card', 'mb_way', 'multibanco'];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-primary">Pagamento</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Booking Summary */}
          {booking && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Marcação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Serviço:</span>
                  <span className="font-medium">{booking.service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profissional:</span>
                  <span className="font-medium">{booking.professional.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data e Hora:</span>
                  <span className="font-medium">{formatDateTime(booking.start_at)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(booking.service.price)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                {enabledMethods.includes('card') && (
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Cartão de Crédito/Débito</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard</div>
                      </div>
                    </Label>
                  </div>
                )}

                {enabledMethods.includes('mb_way') && (
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="mb_way" id="mb_way" />
                    <Label htmlFor="mb_way" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <div className="font-medium">MB WAY</div>
                        <div className="text-sm text-muted-foreground">Pagamento móvel</div>
                      </div>
                    </Label>
                  </div>
                )}

                {enabledMethods.includes('multibanco') && (
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="multibanco" id="multibanco" />
                    <Label htmlFor="multibanco" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Multibanco</div>
                        <div className="text-sm text-muted-foreground">Referência bancária</div>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>

              <Button 
                className="w-full mt-6 bg-gradient-primary hover:shadow-primary"
                onClick={() => paymentMutation.mutate(paymentMethod)}
                disabled={paymentMutation.isPending}
              >
                {paymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pagar {booking && formatCurrency(booking.service.price)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}