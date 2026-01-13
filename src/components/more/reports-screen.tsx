// File: src/components/more/reports-screen.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SimpleCalendar } from '@/components/ui/simple-calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data for report
const mockReportData = {
  title: 'Sales Summary',
  period: 'Jul 1, 2024 - Jul 25, 2024',
  totalSales: '£4,580.50',
  totalOrders: 124,
  topSellingItems: [
    { id: 1, name: 'Erbauer Saw Blade', unitsSold: 35, revenue: '£350.00' },
    { id: 2, name: 'Korkmaz Tea Kettle', unitsSold: 28, revenue: '£336.00' },
    { id: 3, name: 'Vintage Leatherbound Journal', unitsSold: 22, revenue: '£561.00' },
  ],
};

type ReportData = typeof mockReportData | null;

export function ReportsScreen() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 6, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState<string>('sales-summary');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportData(null);
    setTimeout(() => {
      const formattedStartDate = startDate ? format(startDate, 'MMM d, yyyy') : '';
      const formattedEndDate = endDate ? format(endDate, 'MMM d, yyyy') : '';
      setReportData({
        ...mockReportData,
        period: `${formattedStartDate} - ${formattedEndDate}`,
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleSaveAsPdf = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input, {
        scale: 2,
        backgroundColor: '#17253d',
        useCORS: true,
        onclone: (document) => {
            // Apply dark theme styles to the cloned document for canvas rendering
            const clonedElement = document.getElementById('report-content');
            if (clonedElement) {
                clonedElement.style.color = '#e4e4e7'; // zinc-200
                clonedElement.querySelectorAll('h3').forEach(el => el.style.color = '#fafafa'); // zinc-50
                clonedElement.querySelectorAll('p').forEach(el => el.style.color = '#a1a1aa'); // zinc-400
                clonedElement.querySelectorAll('th').forEach(el => el.style.color = '#a1a1aa');
                clonedElement.querySelectorAll('td').forEach(el => el.style.color = '#e4e4e7');
            }
        }
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date Picker */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="focus-glow w-full justify-start text-left font-normal bg-[#1e2d50] border-none text-white rounded-lg hover:bg-[#1e2d50] hover:text-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Start Date</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/90 backdrop-blur-xl border-white/20 text-white p-0 w-auto max-w-[340px]">
                  <SimpleCalendar selected={startDate} onSelect={setStartDate} />
                </DialogContent>
              </Dialog>

              {/* End Date Picker */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="focus-glow w-full justify-start text-left font-normal bg-[#1e2d50] border-none text-white rounded-lg hover:bg-[#1e2d50] hover:text-white">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>End Date</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/90 backdrop-blur-xl border-white/20 text-white p-0 w-auto max-w-[340px]">
                  <SimpleCalendar selected={endDate} onSelect={setEndDate} disabled={(day) => day < (startDate || new Date(0)) || day > new Date()} />
                </DialogContent>
              </Dialog>
            </div>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="focus-glow w-full bg-[#1e2d50] border-none text-white rounded-lg">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2d50] text-white border-white/10">
                <SelectItem value="sales-summary">Sales Summary</SelectItem>
                <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                <SelectItem value="inventory-status">Inventory Status</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleGenerateReport} disabled={isGenerating || !startDate || !endDate} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </CardContent>
        </Card>

        {reportData && (
          <Card className="bg-card/50 border-white/10" id="report-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white/90">{reportData.title}</CardTitle>
                <CardDescription className="text-white/60">{reportData.period}</CardDescription>
              </div>
              <Button onClick={handleSaveAsPdf} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Save as PDF
              </Button>
            </CardHeader>
            <CardContent ref={reportRef} id="report-content" className="text-white/80 p-6 bg-[#17253d] rounded-b-lg">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-background/50 p-4 rounded-lg">
                        <p className="text-sm text-white/60">Total Sales</p>
                        <p className="text-2xl font-bold text-white/90">{reportData.totalSales}</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-lg">
                        <p className="text-sm text-white/60">Total Orders</p>
                        <p className="text-2xl font-bold text-white/90">{reportData.totalOrders}</p>
                    </div>
                </div>

                <h3 className="text-md font-semibold mb-2 text-white/90">Top Selling Items</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="p-2 text-sm font-medium text-white/60">Item</th>
                                <th className="p-2 text-sm font-medium text-white/60 text-center">Units Sold</th>
                                <th className="p-2 text-sm font-medium text-white/60 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.topSellingItems.map(item => (
                                <tr key={item.id} className="border-b border-white/10">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2 text-center">{item.unitsSold}</td>
                                    <td className="p-2 text-right">{item.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
