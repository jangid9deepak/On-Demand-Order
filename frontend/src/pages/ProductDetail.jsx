import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Box,
    Check,
    Minus,
    Plus,
    ShoppingCart,
    Star,
    Truck,
    Zap,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";
import api, { endpoints } from "../api";

export default function ProductDetail({ notify }) {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    // ==========================================
    // LOAD PRODUCT
    // ==========================================

    useEffect(() => {

        const loadProduct = async () => {

            setLoading(true);

            try {

                const response = await api.get(
                    `${endpoints.products}${id}/`
                );

                setProduct(response.data);

            } catch (error) {

                console.error(
                    "Product detail loading error:",
                    error
                );

                notify?.(
                    "Unable to load product.",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };

        loadProduct();

    }, [id]);


    // ==========================================
    // QUANTITY - DECREASE
    // ==========================================

    const decreaseQuantity = () => {

        setQty(previous =>
            Math.max(1, previous - 1)
        );

    };


    // ==========================================
    // QUANTITY - INCREASE
    // ==========================================

    const increaseQuantity = () => {

        if (!product) return;

        if (qty >= product.product_stock) {

            notify?.(
                `Only ${product.product_stock} items are available.`,
                "error"
            );

            return;

        }

        setQty(previous => previous + 1);

    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = async () => {

        if (!product) return;

        if (product.is_available === false) {

            notify?.(
                "This product is currently unavailable.",
                "error"
            );

            return;

        }

        if (product.product_stock <= 0) {

            notify?.(
                "This product is out of stock.",
                "error"
            );

            return;

        }

        setBusy(true);

        try {

            /*
             * IMPORTANT:
             *
             * We do NOT create the cart here.
             *
             * Django's RegisterCartItemAPIView
             * automatically gets/creates the user's cart.
             */

            const response = await api.post(
                endpoints.cartItems,
                {
                    product: product.id,
                    quantity: qty,
                }
            );

            notify?.(
                response.data?.message ||
                "Product added to your cart."
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

            const backend = error.response?.data;

            const message =
                backend?.message ||
                Object.values(backend || {})
                    .flat()
                    .join(" ") ||
                "Could not add this product to cart.";

            notify?.(
                message,
                "error"
            );

        } finally {

            setBusy(false);

        }

    };


    // ==========================================
    // BUY NOW
    // ==========================================

    const buyNow = async () => {

        if (!product) return;

        if (
            product.is_available === false ||
            product.product_stock <= 0
        ) {

            notify?.(
                "This product is currently unavailable.",
                "error"
            );

            return;

        }

        setBusy(true);

        try {

            await api.post(
                endpoints.cartItems,
                {
                    product: product.id,
                    quantity: qty,
                }
            );

            /*
             * After adding the product,
             * send the customer directly
             * to the cart.
             *
             * Later we can make this go
             * directly to checkout.
             */

            navigate("/cart");

        } catch (error) {

            console.error(
                "Buy now error:",
                error
            );

            const backend = error.response?.data;

            const message =
                backend?.message ||
                Object.values(backend || {})
                    .flat()
                    .join(" ") ||
                "Unable to continue with this product.";

            notify?.(
                message,
                "error"
            );

        } finally {

            setBusy(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="page">

                <div className="spinner"></div>

            </div>
        );

    }


    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================

    if (!product) {

        return (
            <div className="page">

                <Link
                    className="back-link"
                    to="/products"
                >
                    <ArrowLeft size={16} />
                    Back to products
                </Link>

                <div className="panel">

                    <h2>
                        Product not found
                    </h2>

                    <p>
                        This product may have been
                        removed or is no longer available.
                    </p>

                </div>

            </div>
        );

    }


    const outOfStock =
        product.product_stock <= 0;

    const unavailable =
        product.is_available === false ||
        outOfStock;


    return (

        <div className="page">

            {/* ==================================
                BACK
            ================================== */}

            <Link
                className="back-link"
                to="/products"
            >

                <ArrowLeft size={16} />

                Back to products

            </Link>


            {/* ==================================
                PRODUCT DETAIL
            ================================== */}

            <div className="detail-grid">


                {/* ==============================
                    PRODUCT IMAGE
                ============================== */}

                <div className="detail-visual">

                    {product.product_image ? (

                        <img
                            src={product.product_image}
                            alt={product.product_name}
                        />

                    ) : (

                        <div className="detail-placeholder">

                            <Box size={80} />

                            <span>
                                OnDemand
                            </span>

                        </div>

                    )}

                </div>


                {/* ==============================
                    PRODUCT INFORMATION
                ============================== */}

                <div className="detail-copy">

                    <span className="eyebrow">

                        PRODUCT #{product.id}

                    </span>


                    <h1>
                        {product.product_name}
                    </h1>


                    {/* RATING */}

                    <div className="rating">

                        <Star
                            fill="currentColor"
                            size={16}
                        />

                        4.8

                        <span>•</span>

                        124 reviews

                    </div>


                    {/* DESCRIPTION */}

                    <p className="detail-description">

                        {product.product_description}

                    </p>


                    {/* PRICE */}

                    <strong className="detail-price">

                        ₹
                        {Number(
                            product.product_price || 0
                        ).toLocaleString("en-IN")}

                    </strong>


                    {/* TRUST */}

                    <div className="trust-row">

                        <span>

                            <Truck size={18} />

                            Fast delivery

                        </span>


                        <span>

                            <Check size={18} />

                            Secure checkout

                        </span>

                    </div>


                    {/* STOCK */}

                    <div className="stock">

                        {outOfStock ? (

                            <strong>
                                Out of stock
                            </strong>

                        ) : (

                            <>
                                <strong>
                                    {product.product_stock}
                                </strong>{" "}
                                units available
                            </>

                        )}

                    </div>


                    {/* ==============================
                        QUANTITY
                    ============================== */}

                    <div className="buy-row">

                        <div className="qty">

                            <button
                                type="button"
                                onClick={
                                    decreaseQuantity
                                }
                                disabled={
                                    busy ||
                                    qty <= 1
                                }
                            >

                                <Minus size={17} />

                            </button>


                            <b>
                                {qty}
                            </b>


                            <button
                                type="button"
                                onClick={
                                    increaseQuantity
                                }
                                disabled={
                                    busy ||
                                    qty >=
                                    product.product_stock
                                }
                            >

                                <Plus size={17} />

                            </button>

                        </div>


                        {/* ==========================
                            ADD TO CART
                        ========================== */}

                        <button
                            type="button"
                            className="primary-btn buy"
                            onClick={addToCart}
                            disabled={
                                busy ||
                                unavailable
                            }
                        >

                            <ShoppingCart
                                size={18}
                            />

                            {busy
                                ? "Adding..."
                                : "Add to cart"}

                        </button>

                    </div>


                    {/* ==============================
                        BUY NOW
                    ============================== */}

                    <button
                        type="button"
                        className="primary-btn buy-now-btn"
                        onClick={buyNow}
                        disabled={
                            busy ||
                            unavailable
                        }
                    >

                        <Zap size={18} />

                        Buy now

                    </button>


                    {/* ==============================
                        UNAVAILABLE MESSAGE
                    ============================== */}

                    {unavailable && (

                        <div className="product-form-note">

                            {outOfStock
                                ? "This product is currently out of stock."
                                : "This product is currently unavailable."}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}