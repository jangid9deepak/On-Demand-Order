import { useEffect, useState } from "react";

import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Link, useSearchParams } from "react-router-dom";

import api, { endpoints } from "../api";

import EmptyState from "../components/EmptyState";

export default function Products({ user }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [q, setQ] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setLoading(true);

        api.get(endpoints.products, {
            params: {
                search: q || undefined,
            },
        })
            .then((r) => {
                const data = r.data;

                const realProducts = Array.isArray(data)
                    ? data
                    : data?.results || [];

                setProducts(realProducts);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [q]);

    const list = products.filter((p) =>
        (p.product_name || "")
            .toLowerCase()
            .includes(q.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-title">
                <div>
                    <span className="eyebrow">CATALOG</span>
                    <h1>Products</h1>
                    <p>Discover products from the marketplace.</p>
                </div>

                {user?.role === "VENDOR" && (
                    <Link
                        to="/vendor/products"
                        className="primary-btn compact"
                    >
                        <Plus size={17} />
                        Add product
                    </Link>
                )}
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search />

                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search products…"
                    />
                </div>

                <button className="filter-btn">
                    <SlidersHorizontal />
                    Filters
                </button>

                <button className="filter-btn">
                    <Filter />
                    Available
                </button>
            </div>

            {loading ? (
                <div className="loading-grid">
                    {[1, 2, 3, 4].map((x) => (
                        <div className="skeleton" key={x} />
                    ))}
                </div>
            ) : list.length ? (
                <div className="product-grid large">
                    {list.map((p) => (
                        <ProductCard p={p} key={p.id} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No products found"
                    text={
                        q
                            ? "Try a different search term."
                            : "There are no products available yet."
                    }
                />
            )}
        </div>
    );
}

function ProductCard({ p }) {
    return (
        <Link
            className="product-card"
            to={`/products/${p.id}`}
        >
            <div className="product-image">
                {p.product_image ? (
                    <img
                        src={p.product_image}
                        alt={p.product_name || "Product"}
                    />
                ) : (
                    <span className="fake-product">
                        {(p.product_name || "P").slice(0, 1)}
                    </span>
                )}

                <i>
                    {p.is_available === false
                        ? "Unavailable"
                        : "In stock"}
                </i>
            </div>

            <div className="product-info">
                <h3>{p.product_name}</h3>

                <p>{p.product_description}</p>

                <div className="price-row">
                    <strong>
                        ₹
                        {Number(
                            p.product_price || 0
                        ).toLocaleString("en-IN")}
                    </strong>

                    <small>
                        {p.product_stock || 0} left
                    </small>
                </div>
            </div>
        </Link>
    );
}