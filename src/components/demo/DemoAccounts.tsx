import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth';
import { useLogin } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Users, Settings, FileText, LogOut } from 'lucide-react';

export const DemoAccounts = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const demoAccounts = [
    {
      name: 'Ana Silva (Cliente)',
      email: 'ana@exemplo.pt',
      password: 'demo123',
      role: 'client',
      description: 'Pode agendar serviços e reagendar marcações',
      pages: ['/']
    },
    {
      name: 'João Barber (Profissional)',
      email: 'joao@exemplo.pt', 
      password: 'demo123',
      role: 'professional',
      description: 'Gestão de serviços, disponibilidade e marcações',
      pages: ['/dashboard/professional', '/reports/professional/1']
    },
    {
      name: 'Maria Admin (Espaço)',
      email: 'maria@exemplo.pt',
      password: 'demo123', 
      role: 'space_admin',
      description: 'Gestão de profissionais e serviços do espaço',
      pages: ['/dashboard/space', '/reports/space/1']
    },
    {
      name: 'Admin Master',
      email: 'admin@exemplo.pt',
      password: 'demo123',
      role: 'master_admin',
      description: 'Configurações globais e KPIs da plataforma',
      pages: ['/dashboard/admin']
    }
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      await login.mutateAsync({ email, password });
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (user) {
    const currentAccount = demoAccounts.find(acc => acc.role === user.role);
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Conta Ativa: {user.name}
            <Badge variant="secondary">{user.role}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {currentAccount?.description}
          </p>
          
          <div className="space-y-2">
            <p className="font-medium">Páginas disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {currentAccount?.pages.map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(page)}
                >
                  {page === '/' ? 'Início' : page.replace('/', '').replace('dashboard/', 'Dashboard ').replace('reports/', 'Relatórios ')}
                </Button>
              ))}
            </div>
          </div>
          
          <Button variant="destructive" onClick={logout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Terminar Sessão
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {demoAccounts.map((account) => (
        <Card key={account.email} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {account.role === 'client' && <User className="h-5 w-5" />}
              {account.role === 'professional' && <Users className="h-5 w-5" />}
              {account.role === 'space_admin' && <Settings className="h-5 w-5" />}
              {account.role === 'master_admin' && <FileText className="h-5 w-5" />}
              {account.name}
              <Badge variant="outline">{account.role}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {account.description}
            </p>
            
            <div className="text-xs text-muted-foreground">
              <p>Email: {account.email}</p>
              <p>Password: {account.password}</p>
            </div>
            
            <Button 
              onClick={() => handleDemoLogin(account.email, account.password)}
              disabled={login.isPending}
              className="w-full"
            >
              {login.isPending ? 'A fazer login...' : 'Entrar como ' + account.role}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};