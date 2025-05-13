// src/components/LogTable.jsx
import React from 'react';

function LogTable({ logs }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-collapse shadow-md bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Level</th>
            <th className="border p-2">Source</th>
            <th className="border p-2">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">No logs found</td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log._id}>
                <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="border p-2">{log.level || log.severity}</td>
                <td className="border p-2">{log.source}</td>
                <td className="border p-2">{log.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;
