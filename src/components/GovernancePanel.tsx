import { Shield, Lock, Globe, Settings } from 'lucide-react';
import { GovernanceRules, Defaults } from '../types';

interface GovernancePanelProps {
  governance: GovernanceRules;
  defaults: Defaults;
  onGovernanceChange: (governance: GovernanceRules) => void;
  onDefaultsChange: (defaults: Defaults) => void;
}

export default function GovernancePanel({
  governance,
  defaults,
  onGovernanceChange,
  onDefaultsChange,
}: GovernancePanelProps) {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Shield className="w-5 h-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Governance & Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Row-Level Security */}
        <div>
          <div className="flex items-center mb-3">
            <Lock className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">Row-Level Security</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label">Tenant Filter Column</label>
              <input
                type="text"
                value={governance.tenant_filter?.column || ''}
                onChange={(e) =>
                  onGovernanceChange({
                    ...governance,
                    tenant_filter: {
                      column: e.target.value,
                      value: governance.tenant_filter?.value || '',
                    },
                  })
                }
                className="input-field"
                placeholder="e.g., tenant_id, org_id"
              />
            </div>

            <div>
              <label className="label">Tenant Value</label>
              <input
                type="text"
                value={governance.tenant_filter?.value || ''}
                onChange={(e) =>
                  onGovernanceChange({
                    ...governance,
                    tenant_filter: {
                      column: governance.tenant_filter?.column || '',
                      value: e.target.value,
                    },
                  })
                }
                className="input-field"
                placeholder="e.g., tenant_123"
              />
            </div>

            <div>
              <label className="label">Additional RLS Predicates (one per line)</label>
              <textarea
                value={governance.rls_predicates?.join('\n') || ''}
                onChange={(e) =>
                  onGovernanceChange({
                    ...governance,
                    rls_predicates: e.target.value.split('\n').filter(p => p.trim()),
                  })
                }
                className="input-field font-mono text-sm"
                rows={3}
                placeholder="status = 'active'&#10;deleted_at IS NULL"
              />
            </div>
          </div>
        </div>

        {/* PII Protection */}
        <div>
          <div className="flex items-center mb-3">
            <Lock className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">PII Protection</h4>
          </div>

          <div>
            <label className="label">PII Columns (comma-separated)</label>
            <input
              type="text"
              value={governance.pii_columns?.join(', ') || ''}
              onChange={(e) =>
                onGovernanceChange({
                  ...governance,
                  pii_columns: e.target.value.split(',').map(c => c.trim()).filter(Boolean),
                })
              }
              className="input-field"
              placeholder="e.g., ssn, credit_card, email"
            />
            <p className="text-xs text-gray-500 mt-1">
              These columns will be excluded from queries unless explicitly requested
            </p>
          </div>
        </div>

        {/* Timezone Settings */}
        <div>
          <div className="flex items-center mb-3">
            <Globe className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">Timezone</h4>
          </div>

          <div>
            <label className="label">Default Timezone</label>
            <select
              value={governance.date_timezone || 'UTC'}
              onChange={(e) =>
                onGovernanceChange({
                  ...governance,
                  date_timezone: e.target.value,
                })
              }
              className="input-field"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Chicago">America/Chicago (CST/CDT)</option>
              <option value="America/Denver">America/Denver (MST/MDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
        </div>

        {/* Query Defaults */}
        <div>
          <div className="flex items-center mb-3">
            <Settings className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">Query Defaults</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label">Default Time Range</label>
              <input
                type="text"
                value={defaults.time_range_default || ''}
                onChange={(e) =>
                  onDefaultsChange({
                    ...defaults,
                    time_range_default: e.target.value,
                  })
                }
                className="input-field"
                placeholder="e.g., LAST 90 DAYS, LAST 1 YEAR"
              />
            </div>

            <div>
              <label className="label">Default Row Limit</label>
              <input
                type="number"
                value={defaults.limit_default || 100}
                onChange={(e) =>
                  onDefaultsChange({
                    ...defaults,
                    limit_default: parseInt(e.target.value) || 100,
                  })
                }
                className="input-field"
                min="1"
                max="10000"
              />
            </div>
          </div>
        </div>

        {/* Business Glossary */}
        <div>
          <div className="flex items-center mb-3">
            <Settings className="w-4 h-4 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-900">Business Glossary</h4>
          </div>

          <div>
            <label className="label">Term Definitions (format: term=definition, one per line)</label>
            <textarea
              value={
                defaults.business_glossary
                  ? Object.entries(defaults.business_glossary)
                      .map(([k, v]) => `${k}=${v}`)
                      .join('\n')
                  : ''
              }
              onChange={(e) => {
                const glossary: Record<string, string> = {};
                e.target.value.split('\n').forEach(line => {
                  const [key, ...valueParts] = line.split('=');
                  if (key && valueParts.length > 0) {
                    glossary[key.trim()] = valueParts.join('=').trim();
                  }
                });
                onDefaultsChange({
                  ...defaults,
                  business_glossary: glossary,
                });
              }}
              className="input-field font-mono text-sm"
              rows={4}
              placeholder="revenue=Total gross revenue&#10;active_customers=Customers with orders in last 90 days"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
