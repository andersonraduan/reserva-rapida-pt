import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Iniciar Sessão
            </CardTitle>
            <CardDescription>
              Entre na sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-primary"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-xs text-primary-700 font-medium mb-1">Contas de demonstração:</p>
              <p className="text-xs text-primary-600">Cliente: ana@example.com</p>
              <p className="text-xs text-primary-600">Profissional: joao@example.com</p>
              <p className="text-xs text-primary-600">Palavra-passe: qualquer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}