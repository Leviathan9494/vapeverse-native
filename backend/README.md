# VapeVerse Backend API

Backend API server for VapeVerse mobile app, serving product data from CSV inventory.

## Features

- 📦 **Product Catalog**: Serves 4000+ real products from CSV
- 🔍 **Search & Filtering**: By category, brand, price range, stock status
- 📄 **Pagination**: Efficient data loading with page-based navigation
- 🏷️ **Categories & Brands**: Dynamic lists from inventory
- ✅ **E-commerce Ready**: Filters for publishable products only

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
npm start
```

The API will run on `http://localhost:3000`

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Products

#### Get All Products (with filters & pagination)
```
GET /api/products
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `category` - Filter by category name
- `brand` - Filter by brand name (partial match)
- `search` - Search in product name and brand
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter for in-stock items only (true/false)

Response:
```json
{
  "products": [...],
  "total": 4479,
  "page": 1,
  "totalPages": 224
}
```

#### Get Single Product
```
GET /api/products/:id
```

### Categories

#### Get All Categories
```
GET /api/categories
```

Returns array of unique category names from publishable products.

### Brands

#### Get All Brands
```
GET /api/brands
```

Returns array of unique brand names from publishable products.

### Search

#### Search Products
```
GET /api/search?q=coil
```

Returns up to 20 matching products.

### Health Check

```
GET /health
```

Returns server status and product count.

## Data Source

Products are loaded from `item_listings_local_matches.csv` containing:
- **System ID**: Unique identifier
- **Item**: Product name
- **Brand**: Manufacturer
- **Price**: Retail price
- **Qty**: Stock quantity
- **Category**: Main category
- **Subcategory 1-9**: Additional categorization
- **Publish to eCom**: Visibility flag
- **MSRP**: Manufacturer suggested retail price
- **Vendor**: Supplier information

## Configuration

### Change API URL in React Native App

Update the `API_URL` in `src/screens/ProductsScreen.tsx`:

```typescript
// For local development with physical device
const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';

// For local development with emulator
const API_URL = 'http://10.0.2.2:3000/api'; // Android
const API_URL = 'http://localhost:3000/api'; // iOS

// For production
const API_URL = 'https://your-backend.onrender.com/api';
```

### Find Your Local IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address under your active network interface.

## Deployment

### Deploy to Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your repository
4. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

### Deploy to Railway.app

1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your repository
4. Railway will auto-detect Node.js and deploy

## Example Requests

### Get first page of products
```bash
curl http://localhost:3000/api/products?page=1&limit=20
```

### Search for coils
```bash
curl http://localhost:3000/api/products?search=coil
```

### Get E-liquid products
```bash
curl http://localhost:3000/api/products?category=E-liquid
```

### Get HorizonTech brand products
```bash
curl http://localhost:3000/api/products?brand=HorizonTech
```

### Get in-stock products under $10
```bash
curl "http://localhost:3000/api/products?inStock=true&maxPrice=10"
```

## Development

The server uses:
- **Express**: Web framework
- **csv-parser**: Parse CSV files
- **cors**: Enable cross-origin requests
- **nodemon**: Auto-reload during development

## Product Data Stats

Based on the CSV file:
- Total Products: 4479
- Categories: E-liquid, Vape Accessories, Dead Stock, Merch, etc.
- Price Range: $0.50 - $60+
- Popular Brands: HorizonTech, Vandy Vape, DOTMOD, Viscount, Aspire, IJOY, SMOK, Nitecore

## Troubleshooting

### Cannot connect from mobile app

1. Make sure backend is running (`npm start`)
2. Check your computer's firewall allows port 3000
3. Use your computer's local IP address, not localhost
4. Ensure phone and computer are on same WiFi network

### No products showing

1. Check backend console for product count
2. Verify CSV file is in backend directory
3. Check API response in browser: `http://localhost:3000/api/products`

### CORS errors

The backend has CORS enabled by default. If issues persist, check that requests are coming from allowed origins.
