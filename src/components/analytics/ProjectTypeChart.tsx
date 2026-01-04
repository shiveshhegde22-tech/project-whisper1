import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProjectTypeChartProps {
  data: Record<string, number>;
}

const COLORS = [
  'hsl(25 50% 35%)',
  'hsl(35 45% 50%)',
  'hsl(28 35% 65%)',
  'hsl(40 30% 75%)',
  'hsl(30 25% 55%)',
  'hsl(20 40% 45%)',
  'hsl(45 35% 60%)',
];

export function ProjectTypeChart({ data }: ProjectTypeChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="card-elevated p-5">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">Project Type Distribution</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Breakdown by project category</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(40 40% 98%)',
                border: '1px solid hsl(30 20% 85%)',
                borderRadius: '8px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => <span className="text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
