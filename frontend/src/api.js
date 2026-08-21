import axios from "axios";

export const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_URL,
});

// Attach JWT access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Automatically refresh expired access token
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const original = error.config;
        const refresh = localStorage.getItem("refresh_token");

        if (
            error.response?.status === 401 &&
            refresh &&
            !original._retry
        ) {
            original._retry = true;

            try {
                const res = await axios.post(
                    `${API_URL}/accounts/refresh/`,
                    {
                        refresh: refresh,
                    }
                );

                localStorage.setItem(
                    "access_token",
                    res.data.access
                );

                original.headers.Authorization =
                    `Bearer ${res.data.access}`;

                return api(original);

            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


// API endpoints
export const endpoints = {

    // Authentication
    login: "/accounts/login/",
    register: "/accounts/users/register/",
    profile: "/accounts/users/profile/",

    // Vendor
    vendorRegister: "/accounts/vendors/register/",
    vendorProfile: "/accounts/vendors/profile/",

    // Products
    products: "/products/products/",
    productCreate: "/products/products/create/",

    // Categories
    categories: "/products/categories/",
    categoryCreate: "/products/categories/create/",

    // Cart
    cart: "/cart/cart/",
    cartDetails: "/cart/cart/details/",
    cartItems: "/cart/cart/items/",

    // Orders
    orders: "/orders/orders/",
    orderCreate: "/orders/orders/create/",
    checkout: "/orders/checkout/",

    // Shipping
    shipping: "/orders/shipping-addresses/create/",

    // Payments
    payments: "/payments/",
    paymentCreate: "/payments/create/",
};

export default api;