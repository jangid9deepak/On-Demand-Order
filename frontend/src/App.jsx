import { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";

import { ShoppingBag } from "lucide-react";

import api, { endpoints } from "./api";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Vendor from "./pages/Vendor";
import ProductManagement from "./pages/ProductManagement";


export default function App() {

    const [user, setUser] = useState(null);

    const [toast, setToast] = useState(null);

    const [loading, setLoading] = useState(true);

    const location = useLocation();


    // ==========================================
    // NOTIFICATION
    // ==========================================

    const notify = (message, type = "success") => {

        setToast({
            message,
            type,
        });

    };


    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    useEffect(() => {

        const token = localStorage.getItem(
            "access_token"
        );

        if (!token) {

            setLoading(false);

            return;

        }


        const loadUser = async () => {

            try {

                const response = await api.get(
                    endpoints.profile
                );

                /*
                 * ProfileAPIView returns:
                 *
                 * GET:
                 * {
                 *     username,
                 *     email,
                 *     phone,
                 *     address,
                 *     role
                 * }
                 *
                 * But this also safely supports:
                 *
                 * {
                 *     data: {...}
                 * }
                 */

                const profileData =
                    response.data?.data ||
                    response.data;


                setUser(profileData);


            } catch (error) {

                console.error(
                    "User loading error:",
                    error
                );

                localStorage.clear();

                setUser(null);


            } finally {

                setLoading(false);

            }

        };


        loadUser();

    }, []);


    // ==========================================
    // AUTH CHECK
    // ==========================================

    const auth = Boolean(
        localStorage.getItem("access_token")
    );


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {

        return (

            <div className="splash">

                <div className="splash-logo">

                    <ShoppingBag />

                </div>

                <h2>
                    OnDemand
                </h2>

                <span>
                    Loading your workspace…
                </span>

            </div>

        );

    }


    // ==========================================
    // PROTECTED ROUTES
    // ==========================================

    if (
        !auth &&
        !["/login", "/register"].includes(
            location.pathname
        )
    ) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // PREVENT AUTH USERS FROM LOGIN/REGISTER
    // ==========================================

    if (
        auth &&
        ["/login", "/register"].includes(
            location.pathname
        )
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // ==========================================
    // APPLICATION
    // ==========================================

    return (

        <>

            {/* ==============================
                NAVBAR
            ============================== */}

            {auth && (

                <Navbar
                    user={user}
                    onLogout={() => {

                        localStorage.clear();

                        setUser(null);

                    }}
                />

            )}


            {/* ==============================
                SIDEBAR
            ============================== */}

            {auth && (

                <Sidebar
                    user={user}
                />

            )}


            {/* ==============================
                MAIN CONTENT
            ============================== */}

            <main
                className={
                    auth
                        ? "app-shell"
                        : ""
                }
            >

                <Routes>

                    {/* ==========================
                        AUTH
                    ========================== */}

                    <Route
                        path="/login"
                        element={
                            <Login
                                setUser={setUser}
                                notify={notify}
                            />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        DASHBOARD
                    ========================== */}

                    <Route
                        path="/"
                        element={
                            <Dashboard
                                user={user}
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        PRODUCTS
                    ========================== */}

                    <Route
                        path="/products"
                        element={
                            <Products
                                user={user}
                                notify={notify}
                            />
                        }
                    />

                    <Route
                        path="/products/:id"
                        element={
                            <ProductDetail
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        CART
                    ========================== */}

                    <Route
                        path="/cart"
                        element={
                            <Cart
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        CHECKOUT
                    ========================== */}

                    <Route
                        path="/checkout"
                        element={
                            <Checkout
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        ORDERS
                    ========================== */}

                    <Route
                        path="/orders"
                        element={
                            <Orders
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        PROFILE
                    ========================== */}

                    <Route
                        path="/profile"
                        element={
                            <Profile
                                user={user}
                                setUser={setUser}
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        VENDOR
                    ========================== */}

                    <Route
                        path="/vendor"
                        element={
                            <Vendor
                                user={user}
                                setUser={setUser}
                                notify={notify}
                            />
                        }
                    />


                    {/* ==========================
                        VENDOR PRODUCT MANAGEMENT
                    ========================== */}

                    <Route
                        path="/vendor/products"
                        element={
                            <ProductManagement
                                user={user}
                                notify={notify}
                            />
                        }
                    />

                </Routes>

            </main>


            {/* ==============================
                TOAST
            ============================== */}

            {toast && (

                <Toast
                    {...toast}
                    onClose={() =>
                        setToast(null)
                    }
                />

            )}

        </>

    );

}