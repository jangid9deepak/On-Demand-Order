import { Bell, ChevronDown, LogOut, Search, ShoppingBag, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark"><ShoppingBag size={20}/></span><span>OnDemand</span></Link>
      <div className="global-search"><Search size={18}/><input placeholder="Search products, categories…" onKeyDown={e => e.key === "Enter" && navigate(`/products?search=${encodeURIComponent(e.target.value)}`)}/><kbd>⌘ K</kbd></div>
      <div className="top-actions">
        <button className="icon-btn"><Bell size={19}/><i /></button>
        <div className="avatar">{(user?.username || "U").slice(0,1).toUpperCase()}</div>
        <div className="user-mini"><b>{user?.username || "Account"}</b><span>{user?.role || "Customer"}</span></div>
        <button className="icon-btn" title="Logout" onClick={onLogout}><LogOut size={18}/></button>
      </div>
    </header>
  );
}
