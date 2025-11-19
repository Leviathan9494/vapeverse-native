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
    fs.createReadStream(path.join(__dirname, 'products_export_2025-11-17_18-21-54.csv'))
      .pipe(csv())
      .on('data', (data) => {
        // Clean and parse the data
        const price = parseFloat(data.Price?.replace('$', '').trim()) || 0;
        const stock = parseInt(data['Stock_Level']) || 0;
        
        // Only include visible items with valid data and positive price
        if (data.Visible === 'S' && data.US_Title_Short && price > 0 && data.Brand) {
          // Calculate points cost (100 points = $1, so multiply price by 100)
          const pointsCost = Math.round(price * 100);
          
          // Get the first image URL from the Images column (can be comma-separated)
          const images = data.Images ? data.Images.split(',').map(img => img.trim()) : [];
          const primaryImage = images.length > 0 ? images[0] : getImageForProduct(data.US_Title_Short, data.US_Category_2, data.US_Category_1);
          
          results.push({
            id: data['Internal_ID'] || Math.random().toString(36).substr(2, 9),
            name: data.US_Title_Short,
            brand: data.Brand,
            price: price,
            pointsCost: pointsCost, // Points needed to redeem this product
            quantity: stock,
            sku: data['SKU'] || '',
            category: data.US_Category_1 || 'Uncategorized',
            subcategory: data.US_Category_2 || '',
            description: data.US_Description_Short || '',
            vendor: data.Supplier || '',
            publishToEcom: true, // Already filtered by Visible='S'
            msrp: parseFloat(data.Price_Old) || price,
            image: primaryImage,
            allImages: images, // Store all images for detailed view
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

// Get appropriate image URL based on product name, subcategory, and category
function getImageForProduct(productName, subcategory, category) {
  const name = (productName || '').toLowerCase();
  const subcat = (subcategory || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  
  // Batteries
  if (name.includes('battery') || name.includes('batteries') || subcat.includes('batteries')) {
    return 'https://images.unsplash.com/photo-1609592806003-c9ec25c60640?w=300&h=300&fit=crop';
  }
  
  // Chargers
  if (name.includes('charger') || subcat.includes('chargers')) {
    return 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop';
  }
  
  // E-liquids / Juice
  if (name.includes('liquid') || name.includes('juice') || name.includes('e-liquid') || 
      cat.includes('e-liquid') || subcat.includes('free base') || subcat.includes('nic salt')) {
    return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop';
  }
  
  // Coils
  if (name.includes('coil') || subcat.includes('coil')) {
    return 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=300&h=300&fit=crop';
  }
  
  // Tanks
  if (name.includes('tank') || subcat.includes('tank')) {
    return 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=300&h=300&fit=crop';
  }
  
  // RDA / RTA / Atomizers
  if (name.includes('rda') || name.includes('rta') || name.includes('rdta') || 
      name.includes('atomizer') || subcat.includes('rda') || subcat.includes('rta')) {
    return 'https://images.unsplash.com/photo-1606492199009-b4dc6c60e7f5?w=300&h=300&fit=crop';
  }
  
  // Drip Tips / Caps
  if (name.includes('drip tip') || name.includes('cap') || name.includes('510')) {
    return 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop';
  }
  
  // Mods / Devices
  if (name.includes('mod') || name.includes('device') || name.includes('kit') || name.includes('box')) {
    return 'https://images.unsplash.com/photo-1585435465661-6dbd35d38366?w=300&h=300&fit=crop';
  }
  
  // Glass / Replacement parts
  if (name.includes('glass') || name.includes('replacement')) {
    return 'https://images.unsplash.com/photo-1591290619762-d4c7e5c5d64e?w=300&h=300&fit=crop';
  }
  
  // Cotton / Wicking
  if (name.includes('cotton') || name.includes('wick')) {
    return 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop';
  }
  
  // Wire / Building supplies
  if (name.includes('wire') || name.includes('clapton') || subcat.includes('rebuildable tools')) {
    return 'https://images.unsplash.com/photo-1597740985671-2a8a3b11a8e7?w=300&h=300&fit=crop';
  }
  
  // Pods / Pod systems
  if (name.includes('pod') || name.includes('cartridge')) {
    return 'https://images.unsplash.com/photo-1564187657-c42e99170d0f?w=300&h=300&fit=crop';
  }
  
  // Tools / Accessories
  if (name.includes('tool') || name.includes('tweezer') || name.includes('screwdriver') || 
      name.includes('plier') || subcat.includes('tools')) {
    return 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop';
  }
  
  // Cases / Storage
  if (name.includes('case') || name.includes('storage') || name.includes('bag')) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop';
  }
  
  // Merchandise / Apparel
  if (cat.includes('merch') || name.includes('shirt') || name.includes('hat') || 
      name.includes('hoodie') || name.includes('apparel')) {
    return 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop';
  }
  
  // Category-based fallbacks
  if (cat.includes('vape accessories')) {
    return 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=300&h=300&fit=crop';
  }
  
  if (cat.includes('dead stock')) {
    return 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=300&h=300&fit=crop';
  }
  
  // Default vape product image
  return 'https://images.unsplash.com/photo-1606492199009-b4dc6c60e7f5?w=300&h=300&fit=crop';
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
