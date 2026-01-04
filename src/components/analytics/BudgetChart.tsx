import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetChartProps {
  data: Record<string, number>;
}

export function BudgetChart({ data }: BudgetChartProps) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      // Sort by budget range (roughly)
      const order = ['₹20L - ₹30L', '₹30L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹2Cr', '₹2Cr+'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <div className="card-elevated p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-display text-base sm:text-lg font-semibold">Budget Range Breakdown</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Submissions by budget category</p>
      </div>
      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 85%)" horizontal={true} vertical={false} />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(25 15% 45%)', fontSize: 10 }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(25 15% 45%)', fontSize: 9 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(40 40% 98%)',
                border: '1px solid hsl(30 20% 85%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              cursor={{ fill: 'hsl(28 35% 82% / 0.3)' }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(25 50% 30%)" 
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
