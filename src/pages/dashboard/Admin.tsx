import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, BarChart3, CreditCard, Clock } from 'lucide-react';

const Admin = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('config');
  
  // Mock config state
  const [config, setConfig] = useState({
    minimum_deposit_eur: 5,
    platform_commission_eur: 1,
    payment_methods_enabled: ['card', 'mb_way', 'multibanco'],
    reschedule_min_hours_for_client: 24,
    reschedule_client_max_times: 1,
    multibanco_pre_appointment_expire_minutes: 60
  });

  const togglePaymentMethod = (method: string) => {
    setConfig(prev => ({
      ...prev,
      payment_methods_enabled: prev.payment_methods_enabled.includes(method)
        ? prev.payment_methods_enabled.filter(m => m !== method)
        : [...prev.payment_methods_enabled, method]
    }));
  };

  // Mock KPIs
  const kpis = {
    successRateCard: 94.2,
    successRateMbWay: 96.8,
    successRateMultibanco: 87.5,
    multibancoExpiredRate: 12.3,
    avgWebhookLatency: 245,
    notificationFailures: 2.1
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              KPIs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Sinal mínimo (EUR)</label>
                    <Input 
                      type="number" 
                      value={config.minimum_deposit_eur}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        minimum_deposit_eur: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Comissão da plataforma (EUR)</label>
                    <Input 
                      type="number" 
                      value={config.platform_commission_eur}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        platform_commission_eur: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Métodos de pagamento habilitados</label>
                    
                    <div className="flex items-center justify-between">
                      <span>Cartão</span>
                      <Switch 
                        checked={config.payment_methods_enabled.includes('card')}
                        onCheckedChange={() => togglePaymentMethod('card')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>MB WAY</span>
                      <Switch 
                        checked={config.payment_methods_enabled.includes('mb_way')}
                        onCheckedChange={() => togglePaymentMethod('mb_way')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Multibanco</span>
                      <Switch 
                        checked={config.payment_methods_enabled.includes('multibanco')}
                        onCheckedChange={() => togglePaymentMethod('multibanco')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Reagendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Horas mínimas para reagendamento (cliente)
                    </label>
                    <Input 
                      type="number" 
                      value={config.reschedule_min_hours_for_client}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        reschedule_min_hours_for_client: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">
                      Máximo de reagendamentos (cliente)
                    </label>
                    <Input 
                      type="number" 
                      value={config.reschedule_client_max_times}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        reschedule_client_max_times: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Expiração Multibanco antes do atendimento (minutos)
                    </label>
                    <Input 
                      type="number" 
                      value={config.multibanco_pre_appointment_expire_minutes}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        multibanco_pre_appointment_expire_minutes: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Button>Guardar Configurações</Button>
            </div>
          </TabsContent>

          <TabsContent value="kpis">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Sucesso - Cartão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {kpis.successRateCard}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Sucesso - MB WAY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {kpis.successRateMbWay}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Sucesso - Multibanco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {kpis.successRateMultibanco}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>% Expirados Multibanco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {kpis.multibancoExpiredRate}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latência Média Webhook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {kpis.avgWebhookLatency}ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Falhas de Notificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {kpis.notificationFailures}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;