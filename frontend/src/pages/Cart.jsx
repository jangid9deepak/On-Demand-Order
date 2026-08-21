import { useEffect, useState } from "react";

import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import api, { endpoints, API_URL } from "../api";


export default function Cart({ notify }) {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busyItem, setBusyItem] = useState(null);


    // ==========================================
    // LOAD CART
    // ==========================================

    const loadCart = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                endpoints.cartDetails
            );

            const cartData =
                response.data?.data ||
                response.data;

            setCart(cartData);

        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );

            setCart(null);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCart();

    }, []);


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    const updateQuantity = async (
        item,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        try {

            setBusyItem(item.id);

            await api.patch(
                `${endpoints.cartItems}${item.id}/`,
                {
                    quantity: newQuantity,
                }
            );

            await loadCart();

        } catch (error) {

            console.error(
                "Quantity update error:",
                error
            );

            const message =
                error.response?.data?.quantity?.[0] ||
                error.response?.data?.message ||
                "Could not update quantity.";

            notify(
                message,
                "error"
            );

        } finally {

            setBusyItem(null);

        }

    };


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const removeItem = async (item) => {

        try {

            setBusyItem(item.id);

            await api.delete(
                `${endpoints.cartItems}${item.id}/`
            );

            notify(
                "Product removed from cart."
            );

            await loadCart();

        } catch (error) {

            console.error(
                "Remove cart item error:",
                error
            );

            notify(
                "Could not remove this product.",
                "error"
            );

        } finally {

            setBusyItem(null);

        }

    };


    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (image) => {

        if (!image) {
            return null;
        }

        // Already complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Relative media path
        return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="page">

                <div className="spinner" />

            </div>

        );

    }


    const items = cart?.items || [];


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (!items.length) {

        return (

            <div className="page">

                <div className="page-title">

                    <div>

                        <span className="eyebrow">
                            YOUR BAG
                        </span>

                        <h1>
                            Shopping cart
                        </h1>

                        <p>
                            Review your items before checkout.
                        </p>

                    </div>

                </div>


                <div className="empty-cart">

                    <ShoppingBag size={52} />

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add some products to your cart
                        to get started.
                    </p>

                    <Link
                        to="/products"
                        className="primary-btn"
                    >
                        Continue shopping
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </div>

        );

    }


    // ==========================================
    // TOTAL
    // ==========================================

    const totalAmount =
        Number(cart?.total_amount || 0);


    return (

        <div className="page cart-page">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="page-title">

                <div>

                    <span className="eyebrow">
                        YOUR BAG
                    </span>

                    <h1>
                        Shopping cart
                    </h1>

                    <p>
                        Review your items before checkout.
                    </p>

                </div>

            </div>


            {/* ======================================
                CONTINUE SHOPPING
            ====================================== */}

            <Link
                to="/products"
                className="back-link"
            >
                Continue shopping
                <ArrowRight size={17} />
            </Link>


            {/* ======================================
                CART CONTENT
            ====================================== */}

            <div className="cart-layout">


                {/* ==================================
                    ITEMS
                ================================== */}

                <div className="cart-items">

                    <h2>
                        Review your items
                    </h2>


                    {items.map((item) => {

                        const imageUrl =
                            getImageUrl(
                                item.product_image
                            );

                        const price =
                            Number(
                                item.product_price || 0
                            );

                        const subtotal =
                            Number(
                                item.subtotal ||
                                price * item.quantity
                            );


                        return (

                            <div
                                className="cart-item"
                                key={item.id}
                            >


                                {/* PRODUCT IMAGE */}

                                <div className="cart-item-image">

                                    {imageUrl ? (

                                        <img
                                            src={imageUrl}
                                            alt={
                                                item.product_name ||
                                                "Product"
                                            }
                                        />

                                    ) : (

                                        <div className="cart-image-placeholder">

                                            <ShoppingBag
                                                size={40}
                                            />

                                        </div>

                                    )}

                                </div>


                                {/* PRODUCT INFORMATION */}

                                <div className="cart-item-info">

                                    <span className="cart-item-category">
                                        Product
                                    </span>


                                    <h3>

                                        {item.product_name ||
                                            `Product #${item.product}`}

                                    </h3>


                                    <p className="cart-description">

                                        {item.product_description ||
                                            "Product from OnDemand marketplace."}

                                    </p>


                                    <strong className="cart-price">

                                        ₹
                                        {price.toLocaleString(
                                            "en-IN"
                                        )}

                                    </strong>


                                    {/* QUANTITY */}

                                    <div className="cart-item-actions">


                                        <div className="qty">

                                            <button
                                                type="button"
                                                disabled={
                                                    busyItem === item.id ||
                                                    item.quantity <= 1
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >

                                                <Minus size={16} />

                                            </button>


                                            <b>
                                                {item.quantity}
                                            </b>


                                            <button
                                                type="button"
                                                disabled={
                                                    busyItem === item.id
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        item,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >

                                                <Plus size={16} />

                                            </button>

                                        </div>


                                        {/* REMOVE */}

                                        <button
                                            type="button"
                                            className="remove-btn"
                                            disabled={
                                                busyItem === item.id
                                            }
                                            onClick={() =>
                                                removeItem(item)
                                            }
                                        >

                                            <Trash2
                                                size={17}
                                            />

                                            Remove

                                        </button>

                                    </div>

                                </div>


                                {/* SUBTOTAL */}

                                <div className="cart-item-total">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>

                                        ₹
                                        {subtotal.toLocaleString(
                                            "en-IN"
                                        )}

                                    </strong>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* ==================================
                    ORDER SUMMARY
                ================================== */}

                <aside className="order-summary">

                    <h2>
                        Order summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <strong>
                            {cart?.total_items || 0}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹
                            {totalAmount.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            Free
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Tax
                        </span>

                        <small>
                            Calculated at checkout
                        </small>

                    </div>


                    <hr />


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>

                            ₹
                            {totalAmount.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    <Link
                        to="/checkout"
                        className="primary-btn checkout-btn"
                    >

                        Proceed to checkout

                        <ArrowRight size={18} />

                    </Link>

                </aside>

            </div>

        </div>

    );

}