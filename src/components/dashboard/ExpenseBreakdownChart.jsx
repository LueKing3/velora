import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategoryById } from '../../data/categories';
import { formatCurrency } from '../../utils/currency';

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const cat = getCategoryById(d.payload.category);
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{cat?.name || d.payload.category}</p>
      <p className="tooltip-value">{formatCurrency(d.value, currency)} ({d.payload.percentage}%)</p>
    </div>
  );
};

const ExpenseBreakdownChart = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
        No expense data this month
      </div>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    name: getCategoryById(d.category)?.name || d.category,
    color: getCategoryById(d.category)?.color || '#94a3b8',
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={78}
              paddingAngle={3}
              dataKey="amount"
              animationBegin={200}
              animationDuration={800}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="breakdown-legend">
        {chartData.slice(0, 5).map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-name">{d.name}</span>
            <span className="legend-pct">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseBreakdownChart;
