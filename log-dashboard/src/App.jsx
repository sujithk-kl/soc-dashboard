import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LOGS_PER_PAGE = 10;

function App() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLevel, setFilterLevel] = useState('All');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs');
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const getLevelStyle = (level) => {
    if (!level) return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    const lower = level.toLowerCase();
    if (lower.includes('error')) return 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200';
    if (lower.includes('warn')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    return 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200';
  };

  const getLevelIcon = (level) => {
    if (!level) return '❔';
    const lower = level.toLowerCase();
    if (lower.includes('error')) return '❌';
    if (lower.includes('warn')) return '⚠️';
    return '✅';
  };

  const filteredLogs =
    filterLevel === 'All'
      ? logs
      : logs.filter((log) => log.level?.toLowerCase().includes(filterLevel.toLowerCase()));

  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleFilterChange = (e) => {
    setFilterLevel(e.target.value);
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Level', 'Source', 'Message'];
    const rows = filteredLogs.map(log => [
      log.timestamp ?? '',
      log.level ?? '',
      log.source ?? '',
      `"${(log.message ?? '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transition-colors duration-500 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">📋 Log Dashboard</h1>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="font-medium">Filter by Level:</label>
            <select
              value={filterLevel}
              onChange={handleFilterChange}
              className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="All">All</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              ⬇️ Export CSV
            </button>
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="px-4 py-2 bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-600 dark:hover:bg-gray-300 rounded"
            >
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-300 dark:ring-gray-700">
          <table className="min-w-full table-auto text-sm bg-white dark:bg-gray-800">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Timestamp</th>
                <th className="px-6 py-3 text-left">Level</th>
                <th className="px-6 py-3 text-left">Source</th>
                <th className="px-6 py-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-gray-400">No logs available.</td>
                </tr>
              ) : (
                currentLogs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap">{log.timestamp ?? 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getLevelStyle(log.level)}`}>
                        {getLevelIcon(log.level)} {log.level ?? 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.source ?? 'N/A'}</td>
                    <td className="px-6 py-4 break-words">{log.message ?? 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
