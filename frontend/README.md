# OnDemand — React Frontend

A presentation-ready React frontend for the uploaded **On_Demand_Order** Django REST Framework backend.

## What is included

- Modern responsive customer dashboard
- JWT login + automatic access-token refresh
- Registration and profile management
- Product catalog, search and product detail
- Shopping cart UI
- Secure checkout flow
- Order history with visual status timeline
- Vendor onboarding / Vendor Hub
- Attractive empty/loading/error states
- Mobile responsive layout
- Axios API layer with centralized endpoints
- No hard-coded secret keys

## Run

1. Keep your Django backend running, for example on `http://127.0.0.1:8000`.
2. Copy `.env.example` to `.env` and change `VITE_API_URL` if required.
3. Run:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Important backend integration notes

I inspected the uploaded backend and found two small issues that should be corrected for the live catalog to work exactly as intended:

### 1. Product/category list routes are implemented but not registered

`products/views.py` contains `ProductListAPIView` and `CategoryListAPIView`, but `products/urls.py` only registers create/detail routes.

Add:

```python
path("products/", ProductListAPIView.as_view(), name="ProductListAPIView"),
path("categories/", CategoryListAPIView.as_view(), name="CategoryListAPIView"),
```

and import those two views.

### 2. ProductSerializer does not expose `product_price`

The `Product` model has `product_price`, but `ProductSerializer.fields` currently omits it.

Add `"product_price"` to the serializer fields.

### 3. CORS

If React runs at `http://localhost:5173`, configure Django CORS (for example with `django-cors-headers`) to allow that origin.

### 4. Cart response shape

The frontend is defensive around the cart API because the uploaded backend's cart serializer returns model fields directly. If your cart endpoint returns a flat product ID rather than a nested product object, the UI will still render the item, but a nested product serializer will provide a richer experience.

## Suggested interview demo

1. Register a user.
2. Log in and show JWT-protected dashboard.
3. Open Products and search.
4. Open a product and add it to cart.
5. Show cart quantity controls.
6. Checkout with a shipping address.
7. Show the order status timeline.
8. Open Vendor Hub and explain the vendor-only product ownership checks.
9. Explain that checkout uses a database transaction and validates stock before reducing inventory.

## Stack

React, Vite, React Router, Axios, Lucide React, Django REST Framework, JWT.
