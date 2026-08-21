import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Box, CheckCircle2, Clock3, IndianRupee, PackageCheck, ShoppingCart, Sparkles, Truck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import api, { endpoints } from "../api";

const demo = [
 {id:1,product_name:"Premium Wireless Headphones",product_description:"Immersive audio with active noise cancellation.",product_price:"2499",product_stock:18,is_available:true,product_image:""},
 {id:2,product_name:"Smart Fitness Watch",product_description:"Daily activity, sleep and heart-rate tracking.",product_price:"3299",product_stock:12,is_available:true,product_image:""},
 {id:3,product_name:"Minimal Desk Lamp",product_description:"Warm adjustable light for focused work.",product_price:"1199",product_stock:24,is_available:true,product_image:""},
 {id:4,product_name:"Everyday Backpack",product_description:"Clean design with laptop protection.",product_price:"1899",product_stock:8,is_available:true,product_image:""}
];

export default function Dashboard({ user }) {
 const [products,setProducts]=useState([]),[orders,setOrders]=useState([]);
 useEffect(()=>{ Promise.allSettled([api.get(endpoints.products),api.get(endpoints.orders)]).then(([p,o])=>{if(p.status==="fulfilled")setProducts(Array.isArray(p.value.data)?p.value.data:p.value.data.results||[]);if(o.status==="fulfilled")setOrders(Array.isArray(o.value.data)?o.value.data:o.value.data.results||[])});},[]);
 const items=products.length?products:demo;
 const revenue=orders.reduce((a,o)=>a+Number(o.total_amount||0),0);
 return <div className="page">
  <section className="hero-card"><div><span className="eyebrow"><Sparkles size={14}/> YOUR COMMERCE COMMAND CENTER</span><h1>Good to see you, <span>{user?.username || "there"}.</span></h1><p>Track products, orders and your customer journey from one clean workspace.</p><div className="hero-actions"><Link className="primary-btn compact" to="/products">Explore products <ArrowUpRight size={17}/></Link><Link className="ghost-btn" to="/orders">View orders</Link></div></div><div className="hero-orb"><ShoppingCart size={54}/><div className="orb-dot one"/><div className="orb-dot two"/></div></section>
  <div className="stats-grid">
    <Stat icon={ShoppingCart} label="Total orders" value={orders.length} meta="Your orders" />
    <Stat icon={IndianRupee} label="Order value" value={`₹${revenue.toLocaleString("en-IN")}`} meta="Lifetime value" />
    <Stat icon={Box} label="Products" value={products.length||"—"} meta={products.length?"Live catalog":"API ready"} />
    <Stat icon={TrendingUp} label="Platform status" value="Live" meta="REST connected" />
  </div>
  <section className="section-head"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Featured products</h2></div><Link to="/products" className="text-link">View all <ArrowUpRight size={15}/></Link></section>
  <div className="product-grid">{items.slice(0,4).map(p=><ProductCard key={p.id} p={p}/>)}</div>
  <section className="split-grid"><div className="panel"><div className="panel-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Latest orders</h3></div><Link to="/orders">See all</Link></div>{orders.slice(0,4).map(o=><div className="activity" key={o.id}><span className="activity-icon"><PackageCheck size={18}/></span><div><b>Order #{o.id}</b><small>{o.order_status||"Pending"} · {new Date(o.created_at).toLocaleDateString()}</small></div><strong>₹{Number(o.total_amount||0).toLocaleString("en-IN")}</strong></div>)}{!orders.length&&<p className="muted">Your recent orders will appear here.</p>}</div><div className="panel accent-panel"><span className="eyebrow">PROJECT HIGHLIGHT</span><h3>One backend. Multiple experiences.</h3><p>This UI showcases JWT authentication, product discovery, cart management, atomic checkout, order tracking and vendor capabilities.</p><div className="tech-row"><span>React</span><span>DRF</span><span>JWT</span><span>SQLite</span></div></div></section>
 </div>
}
function Stat({icon:Icon,label,value,meta}){return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><span>{label}</span><b>{value}</b><small><CheckCircle2 size={12}/> {meta}</small></div></div>}
function ProductCard({p}){return <Link to={`/products/${p.id}`} className="product-card"><div className="product-image">{p.product_image?<img src={p.product_image} />:<span><Box size={32}/></span>}<i>{p.is_available===false?"Unavailable":"In stock"}</i></div><div className="product-info"><h3>{p.product_name}</h3><p>{p.product_description}</p><strong>₹{Number(p.product_price||0).toLocaleString("en-IN")}</strong></div></Link>}
