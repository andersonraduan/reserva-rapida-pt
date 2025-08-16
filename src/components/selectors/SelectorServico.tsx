import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Euro } from 'lucide-react';
import { apiClient } from '@/api/client';
import { formatCurrency } from '@/utils/currency';
import type { Service, Professional } from '@/api/types';

interface SelectorServicoProps {
  selectedService?: Service;
  professional?: Professional;
  onSelect: (service: Service) => void;
  disabled?: boolean;
}

export const SelectorServico = ({ 
  selectedService, 
  professional,
  onSelect, 
  disabled = false 
}: SelectorServicoProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [professional]);

  const loadServices = async () => {
    try {
      const data = await apiClient.getServices(professional?.id);
      setServices(data.filter(service => service.active));
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded-md"></div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Selecione um profissional primeiro.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Procurar serviço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService?.id === service.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSelect(service)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold">{service.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.duration_min}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    {formatCurrency(service.price)}
                  </div>
                </div>

                {selectedService?.id === service.id && (
                  <Badge className="w-full justify-center">
                    Selecionado
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Nenhum serviço encontrado.' : 'Nenhum serviço disponível.'}
        </div>
      )}
    </div>
  );
};