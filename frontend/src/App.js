import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://emotibot.onrender.com', {
        method: 'POST',
        headers: {
          'X-API-Key': 'dyiuoxcuovrjgimjvjiilagspvkfkart', // In production, use environment variables
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? [
    {
      name: 'Sentiment Distribution',
      positive: results.sentiment_distribution.positive,
      neutral: results.sentiment_distribution.neutral,
      negative: results.sentiment_distribution.negative,
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sentiment Analysis Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                       hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 text-red-600">
              {error}
            </div>
          )}
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="mb-8">
              <p className="text-gray-600">Total entries analyzed: {results.total_entries}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Sentiment Distribution</h3>
              <div className="w-full overflow-x-auto">
                <BarChart width={600} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" fill="#4CAF50" />
                  <Bar dataKey="neutral" fill="#FFC107" />
                  <Bar dataKey="negative" fill="#F44336" />
                </BarChart>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Detailed Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{entry.id}</td>
                        <td className="px-6 py-4">{entry.text}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${entry.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                              entry.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {entry.sentiment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;