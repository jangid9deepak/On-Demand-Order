import { useEffect, useState } from "react";
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api, { endpoints } from "../api";
import EmptyState from "../components/EmptyState";

const demo=[{id:1,product_name:"Premium Wireless Headphones",product_description:"Immersive audio with active noise cancellation.",product_price:2499,product_stock:18,is_available:true},{id:2,product_name:"Smart Fitness Watch",product_description:"Daily activity and sleep tracking.",product_price:3299,product_stock:12,is_available:true},{id:3,product_name:"Minimal Desk Lamp",product_description:"Warm adjustable light.",product_price:1199,product_stock:24,is_available:true},{id:4,product_name:"Everyday Backpack",product_description:"Laptop-ready everyday carry.",product_price:1899,product_stock:8,is_available:true},{id:5,product_name:"Mechanical Keyboard",product_description:"Tactile switches and compact layout.",product_price:4599,product_stock:7,is_available:true},{id:6,product_name:"Ceramic Coffee Set",product_description:"Minimal tableware for daily coffee.",product_price:1599,product_stock:15,is_available:true}];

export default function Products({user}) {
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[searchParams]=useSearchParams(),[q,setQ]=useState(searchParams.get("search")||"");
 useEffect(()=>{api.get(endpoints.products,{params:{search:q||undefined}}).then(r=>setProducts(Array.isArray(r.data)?r.data:r.data.results||[])).catch(()=>setProducts(demo)).finally(()=>setLoading(false))},[q]);
 const list=(products.length?products:demo).filter(p=>(p.product_name||"").toLowerCase().includes(q.toLowerCase()));
 return <div className="page"><div className="page-title"><div><span className="eyebrow">CATALOG</span><h1>Products</h1><p>Discover products from the marketplace.</p></div>{user?.role==="VENDOR"&&<Link to="/vendor/products" className="primary-btn compact"><Plus size={17}/> Add product</Link>}</div>
 <div className="toolbar"><div className="search-box"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…"/></div><button className="filter-btn"><SlidersHorizontal/> Filters</button><button className="filter-btn"><Filter/> Available</button></div>
 {loading?<div className="loading-grid">{[1,2,3,4].map(x=><div className="skeleton" key={x}/>)}</div>:list.length?<div className="product-grid large">{list.map(p=><ProductCard p={p} key={p.id}/>)}</div>:<EmptyState title="No products found" text="Try a different search term."/>}
 <div className="demo-note">If the backend catalog list route is not enabled, this screen uses tasteful demo cards so the UI remains presentation-ready. See README for the two small backend fixes.</div>
 </div>
}
function ProductCard({p}){return <Link className="product-card" to={`/products/${p.id}`}><div className="product-image">{p.product_image?<img src={p.product_image}/>:<span className="fake-product">{(p.product_name||"P").slice(0,1)}</span>}<i>{p.is_available===false?"Unavailable":"In stock"}</i></div><div className="product-info"><h3>{p.product_name}</h3><p>{p.product_description}</p><div className="price-row"><strong>₹{Number(p.product_price||0).toLocaleString("en-IN")}</strong><small>{p.product_stock||0} left</small></div></div></Link>}
