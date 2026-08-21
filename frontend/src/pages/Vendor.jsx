import { useEffect, useState } from "react";
import {
    Building2,
    CheckCircle2,
    PackagePlus,
    Save,
    Store,
} from "lucide-react";

import api, { endpoints } from "../api";

export default function Vendor({ user, setUser, notify }) {
    const [form, setForm] = useState({
        gst_number: "",
        pan_number: "",
        upi_id: "",
        business_name: "",
        business_address: "",
    });

    const [exists, setExists] = useState(
        String(user?.role || "").toUpperCase() === "VENDOR"
    );

    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);

    // ==========================================
    // LOAD VENDOR PROFILE
    // ==========================================

    useEffect(() => {
        const loadVendorProfile = async () => {
            const role = String(user?.role || "").toUpperCase();

            if (role !== "VENDOR") {
                setExists(false);
                return;
            }

            setLoading(true);

            try {
                const response = await api.get(
                    endpoints.vendorProfile
                );

                const vendorData =
                    response.data?.data ||
                    response.data;

                setForm({
                    gst_number: vendorData?.gst_number || "",
                    pan_number: vendorData?.pan_number || "",
                    upi_id: vendorData?.upi_id || "",
                    business_name:
                        vendorData?.business_name || "",
                    business_address:
                        vendorData?.business_address || "",
                });

                setExists(true);

            } catch (error) {
                console.error(
                    "Vendor profile loading error:",
                    error
                );

                if (error.response?.status === 404) {
                    setExists(false);
                }

            } finally {
                setLoading(false);
            }
        };

        loadVendorProfile();
    }, [user?.role]);

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const update = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // CREATE / UPDATE VENDOR
    // ==========================================

    const save = async (event) => {
        event.preventDefault();

        setBusy(true);

        try {
            let response;

            if (exists) {
                // UPDATE VENDOR
                response = await api.patch(
                    endpoints.vendorProfile,
                    form
                );
            } else {
                // CREATE VENDOR
                response = await api.post(
                    endpoints.vendorRegister,
                    form
                );
            }

            const vendorData =
                response.data?.data ||
                response.data;

            // Update vendor form
            setForm({
                gst_number:
                    vendorData?.gst_number || "",
                pan_number:
                    vendorData?.pan_number || "",
                upi_id:
                    vendorData?.upi_id || "",
                business_name:
                    vendorData?.business_name || "",
                business_address:
                    vendorData?.business_address || "",
            });

            setExists(true);

            // ==========================================
            // IMPORTANT:
            // UPDATE FRONTEND USER ROLE
            // ==========================================

            if (setUser) {
                setUser((previousUser) => ({
                    ...previousUser,
                    role: "VENDOR",
                }));
            }

            // ==========================================
            // GET LATEST USER PROFILE
            // ==========================================

            try {
                const profileResponse =
                    await api.get(
                        endpoints.profile
                    );

                const latestUser =
                    profileResponse.data?.data ||
                    profileResponse.data;

                if (latestUser && setUser) {
                    setUser((previousUser) => ({
                        ...previousUser,
                        ...latestUser,
                        role: "VENDOR",
                    }));
                }

            } catch (profileError) {
                console.error(
                    "Profile refresh failed:",
                    profileError
                );

                // Backend vendor creation succeeded,
                // so keep frontend role as VENDOR.
                if (setUser) {
                    setUser((previousUser) => ({
                        ...previousUser,
                        role: "VENDOR",
                    }));
                }
            }

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            notify?.(
                exists
                    ? "Vendor profile updated successfully."
                    : "Vendor account created successfully."
            );

        } catch (error) {
            console.error(
                "Vendor save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            let message = "Vendor setup failed.";

            const data = error.response?.data;

            if (data?.message) {
                message = data.message;
            } else if (data) {
                const messages =
                    Object.values(data)
                        .flat()
                        .map((item) => String(item))
                        .join(" ");

                if (messages) {
                    message = messages;
                }
            }

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
                <div className="cart-loading">
                    Loading vendor profile...
                </div>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="page">

            <div className="vendor-hero">

                <div>
                    <span className="eyebrow">
                        <Store size={14} />
                        SELLER WORKSPACE
                    </span>

                    <h1>
                        Vendor Hub
                    </h1>

                    <p>
                        Turn your account into a
                        storefront and manage your
                        business identity.
                    </p>
                </div>

                <div className="vendor-icon">
                    <Building2 />
                </div>

            </div>

            <div className="vendor-grid">

                <form
                    className="panel vendor-form"
                    onSubmit={save}
                >

                    <div className="panel-head">

                        <div>
                            <span className="eyebrow">
                                BUSINESS PROFILE
                            </span>

                            <h3>
                                {exists
                                    ? "Business information"
                                    : "Become a vendor"}
                            </h3>
                        </div>

                        <span className="verified">

                            {exists ? (
                                <>
                                    <CheckCircle2
                                        size={17}
                                    />
                                    Active
                                </>
                            ) : (
                                "SETUP"
                            )}

                        </span>

                    </div>

                    <div className="two-col">

                        <Field
                            name="business_name"
                            label="Business name"
                            value={form.business_name}
                            onChange={update}
                        />

                        <Field
                            name="upi_id"
                            label="UPI ID"
                            value={form.upi_id}
                            onChange={update}
                        />

                    </div>

                    <div className="two-col">

                        <Field
                            name="gst_number"
                            label="GST number"
                            value={form.gst_number}
                            onChange={update}
                        />

                        <Field
                            name="pan_number"
                            label="PAN number"
                            value={form.pan_number}
                            onChange={update}
                        />

                    </div>

                    <Field
                        name="business_address"
                        label="Business address"
                        value={form.business_address}
                        onChange={update}
                    />

                    <button
                        type="submit"
                        className="primary-btn compact"
                        disabled={busy}
                    >

                        <Save size={17} />

                        {busy
                            ? "Saving..."
                            : exists
                                ? "Save business"
                                : "Create vendor account"}

                    </button>

                </form>

                <div className="vendor-feature">

                    <div className="feature-icon">
                        <PackagePlus />
                    </div>

                    <h3>
                        What you can showcase
                    </h3>

                    <p>
                        Product creation, stock
                        management and protected
                        vendor ownership are handled
                        by your backend.
                    </p>

                    <ul>

                        <li>
                            Authenticated vendor-only
                            product creation
                        </li>

                        <li>
                            Product ownership checks
                            on update/delete
                        </li>

                        <li>
                            Inventory-aware checkout
                        </li>

                        <li>
                            Order lifecycle tracking
                        </li>

                    </ul>

                </div>

            </div>

        </div>
    );
}


// ==========================================
// FIELD COMPONENT
// ==========================================

function Field({
    name,
    label,
    value,
    onChange,
}) {
    return (
        <label className="field">

            {label}

            <input
                type="text"
                name={name}
                value={value || ""}
                onChange={onChange}
                required
            />

        </label>
    );
}