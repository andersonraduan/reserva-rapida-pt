import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatDate, formatTime, addDays } from '@/utils/date';
import type { TimeSlot } from '@/api/types';

interface CalendarSlotsProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  serviceDuration?: number;
  disabled?: boolean;
}

export const CalendarSlots = ({
  slots,
  selectedSlot,
  onSlotSelect,
  serviceDuration,
  disabled = false
}: CalendarSlotsProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = new Date(slot.start).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return date;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(currentWeekStart, direction === 'next' ? 7 : -7);
    setCurrentWeekStart(newDate);
  };

  const isSlotSelected = (slot: TimeSlot) => {
    return selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários Disponíveis
            {serviceDuration && (
              <span className="text-sm font-normal text-muted-foreground">
                ({serviceDuration}min)
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateWeek('prev')}
              disabled={disabled}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {formatDate(currentWeekStart, 'MMM yyyy')}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateWeek('next')}
              disabled={disabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((date) => {
            const dateKey = date.toDateString();
            const daySlots = slotsByDate[dateKey] || [];
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = isPastDate(date);

            return (
              <div key={dateKey} className="space-y-2">
                <div className="text-center">
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {formatDate(date, 'EEE')}
                  </div>
                  <div className={`text-xs ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {formatDate(date, 'd MMM')}
                  </div>
                </div>

                <div className="space-y-1 min-h-[120px]">
                  {daySlots.map((slot) => (
                    <Button
                      key={`${slot.start}-${slot.end}`}
                      variant={isSlotSelected(slot) ? "default" : "outline"}
                      size="sm"
                      className={`w-full text-xs h-8 ${
                        isSlotSelected(slot) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => onSlotSelect(slot)}
                      disabled={disabled || isPast}
                    >
                      {formatTime(slot.start)}
                    </Button>
                  ))}
                  
                  {daySlots.length === 0 && !isPast && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      Sem horários
                    </div>
                  )}
                  
                  {isPast && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      Data passada
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {slots.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum horário disponível neste período.
          </div>
        )}
      </CardContent>
    </Card>
  );
};