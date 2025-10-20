export type DatabaseDialect = 'snowflake' | 'postgres' | 'mysql' | 'databricks';

export interface ColumnInfo {
  name: string;
  type: string;
  comment?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isNullable?: boolean;
}

export interface TableCatalog {
  catalog?: string;
  schema: string;
  table: string;
  columns: ColumnInfo[];
  rowCount?: number;
  comment?: string;
}

export interface GovernanceRules {
  tenant_filter?: {
    column: string;
    value: string;
  };
  pii_columns?: string[];
  rls_predicates?: string[];
  date_timezone?: string;
}

export interface MetricDefinition {
  name: string;
  formula: string;
  description?: string;
}

export interface Defaults {
  time_range_default?: string;
  limit_default?: number;
  metric_definitions?: MetricDefinition[];
  business_glossary?: Record<string, string>;
}

export interface ModeFlags {
  no_clarify?: boolean;
  dry_run?: boolean;
}

export interface QueryRequest {
  dialect: DatabaseDialect;
  user_question: string;
  catalogs?: TableCatalog[];
  governance?: GovernanceRules;
  defaults?: Defaults;
  mode?: ModeFlags;
}

export interface QualityChecks {
  joins_reviewed: boolean;
  filters_apply_rls: boolean;
  uses_indices_or_partitions: boolean;
  select_star_avoided: boolean;
  limit_applied: boolean;
}

export interface QueryResponse {
  sql: string;
  dialect: DatabaseDialect;
  summary: string;
  assumptions: string[];
  parameters: Record<string, string>;
  quality_checks: QualityChecks;
  clarification_question: string;
}

export interface SavedQuery {
  id: string;
  name: string;
  question: string;
  sql: string;
  dialect: DatabaseDialect;
  createdAt: string;
}
