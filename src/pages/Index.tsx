import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useLogout } from '@/hooks/useAuth';
import { SelectorProfissional } from '@/components/selectors/SelectorProfissional';
import { SelectorServico } from '@/components/selectors/SelectorServico';
import { DemoAccounts } from '@/components/demo/DemoAccounts';
import type { Professional, Service } from '@/api/types';

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const [selectedService, setSelectedService] = useState<Service>();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional>();

  const handleProceedToAvailability = () => {
    if (!selectedProfessional || !selectedService) return;
    
    const params = new URLSearchParams({
      professionalId: selectedProfessional.id,
      serviceId: selectedService.id,
      from: new Date().toISOString(),
      to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });
    
    navigate(`/availability?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AgendaFlow</h1>
                <p className="text-sm text-muted-foreground">Sistema de Agendamentos</p>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name}</span>
                  <Badge variant="secondary">{user?.role}</Badge>
                </div>
                {user?.role !== 'client' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (user?.role === 'master_admin') navigate('/dashboard/admin');
                      else if (user?.role === 'space_admin') navigate('/dashboard/space');
                      else navigate('/dashboard/professional');
                    }}
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
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Registar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Contas de Demonstração
              </h2>
              <p className="text-muted-foreground">
                Escolha uma conta para explorar as diferentes funcionalidades do sistema
              </p>
            </div>
            <DemoAccounts />
          </div>
        ) : user?.role === 'client' ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Agendar Serviço
              </h2>
              <p className="text-muted-foreground">
                Selecione o profissional e serviço desejados
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <SelectorProfissional
                  selectedProfessional={selectedProfessional}
                  onSelect={setSelectedProfessional}
                />
              </CardContent>
            </Card>

            {selectedProfessional && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecionar Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <SelectorServico
                    selectedService={selectedService}
                    professional={selectedProfessional}
                    onSelect={setSelectedService}
                  />
                </CardContent>
              </Card>
            )}

            {selectedProfessional && selectedService && (
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={handleProceedToAvailability}
                  className="px-8"
                >
                  Ver Horários Disponíveis
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Bem-vindo, {user?.name}!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Use o botão Dashboard no cabeçalho para aceder ao seu painel de controlo.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      if (user?.role === 'master_admin') navigate('/dashboard/admin');
                      else if (user?.role === 'space_admin') navigate('/dashboard/space');
                      else navigate('/dashboard/professional');
                    }}
                  >
                    Ir para Dashboard
                  </Button>
                  {user?.role === 'professional' && (
                    <Button variant="outline" onClick={() => navigate('/reports/professional/1')}>
                      Ver Relatórios
                    </Button>
                  )}
                  {user?.role === 'space_admin' && (
                    <Button variant="outline" onClick={() => navigate('/reports/space/1')}>
                      Ver Relatórios
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;