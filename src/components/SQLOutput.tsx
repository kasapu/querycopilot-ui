import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Download, AlertCircle } from 'lucide-react';
import { QueryResponse } from '../types';

interface SQLOutputProps {
  response: QueryResponse | null;
  isLoading: boolean;
}

export default function SQLOutput({ response, isLoading }: SQLOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response?.sql) return;

    try {
      await navigator.clipboard.writeText(response.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!response?.sql) return;

    const blob = new Blob([response.sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_${Date.now()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Generating SQL query...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="card bg-gray-50">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Your generated SQL will appear here</p>
          <p className="text-sm mt-2">Enter a question above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Query Summary</h3>
        <p className="text-blue-800">{response.summary}</p>
      </div>

      {/* Clarification Question */}
      {response.clarification_question && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Clarification Needed</h3>
              <p className="text-yellow-800">{response.clarification_question}</p>
            </div>
          </div>
        </div>
      )}

      {/* SQL Output */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated SQL</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Download as .sql file"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download
            </button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-200">
          <SyntaxHighlighter
            language="sql"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {response.sql}
          </SyntaxHighlighter>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Dialect:</span>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
              {response.dialect.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      {response.assumptions.length > 0 && (
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Assumptions Made</h3>
          <ul className="space-y-2">
            {response.assumptions.map((assumption, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 mt-1.5 flex-shrink-0"></span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quality Checks */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Quality Checks</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(response.quality_checks).map(([key, value]) => (
            <div key={key} className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-gray-700 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Parameters */}
      {Object.keys(response.parameters).length > 0 && (
        <div className="card bg-purple-50 border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-3">Query Parameters</h3>
          <div className="space-y-2">
            {Object.entries(response.parameters).map(([key, value]) => (
              <div key={key} className="flex items-center text-sm">
                <span className="font-medium text-purple-800 mr-2">{key}:</span>
                <span className="text-purple-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
