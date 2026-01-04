import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubmissionsChartProps {
  data: { week: string; count: number }[];
}

export function SubmissionsChart({ data }: SubmissionsChartProps) {
  return (
    <div className="card-elevated p-5">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold">Submissions Over Time</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Weekly inquiry trends</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(25 50% 30%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(25 50% 30%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 85%)" vertical={false} />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(25 15% 45%)', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(25 15% 45%)', fontSize: 11 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(40 40% 98%)',
                border: '1px solid hsl(30 20% 85%)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px hsl(25 30% 15% / 0.1)',
              }}
              labelStyle={{ color: 'hsl(25 30% 15%)', fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(25 50% 30%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
