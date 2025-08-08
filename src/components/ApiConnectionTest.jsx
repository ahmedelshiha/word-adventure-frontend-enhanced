import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApiConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [results, setResults] = useState({});

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    setStatus('testing');
    const tests = {};

    try {
      // Test health endpoint
      console.log('Testing health endpoint...');
      const healthResult = await api.healthCheck();
      tests.health = { success: true, data: healthResult };
      console.log('Health check result:', healthResult);
    } catch (error) {
      tests.health = { success: false, error: error.message };
      console.error('Health check failed:', error);
    }

    try {
      // Test words endpoint
      console.log('Testing words endpoint...');
      const wordsResult = await api.getWords();
      tests.words = { success: true, count: Array.isArray(wordsResult) ? wordsResult.length : 'unknown' };
      console.log('Words result:', wordsResult);
    } catch (error) {
      tests.words = { success: false, error: error.message };
      console.error('Words test failed:', error);
    }

    try {
      // Test categories endpoint
      console.log('Testing categories endpoint...');
      const categoriesResult = await api.getCategories();
      tests.categories = { success: true, count: Array.isArray(categoriesResult) ? categoriesResult.length : 'unknown' };
      console.log('Categories result:', categoriesResult);
    } catch (error) {
      tests.categories = { success: false, error: error.message };
      console.error('Categories test failed:', error);
    }

    setResults(tests);
    setStatus('completed');
  };

  const getStatusColor = (test) => {
    if (!test) return 'text-gray-500';
    return test.success ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (test) => {
    if (!test) return '⏳';
    return test.success ? '✅' : '❌';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">API Connection Test</h2>
      
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</code>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Health Check</span>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(results.health)}>{getStatusIcon(results.health)}</span>
            {results.health && (
              <span className={`text-sm ${getStatusColor(results.health)}`}>
                {results.health.success ? 'Connected' : 'Failed'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Words Endpoint</span>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(results.words)}>{getStatusIcon(results.words)}</span>
            {results.words && (
              <span className={`text-sm ${getStatusColor(results.words)}`}>
                {results.words.success ? `${results.words.count} words` : 'Failed'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded">
          <span className="font-medium">Categories Endpoint</span>
          <div className="flex items-center space-x-2">
            <span className={getStatusColor(results.categories)}>{getStatusIcon(results.categories)}</span>
            {results.categories && (
              <span className={`text-sm ${getStatusColor(results.categories)}`}>
                {results.categories.success ? `${results.categories.count} categories` : 'Failed'}
              </span>
            )}
          </div>
        </div>
      </div>

      {status === 'completed' && (
        <div className="mt-6 text-center">
          <button 
            onClick={testApiConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Test Again
          </button>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Test Results:</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest;
