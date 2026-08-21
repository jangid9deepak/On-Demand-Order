import { useEffect, useState } from "react";
import {
    Edit3,
    ImagePlus,
    PackagePlus,
    Save,
    Trash2,
    X,
    Tag,
} from "lucide-react";

import api, { endpoints } from "../api";


const emptyProductForm = {
    category: "",
    product_name: "",
    product_description: "",
    product_price: "",
    product_stock: "",
    is_available: true,
    product_image: null,
};


const emptyCategoryForm = {
    category_name: "",
    category_description: "",
    category_image: null,
};


export default function ProductManagement({ user, notify }) {

    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] = useState([]);

    const [productForm, setProductForm] = useState(
        emptyProductForm
    );

    const [editingId, setEditingId] = useState(null);


    // =====================================================
    // CATEGORIES
    // =====================================================

    const [categories, setCategories] = useState([]);

    const [categoryForm, setCategoryForm] = useState(
        emptyCategoryForm
    );


    // =====================================================
    // STATES
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [productBusy, setProductBusy] = useState(false);

    const [categoryBusy, setCategoryBusy] = useState(false);


    // =====================================================
    // LOAD PRODUCTS + CATEGORIES
    // =====================================================

    const loadData = async () => {

        setLoading(true);

        try {

            const [
                productsResponse,
                categoriesResponse,
            ] = await Promise.all([

                api.get(
                    endpoints.products
                ),

                api.get(
                    endpoints.categories
                ),

            ]);


            const productData =
                productsResponse.data;

            const categoryData =
                categoriesResponse.data;


            setProducts(
                Array.isArray(productData)
                    ? productData
                    : productData?.results || []
            );


            setCategories(
                Array.isArray(categoryData)
                    ? categoryData
                    : categoryData?.results || []
            );


        } catch (error) {

            console.error(
                "Product management loading error:",
                error
            );

            notify?.(
                "Unable to load products or categories.",
                "error"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, []);


    // =====================================================
    // VENDOR ACCESS CHECK
    // =====================================================

    if (
        String(user?.role || "").toUpperCase() !==
        "VENDOR"
    ) {

        return (

            <div className="page">

                <div className="panel">

                    <h2>
                        Vendor access required
                    </h2>

                    <p>
                        Only vendor accounts can create
                        and manage products.
                    </p>

                </div>

            </div>

        );
    }


    // =====================================================
    // PRODUCT INPUT CHANGE
    // =====================================================

    const updateProduct = (event) => {

        const {
            name,
            value,
            type,
            checked,
            files,
        } = event.target;


        setProductForm((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files?.[0] || null
                        : value,

        }));
    };


    // =====================================================
    // CATEGORY INPUT CHANGE
    // =====================================================

    const updateCategory = (event) => {

        const {
            name,
            value,
            files,
            type,
        } = event.target;


        setCategoryForm((previous) => ({

            ...previous,

            [name]:
                type === "file"
                    ? files?.[0] || null
                    : value,

        }));
    };


    // =====================================================
    // RESET PRODUCT FORM
    // =====================================================

    const resetProductForm = () => {

        setProductForm({
            ...emptyProductForm,
        });

        setEditingId(null);
    };


    // =====================================================
    // RESET CATEGORY FORM
    // =====================================================

    const resetCategoryForm = () => {

        setCategoryForm({
            ...emptyCategoryForm,
        });

    };


    // =====================================================
    // CREATE CATEGORY
    // =====================================================

    const createCategory = async (event) => {

        event.preventDefault();

        setCategoryBusy(true);

        try {

            const data = new FormData();


            data.append(
                "category_name",
                categoryForm.category_name
            );


            data.append(
                "category_description",
                categoryForm.category_description
            );


            if (
                categoryForm.category_image
            ) {

                data.append(
                    "category_image",
                    categoryForm.category_image
                );

            }


            const response = await api.post(
                endpoints.categoryCreate,
                data
            );


            notify?.(
                response.data?.message ||
                "Category created successfully."
            );


            resetCategoryForm();


            // IMPORTANT:
            // Reload categories so the new
            // category appears in Product dropdown.

            await loadData();


        } catch (error) {

            console.error(
                "Category creation error:",
                error
            );


            const backend =
                error.response?.data;


            let message =
                "Unable to create category.";


            if (backend?.message) {

                message =
                    backend.message;

            } else if (backend) {

                message =
                    Object.values(backend)
                        .flat()
                        .map((item) => String(item))
                        .join(" ");

            }


            notify?.(
                message,
                "error"
            );


        } finally {

            setCategoryBusy(false);

        }
    };


    // =====================================================
    // CREATE / UPDATE PRODUCT
    // =====================================================

    const submitProduct = async (event) => {

        event.preventDefault();

        setProductBusy(true);

        try {

            const data = new FormData();


            data.append(
                "category",
                productForm.category
            );


            data.append(
                "product_name",
                productForm.product_name
            );


            data.append(
                "product_description",
                productForm.product_description
            );


            data.append(
                "product_price",
                productForm.product_price
            );


            data.append(
                "product_stock",
                productForm.product_stock
            );


            data.append(
                "is_available",
                String(
                    productForm.is_available
                )
            );


            if (
                productForm.product_image
            ) {

                data.append(
                    "product_image",
                    productForm.product_image
                );

            }


            let response;


            if (editingId) {

                response = await api.patch(

                    `${endpoints.products}${editingId}/`,

                    data

                );

            } else {

                response = await api.post(

                    endpoints.productCreate,

                    data

                );

            }


            notify?.(

                response.data?.message ||

                (
                    editingId
                        ? "Product updated successfully."
                        : "Product created successfully."
                )

            );


            resetProductForm();


            await loadData();


        } catch (error) {

            console.error(
                "Product save error:",
                error
            );


            const backend =
                error.response?.data;


            let message =
                "Unable to save product.";


            if (backend?.message) {

                message =
                    backend.message;

            } else if (backend) {

                message =
                    Object.values(backend)
                        .flat()
                        .map((item) => String(item))
                        .join(" ");

            }


            notify?.(
                message,
                "error"
            );


        } finally {

            setProductBusy(false);

        }
    };


    // =====================================================
    // EDIT PRODUCT
    // =====================================================

    const editProduct = (product) => {

        setEditingId(product.id);


        setProductForm({

            category:
                product.category || "",

            product_name:
                product.product_name || "",

            product_description:
                product.product_description || "",

            product_price:
                product.product_price || "",

            product_stock:
                product.product_stock ?? "",

            is_available:
                product.is_available !== false,

            // Don't reuse existing file object.
            // User can upload a new image if required.

            product_image: null,

        });


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const deleteProduct = async (product) => {

        const confirmed =
            window.confirm(
                `Delete "${product.product_name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `${endpoints.products}${product.id}/`
            );


            notify?.(
                "Product deleted successfully."
            );


            await loadData();


        } catch (error) {

            console.error(
                "Product delete error:",
                error
            );


            notify?.(
                error.response?.data?.message ||
                "Unable to delete product.",
                "error"
            );

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-title">

                <div>

                    <span className="eyebrow">
                        SELLER WORKSPACE
                    </span>

                    <h1>
                        Product Management
                    </h1>

                    <p>
                        Create categories and manage
                        the products in your storefront.
                    </p>

                </div>

            </div>



            {/* =================================================
                CATEGORY MANAGEMENT
            ================================================= */}

            <div className="panel category-management">

                <div className="panel-head">

                    <div>

                        <span className="eyebrow">
                            CATEGORY MANAGEMENT
                        </span>

                        <h3>
                            Create a product category
                        </h3>

                    </div>

                    <Tag size={22} />

                </div>


                <form
                    onSubmit={createCategory}
                >


                    {/* Category name + image */}

                    <div className="two-col">


                        <Field
                            label="Category name"
                            name="category_name"
                            value={
                                categoryForm.category_name
                            }
                            onChange={
                                updateCategory
                            }
                        />


                        <label className="field">

                            Category image

                            <input
                                type="file"
                                name="category_image"
                                accept="image/*"
                                onChange={
                                    updateCategory
                                }
                                required
                            />

                        </label>


                    </div>



                    {/* Category description */}

                    <label className="field">

                        Category description

                        <textarea
                            name="category_description"
                            value={
                                categoryForm.category_description
                            }
                            onChange={
                                updateCategory
                            }
                            required
                            rows="3"
                        />

                    </label>



                    {/* Create button */}

                    <button
                        type="submit"
                        className="primary-btn compact"
                        disabled={categoryBusy}
                    >

                        <Tag size={17} />

                        {categoryBusy
                            ? "Creating..."
                            : "Create category"}

                    </button>


                </form>

            </div>



            {/* =================================================
                MAIN PRODUCT AREA
            ================================================= */}

            <div className="product-management-grid">


                {/* =================================================
                    PRODUCT FORM
                ================================================= */}

                <form
                    className="panel product-form"
                    onSubmit={submitProduct}
                >


                    <div className="panel-head">

                        <div>

                            <span className="eyebrow">

                                {editingId
                                    ? "EDIT PRODUCT"
                                    : "ADD PRODUCT"}

                            </span>

                            <h3>

                                {editingId
                                    ? "Update product"
                                    : "Create a new product"}

                            </h3>

                        </div>


                        {editingId && (

                            <button
                                type="button"
                                className="icon-btn"
                                onClick={
                                    resetProductForm
                                }
                                title="Cancel edit"
                            >

                                <X size={18} />

                            </button>

                        )}

                    </div>



                    {/* Product name + category */}

                    <div className="two-col">


                        <Field
                            label="Product name"
                            name="product_name"
                            value={
                                productForm.product_name
                            }
                            onChange={
                                updateProduct
                            }
                        />


                        <label className="field">

                            Category

                            <select
                                name="category"
                                value={
                                    productForm.category
                                }
                                onChange={
                                    updateProduct
                                }
                                required
                            >

                                <option value="">
                                    Select category
                                </option>


                                {categories.map(
                                    (category) => (

                                        <option
                                            value={
                                                category.id
                                            }
                                            key={
                                                category.id
                                            }
                                        >

                                            {
                                                category.category_name
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </label>


                    </div>



                    {/* Product description */}

                    <Field
                        label="Product description"
                        name="product_description"
                        value={
                            productForm.product_description
                        }
                        onChange={
                            updateProduct
                        }
                        textarea
                    />



                    {/* Price + stock */}

                    <div className="two-col">


                        <Field
                            label="Price"
                            name="product_price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                productForm.product_price
                            }
                            onChange={
                                updateProduct
                            }
                        />


                        <Field
                            label="Stock"
                            name="product_stock"
                            type="number"
                            min="0"
                            step="1"
                            value={
                                productForm.product_stock
                            }
                            onChange={
                                updateProduct
                            }
                        />


                    </div>



                    {/* Product image */}

                    <label className="field">

                        Product image

                        {editingId
                            ? " (optional when editing)"
                            : ""}


                        <input
                            name="product_image"
                            type="file"
                            accept="image/*"
                            onChange={
                                updateProduct
                            }
                            required={
                                !editingId
                            }
                        />

                    </label>



                    {/* Available */}

                    <label className="product-available">

                        <input
                            name="is_available"
                            type="checkbox"
                            checked={
                                productForm.is_available
                            }
                            onChange={
                                updateProduct
                            }
                        />

                        Product is available

                    </label>



                    {/* No categories */}

                    {!categories.length && (

                        <div className="product-form-note">

                            No categories are available yet.

                            Create a category above
                            before adding a product.

                        </div>

                    )}



                    {/* Submit */}

                    <button
                        type="submit"
                        className="primary-btn compact"
                        disabled={
                            productBusy ||
                            !categories.length
                        }
                    >

                        {editingId
                            ? <Save size={17} />
                            : <PackagePlus size={17} />
                        }


                        {productBusy
                            ? "Saving..."
                            : editingId
                                ? "Save product"
                                : "Add product"}

                    </button>


                </form>



                {/* =================================================
                    INVENTORY
                ================================================= */}

                <div className="panel">


                    <div className="panel-head">

                        <div>

                            <span className="eyebrow">
                                INVENTORY
                            </span>

                            <h3>
                                Products
                            </h3>

                        </div>


                        <span className="inventory-count">

                            {products.length}

                        </span>

                    </div>



                    {loading ? (

                        <div className="product-management-loading">

                            Loading products...

                        </div>

                    ) : !products.length ? (

                        <div className="product-management-empty">

                            No products have been
                            created yet.

                        </div>

                    ) : (

                        <div className="vendor-product-list">

                            {products.map(
                                (product) => (

                                    <div
                                        className="vendor-product-row"
                                        key={product.id}
                                    >


                                        {/* Image */}

                                        <div className="vendor-product-image">

                                            {product.product_image ? (

                                                <img
                                                    src={
                                                        product.product_image
                                                    }
                                                    alt={
                                                        product.product_name
                                                    }
                                                />

                                            ) : (

                                                <ImagePlus
                                                    size={20}
                                                />

                                            )}

                                        </div>



                                        {/* Product information */}

                                        <div className="vendor-product-info">

                                            <strong>

                                                {
                                                    product.product_name
                                                }

                                            </strong>


                                            <span>

                                                ₹
                                                {Number(
                                                    product.product_price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                                {" · "}

                                                Stock{" "}

                                                {
                                                    product.product_stock
                                                }

                                            </span>

                                        </div>



                                        {/* Actions */}

                                        <div className="vendor-product-actions">


                                            <button
                                                type="button"
                                                className="icon-btn"
                                                onClick={() =>
                                                    editProduct(
                                                        product
                                                    )
                                                }
                                                title="Edit product"
                                            >

                                                <Edit3
                                                    size={17}
                                                />

                                            </button>



                                            <button
                                                type="button"
                                                className="icon-btn danger-icon"
                                                onClick={() =>
                                                    deleteProduct(
                                                        product
                                                    )
                                                }
                                                title="Delete product"
                                            >

                                                <Trash2
                                                    size={17}
                                                />

                                            </button>


                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


            </div>

        </div>

    );
}


// =========================================================
// FIELD COMPONENT
// =========================================================

function Field({
    label,
    name,
    value,
    onChange,
    type = "text",
    min,
    step,
    textarea = false,
}) {

    return (

        <label className="field">

            {label}


            {textarea ? (

                <textarea
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    required
                    rows="4"
                />

            ) : (

                <input
                    name={name}
                    type={type}
                    min={min}
                    step={step}
                    value={value ?? ""}
                    onChange={onChange}
                    required
                />

            )}

        </label>

    );
}