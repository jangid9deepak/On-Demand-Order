import { useEffect, useState } from "react";
import {
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import api, { endpoints } from "../api";

export default function Profile({ user, setUser, notify }) {

    const [form, setForm] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    // ======================================
    // LOAD PROFILE
    // ======================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response = await api.get(
                    endpoints.profile
                );

                const profileData =
                    response.data?.data ||
                    response.data;

                setForm({
                    username: profileData?.username || "",
                    email: profileData?.email || "",
                    phone: profileData?.phone || "",
                    address: profileData?.address || "",
                });

                // IMPORTANT:
                // Merge profile data with existing user data.
                // This prevents role from being lost.

                if (setUser) {

                    setUser((previousUser) => ({
                        ...previousUser,
                        ...profileData,
                    }));

                }

            } catch (error) {

                console.error(
                    "Profile loading error:",
                    error
                );

                notify?.(
                    error.response?.data?.message ||
                    "Unable to load profile.",
                    "error"
                );

            } finally {

                setLoading(false);

            }

        };

        loadProfile();

    }, [setUser, notify]);


    // ======================================
    // HANDLE INPUT
    // ======================================

    const update = (event) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));

    };


    // ======================================
    // SAVE PROFILE
    // ======================================

    const save = async (event) => {

        event.preventDefault();

        setBusy(true);

        try {

            const response = await api.patch(
                endpoints.profile,
                form
            );

            const profileData =
                response.data?.data ||
                response.data;

            setForm({
                username: profileData?.username || "",
                email: profileData?.email || "",
                phone: profileData?.phone || "",
                address: profileData?.address || "",
            });

            // IMPORTANT:
            // Do not replace user completely.
            // Preserve role and other user information.

            if (setUser) {

                setUser((previousUser) => ({
                    ...previousUser,
                    ...profileData,
                }));

            }

            notify?.(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            notify?.(
                error.response?.data?.message ||
                "Could not update profile.",
                "error"
            );

        } finally {

            setBusy(false);

        }

    };


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (
            <div className="page">

                <div className="cart-loading">
                    Loading your profile...
                </div>

            </div>
        );

    }


    // ======================================
    // UI
    // ======================================

    return (

        <div className="page">

            <div className="page-title">

                <div>

                    <span className="eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        Profile
                    </h1>

                    <p>
                        Manage your personal information
                        and account identity.
                    </p>

                </div>

            </div>


            <div className="profile-grid">

                {/* ==================================
                    PROFILE SIDE
                ================================== */}

                <div className="profile-side">

                    <div className="profile-avatar">

                        {(form.username || "U")
                            .slice(0, 1)
                            .toUpperCase()}

                    </div>

                    <h2>
                        {form.username || "Your name"}
                    </h2>

                    <span>
                        {user?.role || "CUSTOMER"}
                    </span>


                    <div className="profile-badges">

                        <span>

                            <ShieldCheck
                                size={17}
                            />

                            JWT protected

                        </span>

                        <span>

                            <UserRound
                                size={17}
                            />

                            Active account

                        </span>

                    </div>

                </div>


                {/* ==================================
                    PROFILE FORM
                ================================== */}

                <form
                    className="profile-form panel"
                    onSubmit={save}
                >

                    <div className="panel-head">

                        <div>

                            <span className="eyebrow">
                                PERSONAL DETAILS
                            </span>

                            <h3>
                                Account information
                            </h3>

                        </div>

                    </div>


                    {/* Username + Email */}

                    <div className="two-col">

                        <Field
                            icon={UserRound}
                            label="Username"
                            name="username"
                            value={form.username}
                            onChange={update}
                        />

                        <Field
                            icon={Mail}
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={update}
                        />

                    </div>


                    {/* Phone + Address */}

                    <div className="two-col">

                        <Field
                            icon={Phone}
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={update}
                        />

                        <Field
                            icon={MapPin}
                            label="Address"
                            name="address"
                            value={form.address}
                            onChange={update}
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn compact"
                        disabled={busy}
                    >

                        <Save size={17} />

                        {busy
                            ? "Saving..."
                            : "Save changes"}

                    </button>

                </form>

            </div>

        </div>

    );

}


// ======================================
// FIELD COMPONENT
// ======================================

function Field({
    icon: Icon,
    label,
    name,
    type = "text",
    value,
    onChange,
}) {

    return (

        <label className="field">

            {label}

            <div className="input-wrap">

                <Icon size={18} />

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                />

            </div>

        </label>

    );

}