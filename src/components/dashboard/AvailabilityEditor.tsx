import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Clock, Calendar } from 'lucide-react';

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const AvailabilityEditor = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [rules, setRules] = useState<Record<number, Array<{start: string, end: string}>>>({
    0: [{start: '09:00', end: '18:00'}], // Monday
    1: [{start: '09:00', end: '18:00'}], // Tuesday  
    2: [{start: '09:00', end: '18:00'}], // Wednesday
    3: [{start: '09:00', end: '18:00'}], // Thursday
    4: [{start: '09:00', end: '18:00'}], // Friday
    5: [{start: '09:00', end: '17:00'}], // Saturday
    6: [] // Sunday - closed
  });

  const addInterval = () => {
    setRules(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), {start: '09:00', end: '17:00'}]
    }));
  };

  const removeInterval = (index: number) => {
    setRules(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index)
    }));
  };

  const updateInterval = (index: number, field: 'start' | 'end', value: string) => {
    setRules(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((interval, i) => 
        i === index ? {...interval, [field]: value} : interval
      )
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Horário Semanal</TabsTrigger>
          <TabsTrigger value="exceptions">Exceções</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dias da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weekDays.map((day, index) => (
                    <Button
                      key={index}
                      variant={selectedDay === index ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedDay(index)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {day}
                      <Badge variant="secondary" className="ml-auto">
                        {rules[index]?.length || 0} intervalos
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {weekDays[selectedDay]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rules[selectedDay]?.map((interval, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      type="time"
                      value={interval.start}
                      onChange={(e) => updateInterval(index, 'start', e.target.value)}
                    />
                    <span>até</span>
                    <Input
                      type="time"
                      value={interval.end}
                      onChange={(e) => updateInterval(index, 'end', e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInterval(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <Button onClick={addInterval} variant="outline" className="w-full">
                  Adicionar Intervalo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exceptions">
          <Card>
            <CardHeader>
              <CardTitle>Exceções (Datas Específicas)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade de exceções em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview dos Horários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekDays.map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{day}</span>
                    <div className="flex gap-2">
                      {rules[index]?.length ? (
                        rules[index].map((interval, i) => (
                          <Badge key={i} variant="outline">
                            {interval.start} - {interval.end}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary">Fechado</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};