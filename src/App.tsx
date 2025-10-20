import { useState } from 'react';
import { Send, Settings, BookOpen, Sparkles } from 'lucide-react';
import { DatabaseDialect, QueryRequest, QueryResponse, TableCatalog, GovernanceRules, Defaults } from './types';
import SQLOutput from './components/SQLOutput';
import CatalogManager from './components/CatalogManager';
import GovernancePanel from './components/GovernancePanel';
import queryService from './services/queryService';

function App() {
  const [dialect, setDialect] = useState<DatabaseDialect>('snowflake');
  const [question, setQuestion] = useState('');
  const [catalogs, setCatalogs] = useState<TableCatalog[]>([]);
  const [governance, setGovernance] = useState<GovernanceRules>({});
  const [defaults, setDefaults] = useState<Defaults>({
    limit_default: 100,
    time_range_default: 'LAST 90 DAYS',
  });
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [noClarify, setNoClarify] = useState(false);

  const handleGenerate = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const request: QueryRequest = {
        dialect,
        user_question: question,
        catalogs: catalogs.length > 0 ? catalogs : undefined,
        governance: Object.keys(governance).length > 0 ? governance : undefined,
        defaults,
        mode: { no_clarify: noClarify },
      };

      // Using mock service for now - replace with actual API call
      const result = await queryService.generateSQLMock(request);
      setResponse(result);
    } catch (error) {
      console.error('Error generating SQL:', error);
      alert('Failed to generate SQL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  const loadExample = () => {
    // Load example configuration
    const exampleCatalogs: TableCatalog[] = [
      {
        schema: 'sales',
        table: 'orders',
        columns: [
          { name: 'order_id', type: 'INT', isPrimaryKey: true },
          { name: 'customer_id', type: 'INT', isForeignKey: true },
          { name: 'order_date', type: 'TIMESTAMP' },
          { name: 'total_amount', type: 'DECIMAL(10,2)' },
          { name: 'status', type: 'VARCHAR(50)' },
          { name: 'tenant_id', type: 'VARCHAR(100)' },
        ],
        rowCount: 125000,
        comment: 'Main sales orders table',
      },
      {
        schema: 'sales',
        table: 'customers',
        columns: [
          { name: 'customer_id', type: 'INT', isPrimaryKey: true },
          { name: 'email', type: 'VARCHAR(255)' },
          { name: 'full_name', type: 'VARCHAR(255)' },
          { name: 'created_at', type: 'TIMESTAMP' },
          { name: 'tenant_id', type: 'VARCHAR(100)' },
        ],
        rowCount: 45000,
        comment: 'Customer information',
      },
    ];

    const exampleGovernance: GovernanceRules = {
      tenant_filter: { column: 'tenant_id', value: 'tenant_acme_corp' },
      pii_columns: ['email', 'ssn', 'credit_card'],
      rls_predicates: ["status != 'deleted'"],
      date_timezone: 'America/New_York',
    };

    setCatalogs(exampleCatalogs);
    setGovernance(exampleGovernance);
    setQuestion('Show me top 10 customers by total order value in the last quarter');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QueryCopilot</h1>
                <p className="text-sm text-gray-600">Natural Language to SQL Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadExample}
                className="inline-flex items-center px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Load Example
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  showSettings
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Database Dialect */}
            <div className="card">
              <label className="label">Database Dialect</label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as DatabaseDialect)}
                className="input-field"
              >
                <option value="snowflake">Snowflake</option>
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="databricks">Databricks (Spark SQL)</option>
              </select>
            </div>

            {/* Question Input */}
            <div className="card">
              <label className="label">Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                className="input-field font-medium"
                rows={6}
                placeholder="e.g., Show me the top 10 customers by revenue in the last quarter..."
              />
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={noClarify}
                    onChange={(e) => setNoClarify(e.target.checked)}
                    className="mr-2"
                  />
                  Skip clarifications
                </label>
                <button
                  onClick={handleGenerate}
                  disabled={!question.trim() || isLoading}
                  className="btn-primary inline-flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Generate SQL
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Press Cmd/Ctrl + Enter to generate
              </p>
            </div>

            {/* Catalog Manager */}
            <CatalogManager catalogs={catalogs} onCatalogsChange={setCatalogs} />
          </div>

          {/* Right Column - Output & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {showSettings ? (
              <GovernancePanel
                governance={governance}
                defaults={defaults}
                onGovernanceChange={setGovernance}
                onDefaultsChange={setDefaults}
              />
            ) : (
              <SQLOutput response={response} isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Enterprise-grade Natural Language to SQL Generation</p>
          <p className="mt-1">Supports Snowflake, PostgreSQL, MySQL, and Databricks</p>
        </div>
      </main>
    </div>
  );
}

export default App;
