"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  FileInput,
  Brain,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Filter,
} from "lucide-react";

type ActivityType = "IMPORT" | "PERPLEXITY_API" | "NEWS_API" | "ERROR" | "SYSTEM";
type ActivityStatus = "SUCCESS" | "ERROR" | "WARNING" | "INFO";

interface ActivityLog {
  id: string;
  type: ActivityType;
  action: string;
  details: Record<string, unknown> | null;
  count: number | null;
  status: ActivityStatus;
  errorMessage: string | null;
  createdAt: string;
}

interface Stats {
  today: {
    imports: number;
    perplexityCalls: number;
    newsApiCalls: number;
    errors: number;
  };
  week: {
    imports: number;
    perplexityCalls: number;
    newsApiCalls: number;
  };
}

interface ApiResponse {
  success: boolean;
  logs: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: Stats;
}

const typeIcons: Record<ActivityType, typeof Activity> = {
  IMPORT: FileInput,
  PERPLEXITY_API: Brain,
  NEWS_API: Globe,
  ERROR: AlertCircle,
  SYSTEM: Activity,
};

const typeColors: Record<ActivityType, string> = {
  IMPORT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PERPLEXITY_API: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  NEWS_API: "bg-green-500/10 text-green-400 border-green-500/20",
  ERROR: "bg-red-500/10 text-red-400 border-red-500/20",
  SYSTEM: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const statusColors: Record<ActivityStatus, string> = {
  SUCCESS: "bg-green-500/10 text-green-400",
  ERROR: "bg-red-500/10 text-red-400",
  WARNING: "bg-yellow-500/10 text-yellow-400",
  INFO: "bg-blue-500/10 text-blue-400",
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: "" as ActivityType | "",
    status: "" as ActivityStatus | "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());
      if (filters.type) params.set("type", filters.type);
      if (filters.status) params.set("status", filters.status);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setFilters({ type: "", status: "", startDate: "", endDate: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileInput className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Articles Imported Today</p>
                <p className="text-2xl font-bold text-white">{stats.today.imports}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Perplexity Calls Today</p>
                <p className="text-2xl font-bold text-white">{stats.today.perplexityCalls}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">News API Calls Today</p>
                <p className="text-2xl font-bold text-white">{stats.today.newsApiCalls}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Errors Today</p>
                <p className="text-2xl font-bold text-white">{stats.today.errors}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-4 text-white hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(filters.type || filters.status || filters.startDate || filters.endDate) && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                Active
              </span>
            )}
          </div>
          {showFilters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {showFilters && (
          <div className="p-4 border-t border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as ActivityType | "" })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Types</option>
                  <option value="IMPORT">Import</option>
                  <option value="PERPLEXITY_API">Perplexity API</option>
                  <option value="NEWS_API">News API</option>
                  <option value="ERROR">Error</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as ActivityStatus | "" })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="ERROR">Error</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-400">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No activity logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="w-8"></th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Count</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {logs.map((log) => {
                  const Icon = typeIcons[log.type];
                  const isExpanded = expandedRows.has(log.id);
                  const hasDetails = log.details && Object.keys(log.details).length > 0;

                  return (
                    <>
                      <tr
                        key={log.id}
                        className={`hover:bg-zinc-800/30 transition-colors ${
                          hasDetails ? "cursor-pointer" : ""
                        }`}
                        onClick={() => hasDetails && toggleRow(log.id)}
                      >
                        <td className="pl-4">
                          {hasDetails && (
                            <button className="text-zinc-500 hover:text-white">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg border ${typeColors[log.type]}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{log.type.replace(/_/g, " ")}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-white text-sm">{log.action}</span>
                          {log.errorMessage && (
                            <p className="text-red-400 text-xs mt-1">{log.errorMessage}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {log.count !== null && (
                            <span className="text-white font-medium">{log.count}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-lg text-xs ${statusColors[log.status]}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-sm">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                      {isExpanded && log.details && (
                        <tr key={`${log.id}-details`} className="bg-zinc-800/20">
                          <td colSpan={6} className="px-8 py-4">
                            <div className="text-sm">
                              <p className="text-zinc-400 mb-2">Details:</p>
                              <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto text-zinc-300">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <p className="text-sm text-zinc-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-zinc-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
