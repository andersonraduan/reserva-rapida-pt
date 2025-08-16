import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, Calendar } from 'lucide-react';
import { ProfessionalsTable } from '@/components/dashboard/ProfessionalsTable';
import { SpaceServicesTable } from '@/components/dashboard/SpaceServicesTable';
import { SpaceBookingsTable } from '@/components/dashboard/SpaceBookingsTable';

const Space = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('professionals');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel do Espaço
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profissionais
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Marcações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="professionals">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfessionalsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Serviços do Espaço</CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceServicesTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Marcações do Espaço</CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceBookingsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Space;