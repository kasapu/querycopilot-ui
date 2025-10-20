import { useState } from 'react';
import { Plus, Trash2, Database, Table, ChevronDown, ChevronRight } from 'lucide-react';
import { TableCatalog, ColumnInfo } from '../types';

interface CatalogManagerProps {
  catalogs: TableCatalog[];
  onCatalogsChange: (catalogs: TableCatalog[]) => void;
}

export default function CatalogManager({ catalogs, onCatalogsChange }: CatalogManagerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTable = (index: number) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTables(newExpanded);
  };

  const addCatalog = (catalog: TableCatalog) => {
    onCatalogsChange([...catalogs, catalog]);
    setShowAddForm(false);
  };

  const removeCatalog = (index: number) => {
    onCatalogsChange(catalogs.filter((_, i) => i !== index));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Database className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Database Catalog</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Table
        </button>
      </div>

      {showAddForm && (
        <AddCatalogForm
          onAdd={addCatalog}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {catalogs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Database className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No tables added yet</p>
          <p className="text-xs mt-1">Add tables to help generate more accurate SQL</p>
        </div>
      ) : (
        <div className="space-y-2">
          {catalogs.map((catalog, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => toggleTable(index)}
                  className="flex items-center flex-1 text-left"
                >
                  {expandedTables.has(index) ? (
                    <ChevronDown className="w-4 h-4 mr-2 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 text-gray-500" />
                  )}
                  <Table className="w-4 h-4 mr-2 text-primary-600" />
                  <span className="font-medium text-gray-900">
                    {catalog.schema}.{catalog.table}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({catalog.columns.length} columns)
                  </span>
                </button>
                <button
                  onClick={() => removeCatalog(index)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove table"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {expandedTables.has(index) && (
                <div className="p-4 bg-white">
                  {catalog.comment && (
                    <p className="text-sm text-gray-600 mb-3 italic">{catalog.comment}</p>
                  )}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Column</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Flags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catalog.columns.map((column, colIndex) => (
                          <tr key={colIndex} className="border-b border-gray-100 last:border-0">
                            <td className="py-2 px-3 font-mono text-xs">{column.name}</td>
                            <td className="py-2 px-3 text-gray-600">{column.type}</td>
                            <td className="py-2 px-3">
                              <div className="flex gap-1">
                                {column.isPrimaryKey && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                    PK
                                  </span>
                                )}
                                {column.isForeignKey && (
                                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                    FK
                                  </span>
                                )}
                                {column.isNullable && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    NULL
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {catalog.rowCount !== undefined && (
                    <p className="text-xs text-gray-500 mt-3">
                      Row count: {catalog.rowCount.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddCatalogForm({
  onAdd,
  onCancel,
}: {
  onAdd: (catalog: TableCatalog) => void;
  onCancel: () => void;
}) {
  const [schema, setSchema] = useState('');
  const [table, setTable] = useState('');
  const [columnsText, setColumnsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const columns: ColumnInfo[] = columnsText
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [name, type] = line.split(':').map(s => s.trim());
        return { name: name || '', type: type || 'VARCHAR' };
      });

    onAdd({
      schema,
      table,
      columns,
    });

    setSchema('');
    setTable('');
    setColumnsText('');
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Schema</label>
            <input
              type="text"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="input-field"
              placeholder="e.g., public, dbo"
              required
            />
          </div>
          <div>
            <label className="label">Table Name</label>
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="input-field"
              placeholder="e.g., customers"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">
            Columns (one per line, format: name:type)
          </label>
          <textarea
            value={columnsText}
            onChange={(e) => setColumnsText(e.target.value)}
            className="input-field font-mono text-sm"
            rows={6}
            placeholder="customer_id:INT&#10;email:VARCHAR&#10;created_at:TIMESTAMP"
            required
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add Table
          </button>
        </div>
      </form>
    </div>
  );
}
