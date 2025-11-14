# 🧪 Testing Guide - Expo Go + Backend Connection

## What You Need to Test

Your app needs to connect to the backend API to load the 4,374 products from your CSV file.

---

## 🚀 Quick Test Steps

### 1. Make Sure Backend is Running

Open **PowerShell/Terminal 1**:
```powershell
cd c:\Users\levia\Downloads\VapeVerse\VapeVerse-Native\backend
node server.js
```

**Expected Output:**
```
✅ Loaded 4374 products from CSV
🚀 VapeVerse API running on port 3000
📊 Loaded 4374 products
```

**Keep this terminal open!** ⚠️

---

### 2. Start Expo Dev Server

Open **NEW PowerShell/Terminal 2**:
```powershell
cd c:\Users\levia\Downloads\VapeVerse\VapeVerse-Native
npx expo start
```

---

### 3. Open in Expo Go

1. **Install Expo Go** on your phone (if not already installed)
   - iOS: App Store
   - Android: Google Play Store

2. **Make sure phone is on same WiFi as computer** ⚠️
   - Computer: 192.168.4.x network
   - Phone: Same network

3. **Scan QR Code**:
   - iOS: Use Camera app
   - Android: Use Expo Go app

---

## ✅ What Should Happen

### In the App:

1. **Dashboard loads** ✅
2. Click on **Products tab** at bottom
3. You should see:
   - ✅ **Loading spinner** (while fetching)
   - ✅ **Real product names** from your CSV
   - ✅ **Search bar** at top
   - ✅ **Category chips** (E-liquid, Vape Accessories, etc.)
   - ✅ **20 products per page**
   - ✅ **Pagination buttons** at bottom
   - ✅ **Stock indicators** (Out of Stock badges)

### If Products Load: SUCCESS! 🎉
- Products show real names like "HorizonTech Arco II"
- Brands show (HorizonTech, Vandy Vape, etc.)
- Prices from CSV ($5.00, $9.49, etc.)
- Categories work
- Search works

---

## ❌ If Products Don't Load

### Troubleshooting Steps:

#### 1. Check Backend is Running
In Terminal 1, you should see:
```
🚀 VapeVerse API running on port 3000
```

If not, restart it:
```powershell
cd c:\Users\levia\Downloads\VapeVerse\VapeVerse-Native\backend
node server.js
```

#### 2. Check WiFi Connection
- Phone and computer **MUST** be on same WiFi
- Check computer IP hasn't changed:
  ```powershell
  ipconfig
  ```
  Look for "IPv4 Address" under Wi-Fi adapter
  
- If IP changed, update `src/config/api.ts`:
  ```typescript
  export const API_URL = 'http://YOUR_NEW_IP:3000/api';
  ```

#### 3. Test Backend in Browser
On your computer, open browser:
```
http://localhost:3000/health
```

Should show:
```json
{
  "status": "ok",
  "products": 4374,
  "timestamp": "..."
}
```

#### 4. Test from Phone's Browser
On your phone's browser:
```
http://192.168.4.76:3000/health
```

If this **DOESN'T work**, check:
- ❌ Firewall blocking port 3000
- ❌ Different WiFi network
- ❌ VPN active on phone or computer

#### 5. Check App Console
In Expo terminal, look for errors like:
```
Network request failed
Unable to connect to http://192.168.4.76:3000/api
```

---

## 🔧 Common Issues & Solutions

### Issue: "Network request failed"
**Solution**: Backend not running or wrong IP
- Restart backend: `node server.js`
- Verify IP in `src/config/api.ts`

### Issue: Products show loading forever
**Solution**: API URL incorrect
- Check `src/config/api.ts` has correct IP
- Test backend health endpoint first

### Issue: "Cannot connect to server"
**Solution**: Firewall or network issue
- Windows Firewall: Allow port 3000
- Same WiFi network required
- Disable VPN temporarily

### Issue: Backend crashes
**Solution**: CSV file missing or corrupted
- Check `backend/item_listings_local_matches.csv` exists
- File should be ~1.5 MB with 4,479 rows
- Reinstall dependencies:
  ```powershell
  cd backend
  rm -r node_modules
  npm install
  ```

---

## 📱 Testing Checklist

Before you say it's working, test these:

- [ ] Backend running (Terminal 1 shows "4374 products")
- [ ] Expo dev server running (Terminal 2)
- [ ] Phone on same WiFi as computer
- [ ] App loads in Expo Go
- [ ] Dashboard screen visible
- [ ] Products tab shows loading spinner
- [ ] Products appear (not just 4 placeholder products)
- [ ] Product names from CSV (HorizonTech, Vandy Vape, etc.)
- [ ] Search bar works
- [ ] Category filters work
- [ ] Pagination buttons appear
- [ ] Can navigate to page 2
- [ ] Stock indicators show (some products out of stock)

---

## 🎯 Expected Results

### ✅ SUCCESS Looks Like:
```
Products Screen:
├── Search bar at top
├── Category chips: E-liquid, Vape Accessories, Dead Stock...
├── Product grid (2 columns):
│   ├── HorizonTech Arco II - $5.00
│   ├── Reload Vapor RDA Cap - $4.00
│   ├── Vandy Vape Bonza - $10.00
│   ├── Viscount E-Liquid - $5.00
│   └── ... 16 more products
└── Pagination: [Previous] Page 1 of 219 [Next]
```

### ❌ FAILURE Looks Like:
```
Products Screen:
├── Only 4 products (Premium Vape Pod, Starter Kit Pro, etc.)
├── Prices: $49.99, $89.99, $19.99, $14.99
└── No pagination buttons
```

If you see the FAILURE case, the app isn't connected to backend yet.

---

## 📊 Quick Debug Commands

Run these if you need to troubleshoot:

```powershell
# Check if backend is running
curl http://localhost:3000/health

# Check from phone (use your phone's browser)
# http://192.168.4.76:3000/health

# See all products in browser
# http://localhost:3000/api/products

# Check your IP address
ipconfig

# Restart backend
cd c:\Users\levia\Downloads\VapeVerse\VapeVerse-Native\backend
node server.js

# Restart Expo (with cache clear)
npx expo start -c
```

---

## 🎉 When It Works

You'll know it's working when:
1. ✅ Products screen shows 20+ products
2. ✅ Product names are from your CSV (not "Premium Vape Pod")
3. ✅ Real brands appear (HorizonTech, Vandy Vape, SMOK)
4. ✅ Pagination shows "Page 1 of 219"
5. ✅ Categories match your CSV data
6. ✅ Search finds products from your inventory

---

## 📞 Still Having Issues?

1. Check **START_HERE.md** for overview
2. Check **SETUP_GUIDE.md** for detailed setup
3. Check **BACKEND_COMPLETE.md** for technical details
4. Check backend terminal for error messages
5. Check Expo terminal for error messages

---

**Remember**: Backend must be running on your computer while testing! Keep Terminal 1 open with the backend server.

Good luck testing! 🚀
