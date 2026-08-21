import { PackageOpen } from "lucide-react";
export default function EmptyState({ title, text }) {
  return <div className="empty"><div className="empty-icon"><PackageOpen/></div><h3>{title}</h3><p>{text}</p></div>;
}
