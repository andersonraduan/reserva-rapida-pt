import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Clock, Euro, MoreHorizontal, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { toast } from '@/hooks/use-toast';
import type { BookingResponse } from '@/api/types';

// Mock bookings data
const initialBookings: BookingResponse[] = [
  {
    id: '1',
    client_user_id: '1',
    professional_id: '1',
    service_id: '1',
    start_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'confirmed',
    reschedule_client_count: 0,
    created_at: new Date().toISOString(),
    service: {
      id: '1',
      professional_id: '1',
      space_id: '1',
      name: 'Corte de Cabelo',
      duration_min: 30,
      price: 12.50,
      active: true
    },
    professional: {
      id: '1',
      user_id: '2',
      space_id: '1',
      name: 'João Barber',
      tz: 'Europe/Lisbon',
      prefs: { multibanco_expiration_hours: 24 }
    }
  },
  {
    id: '2',
    client_user_id: '2',
    professional_id: '1',
    service_id: '2',
    start_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'pending_payment',
    reschedule_client_count: 1,
    last_rescheduled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    service: {
      id: '2',
      professional_id: '1',
      space_id: '1',
      name: 'Barba',
      duration_min: 30,
      price: 10.00,
      active: true
    },
    professional: {
      id: '1',
      user_id: '2',
      space_id: '1',
      name: 'João Barber',
      tz: 'Europe/Lisbon',
      prefs: { multibanco_expiration_hours: 24 }
    }
  }
];

const statusLabels = {
  draft: 'Rascunho',
  pending_payment: 'Pagamento Pendente',
  confirmed: 'Confirmada',
  canceled: 'Cancelada',
  expired: 'Expirada'
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  pending_payment: 'secondary',
  confirmed: 'default',
  canceled: 'destructive',
  expired: 'destructive'
};

export const BookingsTable = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      booking.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.professional.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleCancel = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'canceled' as const }
        : booking
    ));
    
    toast({
      title: 'Marcação cancelada',
      description: 'A marcação foi cancelada com sucesso.'
    });
  };

  const handleReschedule = (bookingId: string) => {
    // In a real app, this would open a reschedule dialog
    toast({
      title: 'Reagendamento',
      description: 'Funcionalidade de reagendamento em desenvolvimento.'
    });
  };

  const generateRescheduleLink = (bookingId: string) => {
    const link = `/r/${bookingId}-${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(window.location.origin + link);
    
    toast({
      title: 'Link copiado',
      description: 'O link de reagendamento foi copiado para a área de transferência.'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Procurar por serviço ou profissional..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="pending_payment">Pagamento Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmada</SelectItem>
            <SelectItem value="canceled">Cancelada</SelectItem>
            <SelectItem value="expired">Expirada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente & Serviço</TableHead>
                <TableHead>Data & Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Nenhuma marcação encontrada com os filtros aplicados.' 
                      : 'Nenhuma marcação encontrada.'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{booking.service.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {booking.professional.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {booking.service.duration_min}min
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {formatDate(booking.start_at, 'dd/MM/yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(booking.start_at, 'HH:mm')} - {formatDate(booking.end_at, 'HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={statusVariants[booking.status]}>
                          {statusLabels[booking.status as keyof typeof statusLabels]}
                        </Badge>
                        {booking.reschedule_client_count > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Reagendado {booking.reschedule_client_count}x
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(booking.service.price)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status !== 'canceled' && booking.status !== 'expired' && (
                            <>
                              <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                Reagendar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => generateRescheduleLink(booking.id)}>
                                Gerar Link de Reagendamento
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleCancel(booking.id)}
                                className="text-destructive"
                              >
                                Cancelar
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            Ver Detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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