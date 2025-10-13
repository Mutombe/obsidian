// components/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Mail,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Trophy,
  Loader2,
  RefreshCw,
  Crown,
  Globe,
  BarChart3,
  Activity
} from "lucide-react";
import AdminLayout from "./layout";
import { fetchDashboardOverview, fetchSubscriberAnalytics, fetchNewsletterAnalytics, fetchContentAnalytics } from './../../redux/slices/dashboardSlice';
import { selectAuth } from "../../redux/slices/authSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    overview,
    subscriberAnalytics,
    newsletterAnalytics,
    contentAnalytics,
    overviewStatus,
    lastUpdated
  } = useSelector(state => state.dashboard);
  
  const { user } = useSelector(selectAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadDashboardData();
  }, [dispatch, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        dispatch(fetchDashboardOverview()),
        dispatch(fetchSubscriberAnalytics(selectedPeriod)),
        dispatch(fetchNewsletterAnalytics()),
        dispatch(fetchContentAnalytics())
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];

  if (overviewStatus === 'loading') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="century-gothic text-gray-400">Loading dashboard...</p>
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
              <Crown size={28} className="text-yellow-400" />
              Welcome back, {user?.first_name || user?.username}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Obsidian Newsletter Dashboard • {user?.role}
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="century-gothic bg-black/50 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="century-gothic bg-yellow-400 text-black px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Total Subscribers",
                value: overview.overview.total_subscribers,
                change: `+${overview.overview.recent_subscriptions} this week`,
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                title: "Newsletters Sent",
                value: overview.overview.sent_newsletters,
                change: `${overview.overview.total_newsletters} total`,
                icon: Mail,
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                title: "Open Rate",
                value: `${overview.overview.open_rate}%`,
                change: "Average performance",
                icon: Eye,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10"
              },
              {
                title: "Growth Rate",
                value: `${overview.overview.growth_rate > 0 ? '+' : ''}${overview.overview.growth_rate}%`,
                change: "Week over week",
                icon: TrendingUp,
                color: overview.overview.growth_rate >= 0 ? "text-emerald-400" : "text-red-400",
                bg: overview.overview.growth_rate >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
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
                  <span className="text-xs text-gray-400">
                    {lastUpdated && `Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
                  </span>
                </div>
                <div>
                  <h3 className="gravesend-sans text-2xl font-light text-white mb-1">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </h3>
                  <p className="century-gothic text-sm text-gray-400">{metric.title}</p>
                  <p className="century-gothic text-xs text-gray-500 mt-1">{metric.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscriber Growth Chart */}
          {subscriberAnalytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-yellow-400" />
                Subscriber Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={subscriberAnalytics.daily_growth}>
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
                  <Line 
                    type="monotone" 
                    dataKey="total_subscribers" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Sport Preferences Chart */}
          {subscriberAnalytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-yellow-400" />
                Sport Preferences
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(subscriberAnalytics.sport_preferences).map(([name, value]) => ({
                      name,
                      value
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(subscriberAnalytics.sport_preferences).map((entry, index) => (
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
          )}
        </div>

        {/* Newsletter Performance */}
        {newsletterAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
          >
            <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
              <Mail size={20} className="text-yellow-400" />
              Recent Newsletter Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={newsletterAnalytics.recent_campaigns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="title" 
                  stroke="#9ca3af"
                  fontSize={12}
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
        )}

        {/* Content Analytics */}
        {contentAnalytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-yellow-400" />
                Content by Sport
              </h3>
              <div className="space-y-3">
                {Object.entries(contentAnalytics.sport_content).map(([sport, data]) => (
                  <div key={sport} className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{data.icon}</span>
                      <span className="century-gothic text-white">{sport}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{data.total_articles}</p>
                      <p className="text-xs text-gray-400">
                        +{data.recent_articles} this week
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/30 backdrop-blur-sm border border-white/10 p-6"
            >
              <h3 className="gravesend-sans text-lg font-light text-white mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-yellow-400" />
                Fixture Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="century-gothic text-gray-300">Total Fixtures</span>
                  <span className="text-white font-medium">
                    {contentAnalytics.fixture_stats.total_fixtures}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="century-gothic text-gray-300">Upcoming</span>
                  <span className="text-yellow-400 font-medium">
                    {contentAnalytics.fixture_stats.upcoming_fixtures}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <span className="century-gothic text-gray-300">This Week</span>
                  <span className="text-green-400 font-medium">
                    {contentAnalytics.fixture_stats.this_week}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;