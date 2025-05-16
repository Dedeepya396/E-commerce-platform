# Buy Sell@ IIIT-H

A college-centric e-commerce platform where IIIT-H students can buy and sell items easily.

---

## Pages & Flow

- `/` (Front Page): Entry point with Login/Signup options.
- `/profile`: User details with editable profile (email/password updates not supported).
- `/search`: View, search, and filter items listed by other students.
- `/item/:id`: Detailed item view with "Add to Cart" option.
- `/additem`: List your own items for sale.
- `/mycart`: View cart, total price, and place orders (OTP generated per item).
- `/orders`: View items you've bought, sold, and pending orders.
- `/deliver`: Sellers can view incoming orders and verify OTP to close transactions.

---

## Features

- Google reCAPTCHA to prevent bot signups.
- Chatbot using OpenAI API (session not persistent).
- Smart filtering & search.
- OTP-based delivery confirmation.

---

## 🚀 Running the App

### Frontend
```bash
npm start
```
### Backend
```bash
npm run dev```
