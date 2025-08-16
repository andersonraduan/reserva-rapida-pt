import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/api/client';
import { toast } from '@/hooks/use-toast';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const useLogin = () => {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => apiClient.login(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      queryClient.invalidateQueries();
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${response.user.name}!`,
      });
    },
    onError: () => {
      toast({
        title: 'Erro no login',
        description: 'Verifique as suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useSignup = () => {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupData) => apiClient.signup(data),
    onSuccess: (response) => {
      login(response.user, response.token);
      queryClient.invalidateQueries();
      toast({
        title: 'Conta criada com sucesso',
        description: `Bem-vindo, ${response.user.name}!`,
      });
    },
    onError: () => {
      toast({
        title: 'Erro no registo',
        description: 'Ocorreu um erro ao criar a conta. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast({
      title: 'Sessão terminada',
      description: 'Até breve!',
    });
  };
};