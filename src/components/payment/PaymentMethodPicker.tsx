import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import type { ConfigGlobal } from '@/api/types';

interface PaymentMethodPickerProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  config: ConfigGlobal;
  disabled?: boolean;
}

export const PaymentMethodPicker = ({
  selectedMethod,
  onMethodChange,
  config,
  disabled = false
}: PaymentMethodPickerProps) => {
  const methods = [
    {
      id: 'card',
      name: 'Cartão de Crédito/Débito',
      description: 'Pagamento instantâneo com Visa, Mastercard',
      icon: CreditCard,
      enabled: config.payment_methods_enabled.includes('card')
    },
    {
      id: 'mb_way',
      name: 'MB WAY',
      description: 'Pagamento através da aplicação MB WAY',
      icon: Smartphone,
      enabled: config.payment_methods_enabled.includes('mb_way')
    },
    {
      id: 'multibanco',
      name: 'Multibanco',
      description: 'Transferência bancária ou terminal Multibanco',
      icon: Building2,
      enabled: config.payment_methods_enabled.includes('multibanco')
    }
  ];

  const enabledMethods = methods.filter(method => method.enabled);

  if (enabledMethods.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Nenhum método de pagamento disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <RadioGroup
      value={selectedMethod}
      onValueChange={onMethodChange}
      disabled={disabled}
      className="space-y-3"
    >
      {enabledMethods.map((method) => {
        const Icon = method.icon;
        return (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              selectedMethod === method.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  disabled={disabled}
                />
                <Icon className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <Label
                    htmlFor={method.id}
                    className="text-base font-medium cursor-pointer"
                  >
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </RadioGroup>
  );
};