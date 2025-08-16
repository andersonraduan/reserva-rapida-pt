import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';
import { apiClient } from '@/api/client';
import type { Professional } from '@/api/types';

interface SelectorProfissionalProps {
  selectedProfessional?: Professional;
  onSelect: (professional: Professional) => void;
  disabled?: boolean;
}

export const SelectorProfissional = ({ 
  selectedProfessional, 
  onSelect, 
  disabled = false 
}: SelectorProfissionalProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const data = await apiClient.getProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded-md"></div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Procurar profissional..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfessionals.map((professional) => (
          <Card
            key={professional.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProfessional?.id === professional.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onSelect(professional)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{professional.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {professional.tz}
                  </p>
                </div>
              </div>
              {selectedProfessional?.id === professional.id && (
                <Badge className="mt-2 w-full justify-center">
                  Selecionado
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfessionals.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Nenhum profissional encontrado.' : 'Nenhum profissional disponível.'}
        </div>
      )}
    </div>
  );
};