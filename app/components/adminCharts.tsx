'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
);

interface LocationStat {
  id: number;
  name: string;
  itemCount: number;
  items: string[];
}

interface KeywordStat {
  word: string;
  count: number;
}

interface TrendDay {
  date: string;
  count: number;
}

interface AnalyticsData {
  totalItems: number;
  claimedItems: number;
  unclaimedItems: number;
  returnRate: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalClaims: number;
  openClaims: number;
  approvedClaims: number;
  totalLookouts: number;
  openLookouts: number;
  closedLookouts: number;
  locationStats: LocationStat[];
  topKeywords: KeywordStat[];
  submissionTrend: TrendDay[];
}

export default function AdminCharts({ analytics }: { analytics: AnalyticsData }) {
  const doughnutData = {
    labels: ['Claimed', 'Unclaimed'],
    datasets: [
      {
        data: [analytics.claimedItems, analytics.unclaimedItems],
        backgroundColor: ['#22c55e', '#eab308'],
        borderColor: ['#16a34a', '#ca8a04'],
        borderWidth: 2,
      },
    ],
  };

  const locationData = {
    labels: analytics.locationStats.slice(0, 10).map((l) => l.name),
    datasets: [
      {
        label: 'Items',
        data: analytics.locationStats.slice(0, 10).map((l) => l.itemCount),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  };

  const trendData = {
    labels: analytics.submissionTrend.map((d) => dayjs(d.date).format('MMM D')),
    datasets: [
      {
        label: 'Submissions',
        data: analytics.submissionTrend.map((d) => d.count),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { size: 12 },
          boxWidth: 12,
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Doughnut: Claimed vs Unclaimed */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-md px-6 py-5">
        <p className="text-sm font-bold text-gray-800 mb-1">Claimed vs Unclaimed</p>
        <p className="text-xs text-gray-400 mb-3">{analytics.returnRate}% return rate</p>
        <div className="h-52 flex items-center justify-center">
          <Doughnut data={doughnutData} options={{ ...commonOptions, cutout: '60%' }} />
        </div>
      </div>

      {/* Bar: Items by Location */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-md px-6 py-5">
        <p className="text-sm font-bold text-gray-800 mb-1">Items by Location</p>
        <p className="text-xs text-gray-400 mb-3">Top 10 locations</p>
        <div className="h-52">
          <Bar
            data={locationData}
            options={{
              ...commonOptions,
              indexAxis: 'y' as const,
              scales: {
                x: { beginAtZero: true, grid: { display: false } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>

      {/* Line: Submission Trend */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-md px-6 py-5">
        <p className="text-sm font-bold text-gray-800 mb-1">Submission Trend</p>
        <p className="text-xs text-gray-400 mb-3">Last 30 days</p>
        <div className="h-52">
          <Line
            data={trendData}
            options={{
              ...commonOptions,
              scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
                y: { beginAtZero: true, grid: { display: true, color: '#f3f4f6' } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
