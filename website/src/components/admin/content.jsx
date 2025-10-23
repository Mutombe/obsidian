// components/Admin/Content.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Loader2,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import AdminLayout from "./layout";
import api from "../../utils/api";

const Content = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    loadContent();
  }, [activeTab, searchTerm, sportFilter, typeFilter, pagination.page]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'articles') {
        const params = new URLSearchParams({
          page: pagination.page,
          search: searchTerm,
          ...(sportFilter !== 'all' && { sport: sportFilter }),
          ...(typeFilter !== 'all' && { type: typeFilter })
        });
        
        const response = await api.get(`/api/newsletter/admin/articles/?${params}`);
        setArticles(response.data.results || response.data);
        
        if (response.data.count) {
          setPagination(prev => ({
            ...prev,
            totalCount: response.data.count,
            totalPages: Math.ceil(response.data.count / 20)
          }));
        }
      } else {
        const params = new URLSearchParams({
          page: pagination.page,
          search: searchTerm,
          ...(sportFilter !== 'all' && { sport: sportFilter })
        });
        
        const response = await api.get(`/api/newsletter/admin/fixtures/?${params}`);
        setFixtures(response.data.results || response.data);
        
        if (response.data.count) {
          setPagination(prev => ({
            ...prev,
            totalCount: response.data.count,
            totalPages: Math.ceil(response.data.count / 20)
          }));
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await api.delete(`/api/newsletter/admin/${type === 'article' ? 'articles' : 'fixtures'}/${id}/`);
      loadContent();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}`);
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

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { color: 'text-blue-400 bg-blue-500/10', icon: Clock },
      live: { color: 'text-green-400 bg-green-500/10', icon: CheckCircle },
      finished: { color: 'text-gray-400 bg-gray-500/10', icon: XCircle }
    };
    
    const badge = badges[status] || badges.scheduled;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${badge.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="century-gothic text-gray-400">Loading content...</p>
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
              <FileText size={28} className="text-yellow-400" />
              Content Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="century-gothic text-gray-400 mt-1"
            >
              Manage articles, fixtures, and sports content
            </motion.p>
          </div>

          <button className="century-gothic bg-yellow-400 text-black px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-yellow-500 transition-colors">
            <Plus size={16} />
            Add {activeTab === 'articles' ? 'Article' : 'Fixture'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          {['articles', 'fixtures'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPagination({ page: 1, totalPages: 1, totalCount: 0 });
              }}
              className={`century-gothic px-4 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'articles' ? <FileText size={16} className="inline mr-2" /> : <Calendar size={16} className="inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-sm border border-white/10 p-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="century-gothic w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>

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
              <option value="boxing">Boxing</option>
            </select>

            {/* Type Filter (for articles only) */}
            {activeTab === 'articles' && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="century-gothic bg-white/5 border border-white/20 text-white px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="all">All Types</option>
                <option value="news">News</option>
                <option value="fixture">Fixture</option>
                <option value="result">Result</option>
                <option value="analysis">Analysis</option>
              </select>
            )}
          </div>
        </motion.div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {activeTab === 'articles' ? (
              // Articles List
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Article Image */}
                      {article.image_url && (
                        <div className="w-32 h-24 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                          <img 
                            src={article.image_url} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}

                      {/* Article Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="gravesend-sans text-lg text-white font-light">
                                {article.title}
                              </h3>
                              {article.is_featured && (
                                <Star size={16} className="text-yellow-400" />
                              )}
                            </div>
                            <p className="century-gothic text-sm text-gray-400 line-clamp-2 mb-2">
                              {article.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                              <span className="capitalize">{article.sport_category?.display_name}</span>
                              <span className="capitalize">{article.article_type}</span>
                              <span>{formatDate(article.publish_date)}</span>
                              {article.source_name && (
                                <span>Source: {article.source_name}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {article.source_url && (
                              <a
                                href={article.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button className="text-gray-400 hover:text-white transition-colors">
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(article.id, 'article')}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fixtures List
              fixtures.map((fixture, index) => (
                <motion.div
                  key={fixture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Trophy size={20} className="text-yellow-400" />
                          <span className="century-gothic text-sm text-gray-400 capitalize">
                            {fixture.sport_category?.display_name} • {fixture.league_competition}
                          </span>
                          {getStatusBadge(fixture.status)}
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center mb-3">
                          <div className="text-right">
                            <p className="century-gothic text-lg text-white font-medium">
                              {fixture.home_team}
                            </p>
                          </div>
                          <div className="text-center">
                            {fixture.home_score !== null && fixture.away_score !== null ? (
                              <div className="gravesend-sans text-2xl text-yellow-400">
                                {fixture.home_score} - {fixture.away_score}
                              </div>
                            ) : (
                              <div className="century-gothic text-sm text-gray-400">
                                VS
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="century-gothic text-lg text-white font-medium">
                              {fixture.away_team}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(fixture.match_date)}
                          </div>
                          {fixture.venue && (
                            <div>📍 {fixture.venue}</div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(fixture.id, 'fixture')}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-black/30 border border-white/10">
            <p className="century-gothic text-sm text-gray-400">
              Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.totalCount)} of {pagination.totalCount} items
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

        {/* Empty State */}
        {((activeTab === 'articles' && articles.length === 0) || 
          (activeTab === 'fixtures' && fixtures.length === 0)) && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            {activeTab === 'articles' ? (
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            ) : (
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            )}
            <h3 className="gravesend-sans text-lg text-white mb-2">
              No {activeTab} found
            </h3>
            <p className="century-gothic text-gray-400">
              {searchTerm || sportFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : `Start by adding your first ${activeTab === 'articles' ? 'article' : 'fixture'}`}
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Content;