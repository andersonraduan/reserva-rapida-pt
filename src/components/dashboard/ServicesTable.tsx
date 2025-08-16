import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, Euro } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';
import type { Service } from '@/api/types';

// Mock services data
const initialServices: Service[] = [
  {
    id: '1',
    professional_id: '1',
    space_id: '1',
    name: 'Corte de Cabelo',
    duration_min: 30,
    price: 12.50,
    active: true
  },
  {
    id: '2',
    professional_id: '1',
    space_id: '1',
    name: 'Barba',
    duration_min: 30,
    price: 10.00,
    active: true
  }
];

export const ServicesTable = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration_min: 30,
    price: 0,
    active: true
  });

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    if (editingService) {
      // Update service
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      ));
      toast({
        title: 'Serviço atualizado',
        description: 'O serviço foi atualizado com sucesso.'
      });
    } else {
      // Create new service
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9),
        professional_id: '1',
        space_id: '1',
        ...formData
      };
      setServices(prev => [...prev, newService]);
      toast({
        title: 'Serviço criado',
        description: 'O novo serviço foi criado com sucesso.'
      });
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ name: '', duration_min: 30, price: 0, active: true });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration_min: service.duration_min,
      price: service.price,
      active: service.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast({
      title: 'Serviço eliminado',
      description: 'O serviço foi eliminado com sucesso.'
    });
  };

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, active: !service.active }
        : service
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestão de Serviços</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingService(null);
              setFormData({ name: '', duration_min: 30, price: 0, active: true });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Corte de Cabelo"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_min: Number(e.target.value) }))}
                  min="15"
                  step="15"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço (EUR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  min="0"
                  step="0.50"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                />
                <Label htmlFor="active">Serviço ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {editingService ? 'Atualizar' : 'Criar'} Serviço
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum serviço encontrado. Adicione o primeiro serviço.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {service.duration_min}min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(service.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={service.active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActive(service.id)}
                      >
                        {service.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};