# QueryCopilot Deployment Guide

## For Your Clients

This guide helps your clients deploy and use the QueryCopilot UI in their environment.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Edit `src/services/queryService.ts` and update the API base URL:

```typescript
// Change this line:
constructor(apiBaseUrl: string = '/api') {

// To your actual API endpoint:
constructor(apiBaseUrl: string = 'https://your-backend-api.com/api') {
```

### 3. Switch from Mock to Real API

In `src/App.tsx`, find this line:

```typescript
const result = await queryService.generateSQLMock(request);
```

Replace with:

```typescript
const result = await queryService.generateSQL(request);
```

### 4. Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

## Deployment Options

### Option 1: Static Hosting (Recommended)

Deploy the `dist/` folder to any static hosting service:

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Azure Static Web Apps
```bash
az staticwebapp create \
  --name query-copilot \
  --resource-group your-rg \
  --source dist/
```

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://your-backend-api.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Build and run:

```bash
docker build -t query-copilot .
docker run -p 80:80 query-copilot
```

### Option 3: Node.js Server

Use the preview server:

```bash
npm run build
npm run preview
```

Or with PM2 for production:

```bash
npm install -g pm2
npm run build
pm2 serve dist/ 3000 --name query-copilot --spa
pm2 save
```

## Environment Configuration

### For Multiple Environments

Create environment-specific files:

**.env.development**
```bash
VITE_API_URL=http://localhost:8000/api
```

**.env.production**
```bash
VITE_API_URL=https://api.yourcompany.com/api
```

Update `src/services/queryService.ts`:

```typescript
constructor(apiBaseUrl: string = import.meta.env.VITE_API_URL || '/api') {
```

## CORS Configuration

If your API is on a different domain, ensure CORS headers are set:

```javascript
Access-Control-Allow-Origin: https://your-ui-domain.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Backend API Requirements

Your backend must expose this endpoint:

### POST /api/generate-sql

**Request:**
```json
{
  "dialect": "snowflake",
  "user_question": "Show me top customers",
  "catalogs": [...],
  "governance": {...},
  "defaults": {...},
  "mode": {...}
}
```

**Response:**
```json
{
  "sql": "SELECT ...",
  "dialect": "snowflake",
  "summary": "...",
  "assumptions": [...],
  "parameters": {...},
  "quality_checks": {...},
  "clarification_question": ""
}
```

## Client Configuration Guide

### Step 1: Define Database Schema

1. Click "Add Table"
2. Enter schema name (e.g., `sales`)
3. Enter table name (e.g., `orders`)
4. Add columns in format: `column_name:TYPE`

Example:
```
order_id:INT
customer_id:INT
order_date:TIMESTAMP
total_amount:DECIMAL(10,2)
status:VARCHAR(50)
```

### Step 2: Configure Security (Settings)

**Row-Level Security:**
- Tenant Filter Column: `tenant_id`
- Tenant Value: `tenant_acme_corp`
- Additional RLS Predicates:
  ```
  status = 'active'
  deleted_at IS NULL
  ```

**PII Protection:**
```
email, ssn, credit_card, phone_number
```

**Timezone:**
- Select your organization's timezone

**Query Defaults:**
- Time Range: `LAST 90 DAYS`
- Row Limit: `100`

**Business Glossary:**
```
revenue=Total gross revenue after refunds
active_customer=Customer with at least 1 order in last 90 days
churn_rate=Percentage of customers who stopped ordering
```

### Step 3: Ask Questions

Users can now ask questions like:

- "Show me top 10 customers by revenue in Q1 2024"
- "What's the average order value by region last month?"
- "List all active customers with orders over $1000"
- "Calculate monthly revenue trend for the last year"

### Step 4: Copy & Use SQL

1. Click "Generate SQL"
2. Review the generated query
3. Click "Copy" to copy to clipboard
4. Paste into your SQL client or BI tool
5. Or click "Download" to save as .sql file

## Customization for Clients

### Branding

**Update Logo & Title** (`src/App.tsx`):
```typescript
<h1 className="text-2xl font-bold">Your Company QueryCopilot</h1>
```

**Change Colors** (`tailwind.config.js`):
```javascript
colors: {
  primary: {
    600: '#YOUR_BRAND_COLOR',
  },
}
```

### Default Settings

Pre-configure defaults in `src/App.tsx`:

```typescript
const [defaults, setDefaults] = useState<Defaults>({
  limit_default: 500,  // Your default
  time_range_default: 'LAST 180 DAYS',  // Your default
  business_glossary: {
    // Pre-populate your terms
    'revenue': 'Total gross revenue after refunds',
  }
});
```

### Pre-load Catalog

Auto-load your schema on startup:

```typescript
useEffect(() => {
  // Load from your backend or local storage
  fetch('/api/schema')
    .then(res => res.json())
    .then(data => setCatalogs(data));
}, []);
```

## Monitoring & Analytics

### Add Google Analytics

In `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Track Query Generation

In `src/App.tsx`:

```typescript
const handleGenerate = async () => {
  // Analytics
  gtag('event', 'generate_sql', {
    dialect: dialect,
    has_catalogs: catalogs.length > 0,
  });

  // ... rest of code
};
```

## Troubleshooting

### Issue: SQL Not Generating

**Check:**
1. Browser console for errors
2. Network tab for API call status
3. API endpoint configuration
4. CORS headers

### Issue: Copy Not Working

**Solution:**
- Ensure HTTPS (clipboard API requires secure context)
- Use Firefox/Chrome (Safari may have restrictions)

### Issue: Slow Performance

**Solutions:**
- Enable API response caching
- Optimize catalog size (don't load all tables)
- Use pagination for large schemas

## Support Checklist for Clients

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] API endpoint configured
- [ ] Database schema added
- [ ] Governance rules configured
- [ ] Test query successful
- [ ] Production build created
- [ ] Deployed to hosting platform
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Users trained on usage

## Security Best Practices

1. **Always use HTTPS** in production
2. **Never commit** `.env` files with credentials
3. **Validate** all user input on backend
4. **Enforce** governance rules server-side
5. **Rate limit** API endpoints
6. **Audit** query generation logs
7. **Encrypt** sensitive data in transit

## License & Distribution

This software is provided to your clients as part of your enterprise solution. Include appropriate licensing terms and support contact information.
