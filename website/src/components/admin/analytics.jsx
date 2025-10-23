// components/Admin/Analytics.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Loader2,
  BarChart3,
  Activity,
  Target
} from "lucide-react";
import AdminLayout from "./layout";
import api from "../../utils/api";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [analyticsData, setAnalyticsData] = useState({
    overview: null,
    subscriberTrends: [],
    newsletterPerformance: [],
    sportEngagement: [],
    timeSeriesData: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [overview, subscribers, newsletters, content] = await Promise.all([
        api.get('/api/newsletter/admin/dashboard/overview/'),
        api.get(`/api/newsletter/admin/subscriber-analytics/?days=${dateRange}`),
        api.get('/api/newsletter/admin/newsletter-analytics/'),
        api.get('/api/newsletter/admin/content-analytics/')
      ]);

      setAnalyticsData({
        overview: overview.data.overview,
        subscriberTrends: subscribers.data.daily_growth || [],
        newsletterPerformance: newsletters.data.recent_campaigns || [],
        sportEngagement: Object.entries(subscribers.data.sport_preferences || {}).map(([name, value]) => ({
          name,
          value
        })),
        timeSeriesData: subscribers.data.daily_growth || []
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const exportData = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Total Subscribers', analyticsData.overview?.total_subscribers],
      ['Newsletters Sent', analyticsData.overview?.sent_newsletters],
      ['Open Rate', `${analyticsData.overview?.open_rate}%`],
      ['Growth Rate', `${analyticsData.overview?.growth_rate}%`]
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="century-gothic text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gravesend-sans text-2xl font-light text-white flex items-center gap-3"
            >
              <BarChart3 size={28} className="text-yellow-400" />
              Analytics & Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Deep dive into your newsletter performance
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(parseInt(e.target.value))}
              className="century-gothic bg-black/50 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <button
              onClick={exportData}
              className="century-gothic bg-yellow-400 text-black px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Avg Open Rate",
              value: `${analyticsData.overview?.open_rate || 0}%`,
              change: "+2.5%",
              trend: "up",
              icon: Eye,
              color: "text-blue-400",
              bg: "bg-blue-500/10"
            },
            {
              title: "Avg Click Rate",
              value: `${analyticsData.overview?.click_rate || 0}%`,
              change: "+1.2%",
              trend: "up",
              icon: MousePointer,
              color: "text-green-400",
              bg: "bg-green-500/10"
            },
            {
              title: "Engagement Score",
              value: "8.4/10",
              change: "+0.3",
              trend: "up",
              icon: Activity,
              color: "text-yellow-400",
              bg: "bg-yellow-500/10"
            },
            {
              title: "Conversion Rate",
              value: "12.5%",
              change: "-0.8%",
              trend: "down",
              icon: Target,
              color: "text-purple-400",
              bg: "bg-purple-500/10"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${metric.bg} rounded`}>
                  <metric.icon size={20} className={metric.color} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {metric.change}
                </div>
              </div>
              <h3 className="gravesend-sans text-2xl font-light text-white mb-1">
                {metric.value}
              </h3>
              <p className="century-gothic text-sm text-gray-400">{metric.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Subscriber Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
        >
          <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-yellow-400" />
            Subscriber Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analyticsData.subscriberTrends}>
              <defs>
                <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total_subscribers" 
                stroke="#fbbf24" 
                strokeWidth={2}
                fill="url(#colorSubscribers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Newsletter Performance & Sport Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Newsletter Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
          >
            <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
              <Mail size={20} className="text-yellow-400" />
              Newsletter Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.newsletterPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="title" 
                  stroke="#9ca3af"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Bar dataKey="open_rate" fill="#fbbf24" name="Open Rate %" />
                <Bar dataKey="click_rate" fill="#f59e0b" name="Click Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sport Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
          >
            <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-yellow-400" />
              Sport Category Engagement
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.sportEngagement}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.sportEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Detailed Metrics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="gravesend-sans text-lg font-light text-white flex items-center gap-2">
              <Calendar size={20} className="text-yellow-400" />
              Daily Performance Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left century-gothic text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-right century-gothic text-sm font-medium text-gray-300">New Subscribers</th>
                  <th className="px-4 py-3 text-right century-gothic text-sm font-medium text-gray-300">Total Subscribers</th>
                  <th className="px-4 py-3 text-right century-gothic text-sm font-medium text-gray-300">Growth Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {analyticsData.subscriberTrends.slice(0, 10).map((day, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 century-gothic text-white">
                      {formatDate(day.date)}
                    </td>
                    <td className="px-4 py-3 text-right century-gothic text-green-400">
                      +{day.new_subscriptions || 0}
                    </td>
                    <td className="px-4 py-3 text-right century-gothic text-white">
                      {day.total_subscribers?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right century-gothic">
                      <span className={`${day.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {day.growth_rate >= 0 ? '+' : ''}{day.growth_rate?.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;