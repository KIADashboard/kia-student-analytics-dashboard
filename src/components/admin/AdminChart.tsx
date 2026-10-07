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

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

ChartJS.defaults.font.family = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const gridColor = '#edf0ee';
const basePlugins = { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, titleFont: { size: 13, weight: 600 }, bodyFont: { size: 12 } } };

export function AdminBarChart({ data, horizontal = false, showLegend = false }: { data: ChartData<'bar'>; horizontal?: boolean; showLegend?: boolean }) {
  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, indexAxis: horizontal ? 'y' : 'x', plugins: { ...basePlugins, legend: { display: showLegend, position: 'top' as const, labels: { color: '#68716d', boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 12 } } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } }, y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } } } }} />;
}

export function AdminLineChart({ data, showLegend = false }: { data: ChartData<'line'>; showLegend?: boolean }) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { ...basePlugins, legend: { ...basePlugins.legend, display: showLegend } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } },
      y: { beginAtZero: false, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 12 } } }
    }
  };
  return <Line data={data} options={options} />;
}

export function AdminDoughnutChart({ data }: { data: ChartData<'doughnut'> }) {
  return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: '#68716d', boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 12 } } }, tooltip: basePlugins.tooltip } }} />;
}