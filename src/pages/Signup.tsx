import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useSignup } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const signupMutation = useSignup();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Criar Conta
            </CardTitle>
            <CardDescription>
              Registe-se para começar a agendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="O seu nome"
                  required
                  disabled={signupMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="exemplo@email.com"
                  required
                  disabled={signupMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+351 912 345 678"
                  disabled={signupMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  required
                  disabled={signupMutation.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-primary"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar sessão
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}