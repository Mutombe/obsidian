// components/Admin/SubscriberManagement.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Download,
  Plus,
  Loader2
} from "lucide-react";
import AdminLayout from "./layout";
import api from "../../utils/api";

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    loadSubscribers();
  }, [searchTerm, statusFilter, sportFilter, pagination.page]);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        search: searchTerm,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(sportFilter !== 'all' && { sport: sportFilter })
      });

      const response = await api.get(`/api/newsletter/admin/subscribers/?${params}`);
      setSubscribers(response.data.results || response.data);
      
      if (response.data.count) {
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.count,
          totalPages: Math.ceil(response.data.count / 20)
        }));
      }
    } catch (error) {
      console.error("Error loading subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedSubscribers.length === 0) return;

    try {
      await api.post('/api/newsletter/admin/subscribers/bulk_action/', {
        action,
        subscriber_ids: selectedSubscribers
      });
      
      setSelectedSubscribers([]);
      setShowBulkActions(false);
      loadSubscribers();
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      await api.post(`/api/newsletter/admin/subscribers/${subscriberId}/change_status/`, {
        status: newStatus
      });
      loadSubscribers();
    } catch (error) {
      console.error("Error changing subscriber status:", error);
    }
  };

  const toggleSubscriberSelection = (subscriberId) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/10';
      case 'inactive': return 'text-yellow-400 bg-yellow-500/10';
      case 'unsubscribed': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="century-gothic text-gray-400">Loading subscribers...</p>
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
              <Users size={28} className="text-yellow-400" />
              Subscriber Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Manage newsletter subscribers and preferences
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <button className="century-gothic bg-yellow-400 text-black px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 p-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="century-gothic w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="century-gothic bg-white/5 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>

            {/* Sport Filter */}
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="century-gothic bg-white/5 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Sports</option>
              <option value="soccer">Soccer</option>
              <option value="formula1">Formula 1</option>
              <option value="rugby">Rugby</option>
              <option value="tennis">Tennis</option>
            </select>

            {/* Bulk Actions */}
            {selectedSubscribers.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="century-gothic bg-yellow-400 text-black px-3 py-2 text-sm font-medium focus:outline-none"
                >
                  <option value="">Bulk Actions ({selectedSubscribers.length})</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="unsubscribe">Unsubscribe</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* Subscribers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers(subscribers.map(s => s.id));
                        } else {
                          setSelectedSubscribers([]);
                        }
                      }}
                      checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                      className="w-4 h-4 accent-yellow-400"
                    />
                  </th>
                  <th className="px-4 py-3 text-left century-gothic text-sm font-medium text-gray-300">
                    Subscriber
                  </th>
                  <th className="px-4 py-3 text-left century-gothic text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left century-gothic text-sm font-medium text-gray-300">
                    Subscribed
                  </th>
                  <th className="px-4 py-3 text-left century-gothic text-sm font-medium text-gray-300">
                    Sports
                  </th>
                  <th className="px-4 py-3 text-right century-gothic text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <AnimatePresence>
                  {subscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={() => toggleSubscriberSelection(subscriber.id)}
                          className="w-4 h-4 accent-yellow-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="century-gothic text-white font-medium">
                            {subscriber.name}
                          </p>
                          <p className="century-gothic text-sm text-gray-400">
                            {subscriber.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar size={12} />
                          {formatDate(subscriber.subscription_date)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {subscriber.preferences?.sports?.slice(0, 3).map(sport => (
                            <span key={sport} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded">
                              {sport}
                            </span>
                          ))}
                          {subscriber.preferences?.sports?.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">
                              +{subscriber.preferences.sports.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {subscriber.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(subscriber.id, 'active')}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title="Activate"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {subscriber.status === 'active' && (
                            <button
                              onClick={() => handleStatusChange(subscriber.id, 'inactive')}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Deactivate"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
              <p className="century-gothic text-sm text-gray-400">
                Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.totalCount)} of {pagination.totalCount} subscribers
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="century-gothic px-3 py-1 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="century-gothic px-3 py-1 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {subscribers.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="gravesend-sans text-lg text-white mb-2">No subscribers found</h3>
            <p className="century-gothic text-gray-400">
              {searchTerm || statusFilter !== 'all' || sportFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Subscribers will appear here once people start signing up'}
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SubscriberManagement;