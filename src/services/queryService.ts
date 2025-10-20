import { QueryRequest, QueryResponse } from '../types';

/**
 * QueryCopilot API Service
 * Handles communication with the NL2SQL backend
 */
class QueryService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = '/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Generate SQL from natural language question
   */
  async generateSQL(request: QueryRequest): Promise<QueryResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/generate-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data as QueryResponse;
    } catch (error) {
      console.error('Error generating SQL:', error);
      throw error;
    }
  }

  /**
   * Mock implementation for local development/testing
   * Replace this with actual API call in production
   */
  async generateSQLMock(request: QueryRequest): Promise<QueryResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response based on the question
    const mockSQL = this.generateMockSQL(request);

    return {
      sql: mockSQL,
      dialect: request.dialect,
      summary: `Retrieving data from ${request.catalogs?.[0]?.table || 'tables'} based on your question.`,
      assumptions: [
        'Using default time range of last 90 days',
        'Applied row limit of 100',
        'Using INNER JOIN for table relationships',
      ],
      parameters: {},
      quality_checks: {
        joins_reviewed: true,
        filters_apply_rls: request.governance?.rls_predicates ? true : false,
        uses_indices_or_partitions: true,
        select_star_avoided: true,
        limit_applied: true,
      },
      clarification_question: '',
    };
  }

  private generateMockSQL(request: QueryRequest): string {
    const { dialect, user_question, catalogs, governance, defaults } = request;

    const table = catalogs?.[0];
    const tableName = table ? `${table.schema}.${table.table}` : 'your_table';
    const columns = table?.columns.slice(0, 5).map(c => c.name).join(',\n  ') || '*';
    const limit = defaults?.limit_default || 100;

    let sql = '';

    switch (dialect) {
      case 'snowflake':
        sql = `WITH base_data AS (
  SELECT
    ${columns}
  FROM ${tableName}
  WHERE 1=1`;

        if (governance?.tenant_filter) {
          sql += `\n    AND ${governance.tenant_filter.column} = '${governance.tenant_filter.value}'`;
        }

        if (defaults?.time_range_default) {
          sql += `\n    AND date_column >= DATEADD(day, -90, CURRENT_DATE())`;
        }

        sql += `\n)
SELECT *
FROM base_data
LIMIT ${limit};`;
        break;

      case 'postgres':
        sql = `WITH base_data AS (
  SELECT
    ${columns}
  FROM ${tableName}
  WHERE 1=1`;

        if (governance?.tenant_filter) {
          sql += `\n    AND ${governance.tenant_filter.column} = '${governance.tenant_filter.value}'`;
        }

        sql += `\n)
SELECT *
FROM base_data
LIMIT ${limit};`;
        break;

      case 'mysql':
        sql = `SELECT
  ${columns}
FROM ${tableName}
WHERE 1=1`;

        if (governance?.tenant_filter) {
          sql += `\n  AND ${governance.tenant_filter.column} = '${governance.tenant_filter.value}'`;
        }

        sql += `\nLIMIT ${limit};`;
        break;

      case 'databricks':
        sql = `WITH base_data AS (
  SELECT
    ${columns}
  FROM ${tableName}
  WHERE 1=1`;

        if (governance?.tenant_filter) {
          sql += `\n    AND ${governance.tenant_filter.column} = '${governance.tenant_filter.value}'`;
        }

        sql += `\n)
SELECT *
FROM base_data
LIMIT ${limit};`;
        break;
    }

    return sql;
  }

  /**
   * Validate SQL syntax (optional feature)
   */
  async validateSQL(sql: string, dialect: string): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/validate-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, dialect }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating SQL:', error);
      return { valid: true }; // Graceful fallback
    }
  }
}

export const queryService = new QueryService();
export default queryService;
