const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let products = [];

// Load products from CSV
function loadProducts() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'item_listings_local_matches.csv'))
      .pipe(csv())
      .on('data', (data) => {
        // Clean and parse the data
        const price = parseFloat(data.Price?.replace('$', '').trim()) || 0;
        const qty = parseInt(data['Qty.']) || 0;
        
        // Only include items with valid data and positive price
        if (data.Item && price > 0 && data.Brand) {
          results.push({
            id: data['System ID'] || Math.random().toString(36).substr(2, 9),
            name: data.Item,
            brand: data.Brand,
            price: price,
            quantity: qty,
            sku: data['Custom SKU'] || '',
            category: data.Category || 'Uncategorized',
            subcategory: data['Subcategory 1'] || '',
            vendor: data.Vendor || '',
            publishToEcom: data['Publish to eCom'] === 'Yes',
            msrp: parseFloat(data.MSRP) || price,
            // Generate a placeholder image based on category
            image: getImageForCategory(data.Category),
          });
        }
      })
      .on('end', () => {
        products = results;
        console.log(`Loaded ${products.length} products from CSV`);
        resolve();
      })
      .on('error', reject);
  });
}

// Get appropriate image URL based on category
function getImageForCategory(category) {
  const categoryImages = {
    'E-liquid': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
    'Vape Accessories': 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=300&h=300&fit=crop',
    'Dead Stock': 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=300&h=300&fit=crop',
    'Merch': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1606492199009-b4dc6c60e7f5?w=300&h=300&fit=crop'
  };
  return categoryImages[category] || categoryImages['default'];
}

// API Routes

// Get all products with pagination and filters
app.get('/api/products', (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    category, 
    brand, 
    search,
    minPrice,
    maxPrice,
    inStock 
  } = req.query;

  let filtered = products.filter(p => p.publishToEcom);

  // Apply filters
  if (category) {
    filtered = filtered.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (brand) {
    filtered = filtered.filter(p => 
      p.brand?.toLowerCase().includes(brand.toLowerCase())
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower)
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (inStock === 'true') {
    filtered = filtered.filter(p => p.quantity > 0);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  res.json({
    products: paginatedProducts,
    total: filtered.length,
    page: parseInt(page),
    totalPages: Math.ceil(filtered.length / limit)
  });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products
    .filter(p => p.publishToEcom && p.category)
    .map(p => p.category))
  ].sort();
  
  res.json(categories);
});

// Get all brands
app.get('/api/brands', (req, res) => {
  const brands = [...new Set(products
    .filter(p => p.publishToEcom && p.brand)
    .map(p => p.brand))
  ].sort();
  
  res.json(brands);
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  const featured = products
    .filter(p => p.publishToEcom && p.quantity > 0)
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);
  
  res.json(featured);
});

// Search products
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }

  const searchLower = q.toLowerCase();
  const results = products
    .filter(p => p.publishToEcom)
    .filter(p => 
      p.name?.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower)
    )
    .slice(0, 20);

  res.json(results);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    products: products.length,
    timestamp: new Date().toISOString()
  });
});

// Initialize and start server
loadProducts()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 VapeVerse API running on port ${PORT}`);
      console.log(`📊 Loaded ${products.length} products`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to load products:', error);
    process.exit(1);
  });

module.exports = app;
