import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
    User,
} from "lucide-react";
import api, { endpoints } from "../api";

export default function Register({ notify }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();

    const update = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);

        try {
            // ==========================================
            // 1. REGISTER USER
            // ==========================================

            const registerResponse = await api.post(
                endpoints.register,
                form
            );

            // ==========================================
            // 2. AUTOMATICALLY LOGIN USER
            // ==========================================

            if (
                registerResponse.status === 200 ||
                registerResponse.status === 201
            ) {
                const loginResponse = await api.post(
                    endpoints.login,
                    {
                        username: form.username,
                        password: form.password,
                    }
                );

                // ==========================================
                // 3. SAVE JWT TOKENS
                // ==========================================

                localStorage.setItem(
                    "access_token",
                    loginResponse.data.access
                );

                localStorage.setItem(
                    "refresh_token",
                    loginResponse.data.refresh
                );

                // ==========================================
                // 4. SUCCESS MESSAGE
                // ==========================================

                notify("Account created successfully!");

                // ==========================================
                // 5. GO DIRECTLY TO DASHBOARD
                // ==========================================

                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Registration error:", err);

            const errorMessage =
                Object.values(err.response?.data || {})
                    .flat()
                    .join(" ") || "Registration failed.";

            notify(errorMessage, "error");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="auth-page">

            {/* ==========================================
                LEFT SIDE / ART
            ========================================== */}

            <div className="auth-art">

                <div className="auth-brand">
                    <span>
                        <ShoppingBag />
                    </span>

                    OnDemand
                </div>

                <div className="auth-copy">

                    <span className="eyebrow">
                        JOIN THE PLATFORM
                    </span>

                    <h1>
                        Start your{" "}
                        <em>commerce journey.</em>
                    </h1>

                    <p>
                        Create a customer account and explore
                        the full order-to-delivery workflow.
                    </p>

                </div>

            </div>


            {/* ==========================================
                RIGHT SIDE / REGISTER FORM
            ========================================== */}

            <div className="auth-form-wrap">

                <form
                    className="auth-form register-form"
                    onSubmit={submit}
                >

                    {/* FORM HEADER */}

                    <div className="form-head">

                        <h2>
                            Create account
                        </h2>

                        <p>
                            It only takes a minute.
                        </p>

                    </div>


                    {/* USERNAME + EMAIL */}

                    <div className="two-col">

                        <label>
                            Username

                            <div className="input-wrap">

                                <User />

                                <input
                                    name="username"
                                    required
                                    value={form.username}
                                    onChange={update}
                                    autoComplete="username"
                                    placeholder="Enter username"
                                />

                            </div>

                        </label>


                        <label>
                            Email

                            <div className="input-wrap">

                                <Mail />

                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={update}
                                    autoComplete="email"
                                    placeholder="Enter email"
                                />

                            </div>

                        </label>

                    </div>


                    {/* PHONE + PASSWORD */}

                    <div className="two-col">

                        <label>
                            Phone

                            <div className="input-wrap">

                                <Phone />

                                <input
                                    name="phone"
                                    required
                                    value={form.phone}
                                    onChange={update}
                                    autoComplete="tel"
                                    placeholder="Enter phone number"
                                />

                            </div>

                        </label>


                        <label>
                            Password

                            <div className="input-wrap">

                                <LockKeyhole />

                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={update}
                                    autoComplete="new-password"
                                    placeholder="Create password"
                                />

                            </div>

                        </label>

                    </div>


                    {/* ADDRESS */}

                    <label>
                        Address

                        <div className="input-wrap">

                            <MapPin />

                            <input
                                name="address"
                                required
                                value={form.address}
                                onChange={update}
                                autoComplete="street-address"
                                placeholder="Enter your address"
                            />

                        </div>

                    </label>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={busy}
                    >

                        {busy ? (
                            "Creating account..."
                        ) : (
                            <>
                                Create account
                                <ArrowRight size={18} />
                            </>
                        )}

                    </button>


                    {/* LOGIN LINK */}

                    <p className="switch">

                        Already registered?{" "}

                        <Link to="/login">
                            Sign in
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
}