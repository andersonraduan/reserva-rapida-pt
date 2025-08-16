import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';

interface SpaceFinancialReport {
  total_gross: number;
  stripe_fees: number;
  platform_commission: number;
  net_amount: number;
  total_bookings: number;
  reschedules: number;
  expired_bookings: number;
  professionals_count: number;
  period: {
    from: string;
    to: string;
  };
}

const Space = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<SpaceFinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      // Mock data aggregated by space
      setReport({
        total_gross: 3750.00,
        stripe_fees: 126.90,
        platform_commission: 375.00,
        net_amount: 3248.10,
        total_bookings: 75,
        reschedules: 8,
        expired_bookings: 5,
        professionals_count: 3,
        period: {
          from: '2025-07-01',
          to: '2025-07-31'
        }
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o relatório.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'O relatório CSV será transferido em breve.'
    });
  };

  const handleExportXLSX = () => {
    toast({
      title: 'Exportação iniciada',
      description: 'O relatório Excel será transferido em breve.'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>A carregar relatório...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Relatório não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Relatório Financeiro - Espaço
          </h1>
          <p className="text-muted-foreground">
            Período: {new Date(report.period.from).toLocaleDateString('pt-PT')} - {new Date(report.period.to).toLocaleDateString('pt-PT')}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(report.total_gross)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Taxas Stripe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                -{formatCurrency(report.stripe_fees)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Comissão Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                -{formatCurrency(report.platform_commission)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Valor Líquido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(report.net_amount)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total de Marcações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.total_bookings}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {report.professionals_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Reagendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {report.reschedules}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Marcações Expiradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {report.expired_bookings}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exportar Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleExportCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
              <Button onClick={handleExportXLSX} variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Exportar XLSX
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Space;