import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Clock, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';

interface MultibancoReferenceProps {
  entity: string;
  reference: string;
  amount: number;
  expiresAt: string;
  onExpired?: () => void;
}

export const MultibancoReference = ({
  entity,
  reference,
  amount,
  expiresAt,
  onExpired
}: MultibancoReferenceProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expirado');
        onExpired?.();
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copiado`,
      description: 'Colado na área de transferência.'
    });
  };

  return (
    <Card className={`${isExpired ? 'border-destructive bg-destructive/5' : 'border-warning bg-warning/5'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Referência Multibanco
          {isExpired ? (
            <Badge variant="destructive">Expirado</Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeLeft}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExpired && (
          <div className="bg-background/80 p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-3">
              Use os dados abaixo para efetuar o pagamento através de Multibanco, 
              homebanking ou aplicação do seu banco.
            </p>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Entidade:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">{entity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(entity, 'Entidade')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Referência:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">{reference}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(reference, 'Referência')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Valor:</span>
                <span className="font-mono text-lg font-bold text-primary">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="text-center py-4">
            <p className="text-destructive font-medium mb-2">
              A referência expirou
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              O slot foi libertado. Pode escolher um novo horário.
            </p>
          </div>
        )}

        <div className="bg-muted/50 p-3 rounded text-sm">
          <p className="font-medium mb-1">⚠️ Importante:</p>
          <p>
            O seu horário está bloqueado até ao pagamento ou expiração. 
            Após confirmação do pagamento, receberá um email com os detalhes da marcação.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};