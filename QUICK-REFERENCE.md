# Quick Reference Guide - Nivesh AI

## 🏃 Quick Start Commands

### Backend Start
```bash
cd backend
npm install
npm run dev
```

### Frontend Start  
```bash
cd frontend
npm install
npm run dev
```

### Full Setup (One-Time)
```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2 (new window)
cd frontend && npm install && npm run dev
```

---

## 📍 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:5000 | 5000 |
| MongoDB | mongodb://localhost:27017 | 27017 |

---

## 🔑 Default Test Account

**Email**: test@example.com  
**Password**: password123

(Create your own through registration page)

---

## 📱 Main Pages

- **Home**: `/` - Landing page
- **Register**: `/register` - Create account
- **Login**: `/login` - Sign in
- **Dashboard**: `/dashboard` - Portfolio overview
- **Stocks**: `/stocks` - Browse & buy stocks
- **Portfolio**: `/portfolio` - View holdings
- **History**: `/history` - Transaction history

---

## 🏷️ Available Stocks

| Symbol | Company | Starting Price |
|--------|---------|-----------------|
| AAPL | Apple | ₹150.25 |
| GOOGL | Alphabet | ₹2800.50 |
| MSFT | Microsoft | ₹320.75 |
| AMZN | Amazon | ₹3100.00 |
| META | Meta | ₹310.45 |
| TSLA | Tesla | ₹240.80 |
| NVIDIA | NVIDIA | ₹875.30 |
| JPM | JPMorgan | ₹145.60 |

---

## 💰 Starting Balance

**₹100,000** (Virtual Currency)

---

## 🔄 Real-Time Updates

Stock prices update automatically every **10 seconds**

---

## 🛑 Stopping Services

### Kill Backend
```bash
# Ctrl+C in backend terminal
```

### Kill Frontend
```bash
# Ctrl+C in frontend terminal
```

### Kill MongoDB
```bash
# Windows
# Ctrl+C in MongoDB terminal

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

---

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/stock-simulator
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend
Auto-proxies to backend (configured in vite.config.js)

---

## 📦 Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 🧪 Test API Endpoints

### Register (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Stocks
```bash
curl http://localhost:5000/api/stocks
```

---

## 🚨 Common Issues & Fixes

### MongoDB Not Running
```bash
# Windows
mongod

# macOS
mongodb-community-start
# or
brew services start mongodb-community
```

### Port 5000 Already in Use
```bash
# Windows (PowerShell)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Port 5173 Already in Use
```bash
# Windows (PowerShell)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

---

## 📊 Key Features Checklist

- [x] User authentication (Register/Login)
- [x] JWT token management
- [x] Stock market browser
- [x] Buy/Sell stocks
- [x] Portfolio tracking
- [x] Real-time price updates
- [x] Profit/Loss calculation
- [x] Transaction history
- [x] Responsive UI
- [x] Dark theme
- [x] Charts and graphs
- [x] Toast notifications

---

## 🎯 Workflow Examples

### Example 1: Buy a Stock
1. Login
2. Go to "Stocks"
3. Click "Buy Stock" on any stock
4. Enter quantity (e.g., 5)
5. Submit
6. Check "Portfolio" to see your holdings

### Example 2: Check Performance
1. Dashboard shows real-time P&L
2. Wait 10 seconds for prices to update
3. See gain/loss change dynamically
4. Portfolio value updates in real-time

### Example 3: Sell Holdings
1. Go to "Portfolio"
2. Click "Sell Stock"
3. Enter quantity to sell
4. Submit
5. Balance increases immediately

---

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use strong passwords
- Store tokens securely (localStorage in this setup)
- Use HTTPS in production
- Validate all inputs
- Never commit .env with real secrets

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `PROJECT-SUMMARY.md` - Complete feature list
- `backend/README.md` - Backend API docs
- `frontend/README.md` - Frontend guide
- `QUICK-REFERENCE.md` - This file

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB URI
- [ ] Disable CORS for public
- [ ] Set up HTTPS
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Set up error logging
- [ ] Configure backups
- [ ] Load test the API

---

## 💡 Tips & Tricks

1. **Real-time Updates**: Stock prices automatically update every 10 seconds
2. **Fast Trading**: Use keyboard shortcuts (tab to navigate forms)
3. **Portfolio Watch**: Check dashboard regularly for P&L changes
4. **History Search**: Use pagination to browse old trades
5. **Price Tracking**: Stock page shows best buy opportunities

---

## 🎓 Learning Resources

### Frontend
- React hooks and Context API
- Tailwind CSS utility classes
- React Router navigation
- Recharts data visualization
- Axios API integration

### Backend
- Express.js middleware
- MongoDB schemas
- JWT authentication
- Bcrypt password hashing
- RESTful API design

---

## 📞 Need Help?

1. Check relevant README files
2. Review SETUP.md for detailed instructions
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify MongoDB is running

---

## ✅ Success Indicators

You'll know everything is working when you see:

✅ "Server is running on port 5000"  
✅ "VITE ... ready in XXX ms"  
✅ "MongoDB Connected: localhost"  
✅ Frontend loads at http://localhost:5173  
✅ Can register and login  
✅ Can buy and sell stocks  
✅ Prices update every 10 seconds  
✅ Real-time P&L calculations  

---

## 🎉 You're All Set!

Everything is ready. Start the backend and frontend, then open your browser to http://localhost:5173 and start trading!

Happy trading! 📈
