import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
  type ChartData
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const gridColor = '#f1f5f9';
const basePlugins = {
  legend: { display: false },
  tooltip: {
    backgroundColor: '#0f172a',
    padding: 10,
    cornerRadius: 8,
    boxPadding: 4,
    usePointStyle: true,
    titleFont: { size: 12, family: 'Inter, system-ui, sans-serif', weight: 'bold' as const },
    bodyFont: { size: 11, family: 'Inter, system-ui, sans-serif' }
  }
};

export function AdminBarChart({
  data,
  horizontal = false,
  showLegend = false
}: {
  data: ChartData<'bar'>;
  horizontal?: boolean;
  showLegend?: boolean;
}) {
  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          ...basePlugins,
          legend: {
            display: showLegend,
            position: 'top' as const,
            labels: {
              color: '#475569',
              boxWidth: 10,
              boxHeight: 10,
              padding: 12,
              font: { size: 11, family: 'Inter, system-ui, sans-serif' }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: 'Inter, system-ui, sans-serif' }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            border: { display: false },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: 'Inter, system-ui, sans-serif' }
            }
          }
        }
      }}
    />
  );
}

export function AdminLineChart({
  data,
  showLegend = false
}: {
  data: ChartData<'line'>;
  showLegend?: boolean;
}) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...basePlugins,
      legend: {
        ...basePlugins.legend,
        display: showLegend,
        position: 'top' as const,
        labels: {
          color: '#475569',
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter, system-ui, sans-serif' }
        }
      },
      y: {
        beginAtZero: false,
        grid: { color: gridColor },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter, system-ui, sans-serif' }
        }
      }
    }
  };
  return <Line data={data} options={options} />;
}

export function AdminDoughnutChart({ data }: { data: ChartData<'doughnut'> }) {
  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#475569',
              boxWidth: 10,
              boxHeight: 10,
              padding: 14,
              font: { size: 11, family: 'Inter, system-ui, sans-serif' }
            }
          },
          tooltip: basePlugins.tooltip
        }
      }}
    />
  );
}