'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type MonthlyReport = {
  id: number;
  title: string;
  data: {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    checkIns: number;
    checkOuts: number;
    revenue: number;
    roomStats: Record<string, number>;
  };
};

export default function AdminReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/monthly?month=${month}&year=${year}`, {
        cache: 'no-store',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to generate report');
      }

      setReport(result.data);
      toast.success('Report generated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">
            Reports
          </h1>
          <p className="text-forest-600 dark:text-mist-400">
            Generate monthly booking reports
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} disabled={!report}>
          <Download className="w-4 h-4 mr-2" />
          Print / Save PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Month</Label>
            <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" min={2020} value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <Button className="bg-forest-600 hover:bg-forest-700 text-white" onClick={generateReport} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-600" />
              {report.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm text-forest-500">Total</p><p className="text-2xl font-bold">{report.data.totalBookings}</p></div>
              <div><p className="text-sm text-forest-500">Confirmed</p><p className="text-2xl font-bold">{report.data.confirmedBookings}</p></div>
              <div><p className="text-sm text-forest-500">Pending</p><p className="text-2xl font-bold">{report.data.pendingBookings}</p></div>
              <div><p className="text-sm text-forest-500">Revenue</p><p className="text-2xl font-bold">Rs. {report.data.revenue.toLocaleString()}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm text-forest-500">Cancelled</p><p className="text-xl font-bold">{report.data.cancelledBookings}</p></div>
              <div><p className="text-sm text-forest-500">Check-ins</p><p className="text-xl font-bold">{report.data.checkIns}</p></div>
              <div><p className="text-sm text-forest-500">Check-outs</p><p className="text-xl font-bold">{report.data.checkOuts}</p></div>
            </div>
            <div>
              <h3 className="font-semibold text-forest-800 dark:text-white mb-3">Room / Category Statistics</h3>
              <div className="space-y-2">
                {Object.entries(report.data.roomStats).map(([name, count]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
