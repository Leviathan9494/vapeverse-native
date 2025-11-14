# VapeVerse Backend Setup Guide

## 🚀 Quick Start

Your backend API is now running with **4,374 real products** from your company's inventory!

### Current Status
✅ Backend server running on: `http://localhost:3000`
✅ Products loaded from CSV: **4,374 items**
✅ API URL configured: `http://192.168.4.76:3000/api`

---

## 📱 Testing the App

### Option 1: Expo Go on Physical Device

1. **Make sure your phone and computer are on the same WiFi network**
2. **Start the backend** (already running):
   ```bash
   cd backend
   npm start
   ```

3. **Open Expo Go** and scan the QR code from:
   ```bash
   cd ..
   npx expo start
   ```

4. The app will connect to `http://192.168.4.76:3000/api` automatically

### Option 2: Android Emulator

If using Android Emulator, update the API URL:

**File**: `src/config/api.ts`
```typescript
export const API_URL = 'http://10.0.2.2:3000/api';
```

### Option 3: iOS Simulator

If using iOS Simulator, update the API URL:

**File**: `src/config/api.ts`
```typescript
export const API_URL = 'http://localhost:3000/api';
```

---

## 🧪 Test the API

Open your browser and test these endpoints:

### Health Check
```
http://localhost:3000/health
```

### Get First 20 Products
```
http://localhost:3000/api/products?page=1&limit=20
```

### Search for "coil"
```
http://localhost:3000/api/products?search=coil
```

### Get All Categories
```
http://localhost:3000/api/categories
```

### Get All Brands
```
http://localhost:3000/api/brands
```

---

## 📊 What the Backend Does

### Product Filtering
- ✅ Only shows products marked "Publish to eCom: Yes"
- ✅ Parses prices from "$5.00 " format
- ✅ Maps all CSV columns to clean API response
- ✅ Assigns category-appropriate images

### Features
- **Search**: By product name or brand
- **Filter**: By category, brand, price range
- **Pagination**: 20 products per page
- **Stock Status**: Shows quantity and "Out of Stock" badges
- **Categories**: Dynamically loaded from your inventory

### Product Data Includes
- Product name
- Brand
- Price
- Stock quantity
- Category & Subcategory
- SKU
- Vendor
- MSRP
- Product image

---

## 🔧 Troubleshooting

### Can't Connect from Phone

1. **Check WiFi**: Phone and computer must be on same network
2. **Check Firewall**: Allow port 3000 through Windows Firewall
3. **Restart Backend**: 
   ```bash
   cd backend
   npm start
   ```

### Wrong IP Address

If your IP changed, update `src/config/api.ts`:

**Find your new IP**:
```bash
ipconfig
```
Look for "IPv4 Address" under Wi-Fi adapter.

**Update the file**:
```typescript
export const API_URL = 'http://YOUR_NEW_IP:3000/api';
```

### Products Not Loading

1. Check backend is running (you should see "Loaded 4374 products")
2. Test in browser: `http://localhost:3000/api/products`
3. Check React Native app console for errors

---

## 📦 Deployment to Production

### Deploy Backend to Render.com

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add backend API"
   git push
   ```

2. **Create Web Service on Render.com**:
   - Repository: Your GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Update API URL** in `src/config/api.ts`:
   ```typescript
   export const API_URL = 'https://your-app.onrender.com/api';
   ```

### Deploy Backend to Railway.app

1. Push to GitHub
2. Create new project on Railway
3. Connect repository
4. Railway auto-detects Node.js
5. Set root directory to `backend`
6. Update API URL with Railway URL

---

## 📝 API Examples

### JavaScript/Axios
```javascript
import axios from 'axios';

// Get products
const { data } = await axios.get('http://192.168.4.76:3000/api/products', {
  params: {
    page: 1,
    limit: 20,
    category: 'E-liquid',
    search: 'coil'
  }
});

console.log(data.products);
```

### Curl
```bash
# Get all categories
curl http://localhost:3000/api/categories

# Search for batteries
curl "http://localhost:3000/api/products?search=battery"

# Get expensive items
curl "http://localhost:3000/api/products?minPrice=30"
```

---

## 🎯 Next Steps

1. **Test in Expo Go**: Make sure products load correctly
2. **Implement Cart**: Add products to shopping cart
3. **Add Checkout**: Complete purchase flow
4. **Deploy**: Push backend to Render/Railway
5. **Publish**: Submit app to App Store/Google Play

---

## 💡 Tips

- Keep backend running while testing
- Use real device for best testing experience
- Monitor backend console for request logs
- Check product images load properly
- Test search and filtering features

---

## 📞 Support

If you see errors:
1. Check backend console for errors
2. Verify CSV file is in backend folder
3. Test API endpoints in browser first
4. Check network connectivity
5. Verify API_URL matches your setup

**Backend Console Shows**:
- "Loaded X products from CSV" ✅
- "VapeVerse API running on port 3000" ✅
- Request logs when app fetches data ✅
