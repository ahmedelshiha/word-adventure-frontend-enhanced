import React, { useState, useEffect } from 'react';

const ApiDebugTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = 'https://web-production-e17b.up.railway.app/api';

  const testEndpoint = async (name, url, options = {}) => {
    try {
      console.log(`Testing ${name}: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...options
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      return {
        name,
        status: response.status,
        success: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        name,
        status: 'ERROR',
        success: false,
        error: error.message,
        data: null
      };
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults({});

    const tests = [
      { name: 'Health Check', url: `${API_BASE}/health` },
      { name: 'Categories', url: `${API_BASE}/categories` },
      { name: 'Words', url: `${API_BASE}/words` },
      { name: 'Random Words', url: `${API_BASE}/words/random?count=5` },
      { 
        name: 'Login Test', 
        url: `${API_BASE}/auth/login`,
        options: {
          method: 'POST',
          body: JSON.stringify({ username: 'demo', password: 'password' })
        }
      }
    ];

    const results = {};
    
    for (const test of tests) {
      const result = await testEndpoint(test.name, test.url, test.options);
      results[test.name] = result;
      setTestResults(prev => ({ ...prev, [test.name]: result }));
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }

    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusColor = (result) => {
    if (!result) return 'text-gray-500';
    if (result.success) return 'text-green-600';
    if (result.status === 'ERROR') return 'text-red-600';
    if (result.status >= 400) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">API Debug Test</h2>
        <p className="text-gray-600">Testing backend connectivity to: {API_BASE}</p>
        <button 
          onClick={runTests}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className="border rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{testName}</h3>
              <span className={`font-mono ${getStatusColor(result)}`}>
                {result?.status || 'Pending...'}
              </span>
            </div>
            
            {result && (
              <div className="text-sm space-y-2">
                {result.error && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <div>
                    <strong>Response:</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {typeof result.data === 'string' 
                        ? result.data 
                        : JSON.stringify(result.data, null, 2)
                      }
                    </pre>
                  </div>
                )}
                
                {result.headers && (
                  <details className="text-xs">
                    <summary className="cursor-pointer">Headers</summary>
                    <pre className="bg-gray-50 p-2 rounded mt-1">
                      {JSON.stringify(result.headers, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Running API tests...</p>
        </div>
      )}
    </div>
  );
};

export default ApiDebugTest;
