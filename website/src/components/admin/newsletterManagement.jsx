// components/Admin/NewsletterManagement.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  MousePointer
} from "lucide-react";
import AdminLayout from "./layout";
import api from "../../utils/api";

const NewsletterManagement = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [sending, setSending] = useState(null);

  useEffect(() => {
    loadNewsletters();
  }, []);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/newsletter/admin/newsletters/');
      setNewsletters(response.data.results || response.data);
    } catch (error) {
      console.error("Error loading newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (newsletterId) => {
    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      return;
    }

    try {
      setSending(newsletterId);
      await api.post(`/api/newsletter/admin/newsletters/${newsletterId}/send_newsletter/`);
      alert('Newsletter queued for sending!');
      loadNewsletters();
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert('Failed to send newsletter');
    } finally {
      setSending(null);
    }
  };

  const loadNewsletterStats = async (newsletterId) => {
    try {
      const response = await api.get(`/api/newsletter/admin/newsletters/${newsletterId}/delivery_report/`);
      setSelectedNewsletter({
        id: newsletterId,
        stats: response.data
      });
      setShowStats(true);
    } catch (error) {
      console.error("Error loading newsletter stats:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'scheduled': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'draft': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle size={14} />;
      case 'scheduled': return <Clock size={14} />;
      case 'draft': return <AlertCircle size={14} />;
      case 'failed': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="century-gothic text-gray-400">Loading newsletters...</p>
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
              <Mail size={28} className="text-yellow-400" />
              Newsletter Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Manage and send newsletters to subscribers
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadNewsletters}
              className="century-gothic bg-white/10 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <Loader2 size={16} />
              Refresh
            </button>
            <button className="century-gothic bg-yellow-400 text-black px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors">
              <Plus size={16} />
              New Newsletter
            </button>
          </div>
        </div>

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {newsletters.map((newsletter, index) => (
              <motion.div
                key={newsletter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="gravesend-sans text-lg text-white font-light">
                          {newsletter.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(newsletter.status)}`}>
                          {getStatusIcon(newsletter.status)}
                          {newsletter.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(newsletter.edition_date)}
                        </div>
                        {newsletter.sent_at && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            Sent {formatDate(newsletter.sent_at)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {newsletter.total_subscribers} subscribers
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {newsletter.status === 'sent' && (
                        <button
                          onClick={() => loadNewsletterStats(newsletter.id)}
                          className="century-gothic px-3 py-2 bg-blue-500/10 text-blue-400 text-sm font-medium flex items-center gap-2 hover:bg-blue-500/20 transition-colors border border-blue-500/30"
                        >
                          <BarChart3 size={16} />
                          Stats
                        </button>
                      )}
                      
                      <a
                        href={`/newsletter/view/${newsletter.id}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="century-gothic px-3 py-2 bg-white/10 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
                      >
                        <Eye size={16} />
                        Preview
                      </a>

                      {newsletter.status !== 'sent' && (
                        <button
                          onClick={() => handleSendNewsletter(newsletter.id)}
                          disabled={sending === newsletter.id}
                          className="century-gothic px-3 py-2 bg-yellow-400 text-black text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending === newsletter.id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Newsletter Content Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="bg-white/5 p-3 rounded">
                      <p className="century-gothic text-xs text-gray-400 mb-1">Featured Article</p>
                      <p className="century-gothic text-sm text-white font-medium truncate">
                        {newsletter.featured_article?.title || 'No featured article'}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                      <p className="century-gothic text-xs text-gray-400 mb-1">Articles</p>
                      <p className="century-gothic text-sm text-white font-medium">
                        {newsletter.articles?.length || 0} articles included
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                      <p className="century-gothic text-xs text-gray-400 mb-1">Fixtures</p>
                      <p className="century-gothic text-sm text-white font-medium">
                        {newsletter.fixtures?.length || 0} fixtures included
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {newsletters.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Mail size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="gravesend-sans text-lg text-white mb-2">No newsletters yet</h3>
            <p className="century-gothic text-gray-400 mb-4">
              Create your first newsletter to start sending to subscribers
            </p>
            <button className="century-gothic bg-yellow-400 text-black px-6 py-3 font-medium flex items-center gap-2 mx-auto hover:bg-yellow-500 transition-colors">
              <Plus size={18} />
              Create Newsletter
            </button>
          </motion.div>
        )}
      </div>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && selectedNewsletter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="gravesend-sans text-xl text-white font-light flex items-center gap-2">
                  <BarChart3 size={24} className="text-yellow-400" />
                  Delivery Report
                </h3>
                <button
                  onClick={() => setShowStats(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/30 p-4 rounded border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Send size={16} className="text-blue-400" />
                    <p className="century-gothic text-xs text-gray-400">Sent</p>
                  </div>
                  <p className="gravesend-sans text-2xl text-white font-light">
                    {selectedNewsletter.stats.total_sent}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={16} className="text-green-400" />
                    <p className="century-gothic text-xs text-gray-400">Opened</p>
                  </div>
                  <p className="gravesend-sans text-2xl text-white font-light">
                    {selectedNewsletter.stats.total_opened}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer size={16} className="text-yellow-400" />
                    <p className="century-gothic text-xs text-gray-400">Clicked</p>
                  </div>
                  <p className="gravesend-sans text-2xl text-white font-light">
                    {selectedNewsletter.stats.total_clicked}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={16} className="text-red-400" />
                    <p className="century-gothic text-xs text-gray-400">Failed</p>
                  </div>
                  <p className="gravesend-sans text-2xl text-white font-light">
                    {selectedNewsletter.stats.total_failed}
                  </p>
                </div>
              </div>

              {selectedNewsletter.stats.failure_reasons?.length > 0 && (
                <div className="mt-6">
                  <h4 className="century-gothic text-sm font-medium text-white mb-3">
                    Common Failure Reasons
                  </h4>
                  <div className="space-y-2">
                    {selectedNewsletter.stats.failure_reasons.map((reason, index) => (
                      <div key={index} className="bg-red-500/10 border border-red-500/30 p-3 rounded">
                        <div className="flex items-center justify-between">
                          <p className="century-gothic text-sm text-red-300">
                            {reason.error_message}
                          </p>
                          <span className="text-xs text-red-400 font-medium">
                            {reason.count}x
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default NewsletterManagement;