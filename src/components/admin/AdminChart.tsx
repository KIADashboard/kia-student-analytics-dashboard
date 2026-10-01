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

const gridColor = '#edf0ee';
const basePlugins = { legend: { display: false }, tooltip: { backgroundColor: '#1f2926', padding: 10, titleFont: { size: 11 }, bodyFont: { size: 10 } } };

export function AdminBarChart({ data, horizontal = false, showLegend = false }: { data: ChartData<'bar'>; horizontal?: boolean; showLegend?: boolean }) {
  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, indexAxis: horizontal ? 'y' : 'x', plugins: { ...basePlugins, legend: { display: showLegend, position: 'top' as const, labels: { color: '#68716d', boxWidth: 9, boxHeight: 9, padding: 12, font: { size: 9 } } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 9 } } }, y: { beginAtZero: true, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 9 } } } } }} />;
}

export function AdminLineChart({ data, showLegend = false }: { data: ChartData<'line'>; showLegend?: boolean }) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { ...basePlugins, legend: { ...basePlugins.legend, display: showLegend } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: '#78817d', font: { size: 9 } } },
      y: { beginAtZero: false, grid: { color: gridColor }, border: { display: false }, ticks: { color: '#78817d', font: { size: 9 } } }
    }
  };
  return <Line data={data} options={options} />;
}

export function AdminDoughnutChart({ data }: { data: ChartData<'doughnut'> }) {
  return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: '#68716d', boxWidth: 9, boxHeight: 9, padding: 14, font: { size: 9 } } }, tooltip: basePlugins.tooltip } }} />;
}
