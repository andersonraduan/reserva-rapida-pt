import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ServicesTable } from '@/components/dashboard/ServicesTable';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { AvailabilityEditor } from '@/components/dashboard/AvailabilityEditor';
import { Settings, Calendar, Briefcase, Clock } from 'lucide-react';

const Professional = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel do Profissional
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Disponibilidade
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Marcações
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Definições
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <ServicesTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <AvailabilityEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Marcações</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Definições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Horas de expiração Multibanco
                  </label>
                  <Input 
                    type="number" 
                    placeholder="24" 
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Buffer de 60 minutos antes do atendimento aplicado automaticamente
                  </p>
                </div>
                <Button>Guardar Definições</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Professional;