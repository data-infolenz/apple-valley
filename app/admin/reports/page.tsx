'use client';

import { useEffect, useState } from 'react';
import { FileText, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type MonthlyReport = {
  id: number;
  title: string;
  data: MonthlyReportData;
};

type MonthlyReportBooking = {
  bookingId: string;
  guestSnapshot?: {
    name?: string;
    phone?: string;
  };
  rooms?: Array<{
    roomTypeName?: string;
  }>;
  checkIn: string;
  checkOut: string;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
};

type MonthlyReportData = {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  checkIns: number;
  checkOuts: number;
  revenue: number;
  roomStats: Record<string, number>;
  bookings?: MonthlyReportBooking[];
};

const emptyReportData: MonthlyReportData = {
  totalBookings: 0,
  confirmedBookings: 0,
  pendingBookings: 0,
  cancelledBookings: 0,
  checkIns: 0,
  checkOuts: 0,
  revenue: 0,
  roomStats: {},
  bookings: [],
};

function normalizeReport(rawReport: Omit<MonthlyReport, 'data'> & { data: MonthlyReportData | string }) {
  const parsedData = typeof rawReport.data === 'string'
    ? JSON.parse(rawReport.data) as Partial<MonthlyReportData>
    : rawReport.data;

  return {
    ...rawReport,
    data: {
      ...emptyReportData,
      ...parsedData,
      roomStats: parsedData.roomStats || {},
      bookings: parsedData.bookings || [],
    },
  };
}

function formatCurrency(value: number | undefined) {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

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

      setReport(normalizeReport(result.data));
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
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
          }

          aside,
          header,
          .no-print {
            display: none !important;
          }

          main {
            padding: 0 !important;
          }

          .print-report {
            display: block !important;
            color: #111827 !important;
          }

          .print-report * {
            color: #111827 !important;
            box-shadow: none !important;
          }

          .print-card {
            border: 1px solid #d1d5db !important;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-800 dark:text-white">
            Reports
          </h1>
          <p className="text-forest-600 dark:text-mist-400">
            Generate monthly booking reports
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} disabled={!report}>
          <Printer className="w-4 h-4 mr-2" />
          Print / Save PDF
        </Button>
      </div>

      <Card className="no-print">
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
        <Card className="no-print">
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
              <div><p className="text-sm text-forest-500">Revenue</p><p className="text-2xl font-bold">{formatCurrency(report.data.revenue)}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm text-forest-500">Cancelled</p><p className="text-xl font-bold">{report.data.cancelledBookings}</p></div>
              <div><p className="text-sm text-forest-500">Check-ins</p><p className="text-xl font-bold">{report.data.checkIns}</p></div>
              <div><p className="text-sm text-forest-500">Check-outs</p><p className="text-xl font-bold">{report.data.checkOuts}</p></div>
            </div>
            <div>
              <h3 className="font-semibold text-forest-800 dark:text-white mb-3">Room / Category Statistics</h3>
              <div className="space-y-2">
                {Object.entries(report.data.roomStats).length === 0 && (
                  <p className="text-sm text-forest-500">No room bookings for this month.</p>
                )}
                {Object.entries(report.data.roomStats).map(([name, count]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-forest-800 dark:text-white mb-3">Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-forest-500">
                      <th className="py-2 font-medium">Booking ID</th>
                      <th className="py-2 font-medium">Guest</th>
                      <th className="py-2 font-medium">Room</th>
                      <th className="py-2 font-medium">Check-in</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report.data.bookings || []).map((booking) => (
                      <tr key={booking.bookingId} className="border-b">
                        <td className="py-2 font-mono">{booking.bookingId}</td>
                        <td className="py-2">{booking.guestSnapshot?.name || '-'}</td>
                        <td className="py-2">{booking.rooms?.[0]?.roomTypeName || '-'}</td>
                        <td className="py-2">{formatDate(booking.checkIn)}</td>
                        <td className="py-2 capitalize">{booking.bookingStatus.replace('_', ' ')}</td>
                        <td className="py-2 text-right">{formatCurrency(booking.totalAmount)}</td>
                      </tr>
                    ))}
                    {(report.data.bookings || []).length === 0 && (
                      <tr>
                        <td className="py-4 text-center text-forest-500" colSpan={6}>No bookings found for this month.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {report && (
        <div className="print-report hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Apple Valley</h1>
            <p className="text-sm">Printable Monthly Report</p>
            <p className="text-sm">{report.title}</p>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              ['Total', report.data.totalBookings],
              ['Confirmed', report.data.confirmedBookings],
              ['Pending', report.data.pendingBookings],
              ['Cancelled', report.data.cancelledBookings],
              ['Check-ins', report.data.checkIns],
              ['Check-outs', report.data.checkOuts],
              ['Revenue', formatCurrency(report.data.revenue)],
            ].map(([label, value]) => (
              <div key={label} className="print-card p-3">
                <p className="text-xs">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
          </div>
          <h2 className="mb-2 text-lg font-bold">Room / Category Statistics</h2>
          <table className="mb-6 w-full border-collapse text-sm">
            <tbody>
              {Object.entries(report.data.roomStats).map(([name, count]) => (
                <tr key={name}>
                  <td className="border p-2">{name}</td>
                  <td className="border p-2 text-right">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="mb-2 text-lg font-bold">Bookings</h2>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border p-2 text-left">Booking ID</th>
                <th className="border p-2 text-left">Guest</th>
                <th className="border p-2 text-left">Room</th>
                <th className="border p-2 text-left">Check-in</th>
                <th className="border p-2 text-left">Check-out</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(report.data.bookings || []).map((booking) => (
                <tr key={booking.bookingId}>
                  <td className="border p-2">{booking.bookingId}</td>
                  <td className="border p-2">{booking.guestSnapshot?.name || '-'}</td>
                  <td className="border p-2">{booking.rooms?.[0]?.roomTypeName || '-'}</td>
                  <td className="border p-2">{formatDate(booking.checkIn)}</td>
                  <td className="border p-2">{formatDate(booking.checkOut)}</td>
                  <td className="border p-2">{booking.bookingStatus.replace('_', ' ')}</td>
                  <td className="border p-2 text-right">{formatCurrency(booking.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
