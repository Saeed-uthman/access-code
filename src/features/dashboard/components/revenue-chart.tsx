import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { formatCurrency } from '@/utils/format';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  title?: string;
}

export function RevenueChart({ data, title = 'Revenue Overview' }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No revenue data available</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end gap-2 h-48">
              {data.slice(-6).map((item, idx) => {
                const height = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">{formatCurrency(item.revenue)}</span>
                    <div
                      className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
