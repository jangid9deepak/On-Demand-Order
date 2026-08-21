import { CheckCircle2, X, AlertCircle } from "lucide-react";
export default function Toast({ message, type="success", onClose }) {
  return <div className={`toast ${type}`}><span>{type==="success" ? <CheckCircle2/> : <AlertCircle/>}</span><div><b>{type==="success" ? "Success" : "Something went wrong"}</b><p>{message}</p></div><button onClick={onClose}><X size={16}/></button></div>;
}
