import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, ShoppingBag, Sparkles } from "lucide-react";
import api, { endpoints } from "../api";

export default function Login({ setUser, notify }) {
  const [form, setForm] = useState({ username:"", password:"" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const r = await api.post(endpoints.login, form);
      localStorage.setItem("access_token", r.data.access);
      localStorage.setItem("refresh_token", r.data.refresh);
      const p = await api.get(endpoints.profile);
      setUser(p.data); navigate("/"); notify("Welcome back to OnDemand.");
    } catch (err) { notify(err.response?.data?.detail || "Invalid username or password.", "error"); }
    finally { setBusy(false); }
  };
  return <div className="auth-page">
    <div className="auth-art"><div className="auth-brand"><span><ShoppingBag/></span> OnDemand</div><div className="auth-copy"><span className="eyebrow"><Sparkles size={14}/> Modern commerce platform</span><h1>Everything you need to <em>sell & shop.</em></h1><p>A polished customer and vendor experience powered by your Django REST backend.</p><div className="auth-pills"><span>JWT Auth</span><span>Checkout</span><span>Orders</span><span>Vendor Hub</span></div></div></div>
    <div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="form-head"><div className="mobile-logo"><ShoppingBag/></div><h2>Welcome back</h2><p>Sign in to continue to your workspace.</p></div>
      <label>Username<div className="input-wrap"><Mail/><input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="your username"/></div></label>
      <label>Password<div className="input-wrap"><LockKeyhole/><input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></div></label>
      <button className="primary-btn" disabled={busy}>{busy ? "Signing in…" : <>Sign in <ArrowRight size={18}/></>}</button>
      <p className="switch">New here? <Link to="/register">Create an account</Link></p>
    </form></div>
  </div>
}
