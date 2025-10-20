# QueryCopilot - Natural Language to SQL UI

Enterprise-grade user interface for converting natural language questions into SQL queries across multiple database dialects.

## Features

- **Multi-Database Support**: Snowflake, PostgreSQL, MySQL, and Databricks/Spark SQL
- **Interactive Query Builder**: Simple, intuitive interface for business users
- **Database Catalog Management**: Define your schema, tables, and columns
- **Governance & Security**: Row-level security, PII protection, tenant filtering
- **One-Click Copy/Download**: Easy SQL export functionality
- **Quality Checks**: Automatic validation of generated queries
- **Business Glossary**: Define custom metrics and terminology

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### 1. Select Database Dialect

Choose your target database from the dropdown:
- Snowflake
- PostgreSQL
- MySQL
- Databricks (Spark SQL)

### 2. Add Your Database Schema

Click "Add Table" in the Database Catalog section to define your tables:

```
Schema: sales
Table: orders
Columns:
order_id:INT
customer_id:INT
order_date:TIMESTAMP
total_amount:DECIMAL(10,2)
status:VARCHAR(50)
```

### 3. Configure Governance (Optional)

Click "Settings" to configure:

- **Row-Level Security**: Add tenant filters
- **PII Protection**: List columns to exclude
- **Timezone Settings**: Set your default timezone
- **Query Defaults**: Configure time ranges and row limits
- **Business Glossary**: Define custom metrics

### 4. Ask Your Question

Enter your question in plain English:

```
Show me the top 10 customers by revenue in the last quarter
```

### 5. Generate & Copy SQL

Click "Generate SQL" or press `Cmd/Ctrl + Enter`. Your SQL will be generated with:
- Syntax highlighting
- One-click copy to clipboard
- Download as .sql file
- Quality checks summary
- Assumptions made

## Example Configuration

Click "Load Example" to see a pre-configured setup with:
- Sample sales and customer tables
- Governance rules
- Example questions

## API Integration

The UI includes a service layer (`src/services/queryService.ts`) that can be connected to your backend API.

### Mock Mode (Default)

The app currently runs in mock mode for testing. Replace `generateSQLMock()` with actual API calls:

```typescript
// In src/App.tsx, replace:
const result = await queryService.generateSQLMock(request);

// With:
const result = await queryService.generateSQL(request);
```

### API Endpoint

Configure your API endpoint in `src/services/queryService.ts`:

```typescript
const queryService = new QueryService('https://your-api.com/api');
```

### Expected API Request Format

```json
{
  "dialect": "snowflake",
  "user_question": "Show me top 10 customers by revenue",
  "catalogs": [
    {
      "schema": "sales",
      "table": "orders",
      "columns": [
        { "name": "order_id", "type": "INT" }
      ]
    }
  ],
  "governance": {
    "tenant_filter": { "column": "tenant_id", "value": "tenant_123" },
    "pii_columns": ["email", "ssn"],
    "rls_predicates": ["status != 'deleted'"],
    "date_timezone": "UTC"
  },
  "defaults": {
    "time_range_default": "LAST 90 DAYS",
    "limit_default": 100
  },
  "mode": {
    "no_clarify": false
  }
}
```

### Expected API Response Format

```json
{
  "sql": "SELECT ... FROM ... WHERE ...",
  "dialect": "snowflake",
  "summary": "Retrieving top 10 customers by revenue",
  "assumptions": [
    "Using default time range of last 90 days",
    "Applied row limit of 100"
  ],
  "parameters": {
    "start_date": "2024-01-01",
    "end_date": "2024-03-31"
  },
  "quality_checks": {
    "joins_reviewed": true,
    "filters_apply_rls": true,
    "uses_indices_or_partitions": true,
    "select_star_avoided": true,
    "limit_applied": true
  },
  "clarification_question": ""
}
```

## Architecture

```
src/
├── components/
│   ├── SQLOutput.tsx          # SQL display with copy/download
│   ├── CatalogManager.tsx     # Database schema management
│   └── GovernancePanel.tsx    # Security & settings
├── services/
│   └── queryService.ts        # API integration layer
├── types/
│   └── index.ts               # TypeScript definitions
├── App.tsx                    # Main application
├── main.tsx                   # Entry point
└── index.css                  # Styles
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Syntax Highlighter** - SQL highlighting

## Customization

### Styling

Modify colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  },
}
```

### Add New Dialects

Update `src/types/index.ts`:

```typescript
export type DatabaseDialect = 'snowflake' | 'postgres' | 'mysql' | 'databricks' | 'oracle';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Security Considerations

- All governance rules are enforced at the API level
- PII columns should be filtered server-side
- Row-level security predicates must be validated
- Never expose sensitive credentials in the frontend

## Deployment

### Static Hosting

Build and deploy to any static hosting provider:

```bash
npm run build
# Deploy the 'dist' folder
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Support

For issues and feature requests, please contact your development team.

## License

Proprietary - All rights reserved
