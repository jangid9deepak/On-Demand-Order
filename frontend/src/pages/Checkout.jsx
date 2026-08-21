import { useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Truck,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import api, {
    endpoints,
} from "../api";


export default function Checkout({ notify }) {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        full_name: "",
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",

    });


    const [payment_method, setPayment] =
        useState("COD");


    const [busy, setBusy] =
        useState(false);


    /* ========================================================
       INPUT UPDATE
       ======================================================== */

    const update = (event) => {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));
    };


    /* ========================================================
       SUBMIT CHECKOUT
       ======================================================== */

    const submit = async (event) => {

        event.preventDefault();


        if (busy) {
            return;
        }


        setBusy(true);


        try {

            /* ==================================================
               STEP 1: CREATE SHIPPING ADDRESS
               ================================================== */

            const addressResponse =
                await api.post(
                    endpoints.shipping,
                    form
                );


            console.log(
                "Shipping address response:",
                addressResponse.data
            );


            const address =
                addressResponse.data?.data;


            if (!address?.id) {

                throw new Error(
                    "Shipping address was not created."
                );
            }


            /* ==================================================
               STEP 2: CHECKOUT
               ================================================== */

            const checkoutResponse =
                await api.post(
                    endpoints.checkout,
                    {
                        shipping_address:
                            address.id,

                        payment_method:
                            payment_method,
                    }
                );


            console.log(
                "Checkout response:",
                checkoutResponse.data
            );


            /* ==================================================
               STEP 3: SUCCESS
               ================================================== */

            notify(
                "Order placed successfully."
            );


            navigate(
                "/orders"
            );


        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );


            console.error(
                "Backend response:",
                error.response?.data
            );


            const backendData =
                error.response?.data;


            let message =
                backendData?.message ||
                backendData?.detail ||
                error.message ||
                "Checkout failed. Please try again.";


            /* ==================================================
               HANDLE DRF VALIDATION ERRORS
               ================================================== */

            if (
                backendData &&
                typeof backendData === "object" &&
                !backendData.message &&
                !backendData.detail
            ) {

                message =
                    Object.entries(
                        backendData
                    )
                    .map(
                        ([field, errors]) => {

                            const errorText =
                                Array.isArray(errors)
                                    ? errors.join(", ")
                                    : String(errors);

                            return `${field}: ${errorText}`;
                        }
                    )
                    .join("\n");
            }


            notify(
                message,
                "error"
            );


        } finally {

            setBusy(false);
        }
    };


    return (

        <div className="page">


            {/* ==================================================
               BACK TO CART
               ================================================== */}

            <Link
                className="back-link"
                to="/cart"
            >

                <ArrowLeft size={16} />

                Back to cart

            </Link>


            {/* ==================================================
               HEADER
               ================================================== */}

            <div className="checkout-head">

                <div>

                    <span className="eyebrow">
                        SECURE CHECKOUT
                    </span>


                    <h1>
                        Complete your order
                    </h1>


                    <p>
                        Enter your delivery details
                        and choose a payment method.
                    </p>

                </div>


                <ShieldCheck
                    size={34}
                />

            </div>


            {/* ==================================================
               CHECKOUT FORM
               ================================================== */}

            <form
                className="checkout-grid"
                onSubmit={submit}
            >


                <div className="checkout-main">


                    {/* ==================================================
                       DELIVERY ADDRESS
                       ================================================== */}

                    <section className="checkout-card">


                        <div className="checkout-card-head">

                            <span>
                                01
                            </span>


                            <div>

                                <h3>
                                    Delivery address
                                </h3>


                                <p>
                                    Where should we
                                    deliver your order?
                                </p>

                            </div>

                        </div>


                        <div className="two-col">


                            <Field
                                name="full_name"
                                label="Full name"
                                value={
                                    form.full_name
                                }
                                onChange={update}
                            />


                            <Field
                                name="phone_number"
                                label="Phone"
                                value={
                                    form.phone_number
                                }
                                onChange={update}
                            />

                        </div>


                        <Field
                            name="address_line_1"
                            label="Address"
                            value={
                                form.address_line_1
                            }
                            onChange={update}
                        />


                        <Field
                            name="address_line_2"
                            label="Apartment / landmark"
                            value={
                                form.address_line_2
                            }
                            onChange={update}
                            required={false}
                        />


                        <div className="three-col">


                            <Field
                                name="city"
                                label="City"
                                value={
                                    form.city
                                }
                                onChange={update}
                            />


                            <Field
                                name="state"
                                label="State"
                                value={
                                    form.state
                                }
                                onChange={update}
                            />


                            <Field
                                name="pincode"
                                label="Pincode"
                                value={
                                    form.pincode
                                }
                                onChange={update}
                            />

                        </div>


                        {/* COUNTRY */}

                        <Field
                            name="country"
                            label="Country"
                            value={
                                form.country
                            }
                            onChange={update}
                        />

                    </section>


                    {/* ==================================================
                       PAYMENT METHOD
                       ================================================== */}

                    <section className="checkout-card">


                        <div className="checkout-card-head">

                            <span>
                                02
                            </span>


                            <div>

                                <h3>
                                    Payment method
                                </h3>


                                <p>
                                    Choose how you
                                    want to pay.
                                </p>

                            </div>

                        </div>


                        <div className="payment-options">


                            {/* COD */}

                            <button
                                type="button"
                                className={
                                    payment_method === "COD"
                                        ? "pay-option selected"
                                        : "pay-option"
                                }
                                onClick={() =>
                                    setPayment("COD")
                                }
                            >

                                <Truck size={20} />


                                <div>

                                    <b>
                                        Cash on delivery
                                    </b>


                                    <small>
                                        Pay when your
                                        order arrives
                                    </small>

                                </div>


                                <span>

                                    {
                                        payment_method ===
                                            "COD" && (

                                            <CheckCircle2
                                                size={20}
                                            />

                                        )
                                    }

                                </span>

                            </button>


                            {/* UPI */}

                            <button
                                type="button"
                                className={
                                    payment_method === "UPI"
                                        ? "pay-option selected"
                                        : "pay-option"
                                }
                                onClick={() =>
                                    setPayment("UPI")
                                }
                            >

                                <CreditCard
                                    size={20}
                                />


                                <div>

                                    <b>
                                        UPI / digital payment
                                    </b>


                                    <small>
                                        Secure payment option
                                    </small>

                                </div>


                                <span>

                                    {
                                        payment_method ===
                                            "UPI" && (

                                            <CheckCircle2
                                                size={20}
                                            />

                                        )
                                    }

                                </span>

                            </button>

                        </div>

                    </section>

                </div>


                {/* ==================================================
                   ORDER SUMMARY
                   ================================================== */}

                <aside className="summary">


                    <span className="eyebrow">
                        READY TO PLACE
                    </span>


                    <h2>
                        Order secure
                    </h2>


                    <div className="secure-list">


                        <span>

                            <ShieldCheck
                                size={16}
                            />

                            Encrypted checkout

                        </span>


                        <span>

                            <CheckCircle2
                                size={16}
                            />

                            Stock validation

                        </span>


                        <span>

                            <Truck
                                size={16}
                            />

                            Order confirmation

                        </span>

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={busy}
                    >

                        {
                            busy
                                ? "Placing order..."
                                : "Place order"
                        }


                        <span>
                            →
                        </span>

                    </button>

                </aside>

            </form>

        </div>
    );
}


/* ============================================================
   FIELD COMPONENT
   ============================================================ */

function Field({
    name,
    label,
    value,
    onChange,
    required = true,
}) {

    return (

        <label className="field">

            {label}


            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />

        </label>
    );
}