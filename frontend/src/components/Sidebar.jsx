import {
    BarChart3,
    Box,
    Home,
    ShoppingCart,
    Truck,
    UserRound,
    Store,
    PackagePlus,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar({ user }) {

    const isVendor =
        String(user?.role || "").toUpperCase() === "VENDOR";

    const links = [
        ["Overview", "/", Home, true],
        ["Products", "/products", Box, true],
        ["Cart", "/cart", ShoppingCart, true],
        ["Orders", "/orders", Truck, true],
        ["Profile", "/profile", UserRound, true],
        ["Vendor Hub", "/vendor", Store, true],
    ];

    return (
        <aside className="sidebar">

            <div className="side-label">
                WORKSPACE
            </div>

            <nav>

                {links.map(
                    ([label, path, Icon, visible]) =>
                        visible && (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === "/"}
                                className={({ isActive }) =>
                                    isActive
                                        ? "side-link active"
                                        : "side-link"
                                }
                            >
                                <Icon size={19} />

                                <span>
                                    {label}
                                </span>
                            </NavLink>
                        )
                )}

                {/* =====================================
                    VENDOR PRODUCT MANAGEMENT
                ====================================== */}

                {isVendor && (
                    <NavLink
                        to="/vendor/products"
                        className={({ isActive }) =>
                            isActive
                                ? "side-link active"
                                : "side-link"
                        }
                    >
                        <PackagePlus size={19} />

                        <span>
                            Product Management
                        </span>
                    </NavLink>
                )}

            </nav>

            <div className="side-card">

                <div className="side-spark">
                    <BarChart3 size={18} />
                </div>

                <b>
                    Built for scale
                </b>

                <p>
                    JWT auth, REST APIs, cart,
                    checkout & vendor workflows.
                </p>

            </div>

            <div className="side-foot">
                React + Django REST
            </div>

        </aside>
    );
}