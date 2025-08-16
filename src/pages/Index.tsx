import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, LogOut } from 'lucide-react';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';
import { useLogout } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/currency';

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.getServices(),
  });

  const { data: professionals } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => apiClient.getProfessionals(),
  });

  const handleBooking = () => {
    if (selectedService && selectedProfessional) {
      navigate(`/availability?professionalId=${selectedProfessional}&serviceId=${selectedService}&from=${new Date().toISOString().split('T')[0]}&to=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Agendamentos Simplificados
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Agende os seus serviços de forma rápida e segura. Pague apenas um sinal e confirme a sua marcação.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Iniciar Sessão
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/signup')}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Criar Conta
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Calendar className="h-12 w-12 text-white mb-4" />
                <CardTitle className="text-white">Agendamento Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Escolha o serviço, profissional e horário em poucos cliques.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Clock className="h-12 w-12 text-white mb-4" />
                <CardTitle className="text-white">Pagamento Flexível</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Pague apenas um sinal para reservar. Múltiplos métodos de pagamento.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <User className="h-12 w-12 text-white mb-4" />
                <CardTitle className="text-white">Reagendamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Altere a sua marcação facilmente quando necessário.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Agendamentos</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            )}
            {user?.role !== 'client' && (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/professional')}
              >
                Dashboard
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Agendar Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecionar Serviço</label>
                <Select onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <div className="flex gap-2 ml-4">
                            <Badge variant="outline">{service.duration_min}min</Badge>
                            <Badge>{formatCurrency(service.price)}</Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Professional Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Selecionar Profissional</label>
                <Select onValueChange={setSelectedProfessional}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals?.map((professional) => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professional.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Continue Button */}
              <Button 
                className="w-full bg-gradient-primary hover:shadow-primary"
                onClick={handleBooking}
                disabled={!selectedService || !selectedProfessional}
              >
                Ver Horários Disponíveis
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
