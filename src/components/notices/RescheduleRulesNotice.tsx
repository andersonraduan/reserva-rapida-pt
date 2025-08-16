import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Clock, RotateCcw, Ban } from 'lucide-react';

export const RescheduleRulesNotice = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Regras de reagendamento:</p>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Apenas horários que iniciem em pelo menos 24 horas</span>
            </li>
            <li className="flex items-start gap-2">
              <RotateCcw className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Máximo de 1 reagendamento por marcação</span>
            </li>
            <li className="flex items-start gap-2">
              <Ban className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>Não é possível alterar o tipo de serviço</span>
            </li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};