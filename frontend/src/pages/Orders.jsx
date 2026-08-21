import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Package,
} from "lucide-react";

import api, { endpoints } from "../api";
import EmptyState from "../components/EmptyState";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await api.get(endpoints.orders);

                console.log("Orders response:", response.data);

                const data = response.data;

                // Handle different possible API response formats
                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (Array.isArray(data?.results)) {
                    setOrders(data.results);
                } else if (Array.isArray(data?.data)) {
                    setOrders(data.data);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Orders loading error:", error);

                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return (
        <div className="orders-page">

            {/* HEADER */}
            <div className="orders-header">

                <div>
                    <h1>
                        PURCHASE HISTORY
                    </h1>

                    <p>
                        Follow every order from confirmation to delivery.
                    </p>
                </div>

            </div>


            {/* LOADING */}
            {loading ? (

                <div className="orders-loading">
                    Loading your orders...
                </div>

            ) : !orders.length ? (

                /* EMPTY ORDERS */
                <EmptyState
                    icon={<Package />}
                    title="No orders yet"
                    message="Your orders will appear here after you complete a purchase."
                />

            ) : (

                /* ORDERS LIST */
                <div className="orders-list">

                    {orders.map((order) => (
                        <Order
                            key={order.id}
                            o={order}
                        />
                    ))}

                </div>

            )}

        </div>
    );
}


/* =========================================================
   SINGLE ORDER COMPONENT
========================================================= */

function Order({ o }) {

    const status = (
        o.order_status || "Pending"
    ).toLowerCase();

    const steps = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
    ];

    const idx = Math.max(
        0,
        steps.findIndex(
            (step) =>
                step.toLowerCase() === status
        )
    );


    return (
        <div className="order-card">

            {/* ORDER HEADER */}
            <div className="order-top">

                <div>

                    <h2>
                        Order #{o.id}
                    </h2>

                    <p>
                        {o.created_at
                            ? new Date(
                                o.created_at
                            ).toLocaleString()
                            : "Date unavailable"}
                    </p>

                </div>


                <strong>
                    ₹
                    {Number(
                        o.total_amount || 0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>


            {/* ORDER STATUS */}
            <div className="order-status">

                <span
                    className={`status ${status.replaceAll(
                        " ",
                        "-"
                    )}`}
                >
                    {o.order_status || "Pending"}
                </span>

            </div>


            {/* ORDER PROGRESS */}
            <div className="order-progress">

                {steps.map((step, index) => (

                    <div
                        className={
                            index <= idx
                                ? "progress-step done"
                                : "progress-step"
                        }
                        key={step}
                    >

                        <div className="progress-icon">

                            {index <= idx ? (
                                <CheckCircle2 />
                            ) : (
                                <Clock3 />
                            )}

                        </div>


                        <span>
                            {step}
                        </span>

                    </div>

                ))}

            </div>


            {/* PAYMENT DETAILS */}
            <div className="order-details">

                <div>

                    <span>
                        Payment
                    </span>

                    <strong>
                        {o.payment_method || "COD"}
                    </strong>

                </div>


                <div>

                    <span>
                        Payment status
                    </span>

                    <strong>
                        {o.payment_status || "Pending"}
                    </strong>

                </div>

            </div>


            {/* VIEW DETAILS */}
            <button
                className="order-details-btn"
                type="button"
            >
                View details

                <ArrowUpRight />
            </button>

        </div>
    );
}