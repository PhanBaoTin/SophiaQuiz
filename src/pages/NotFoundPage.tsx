import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <main className="page-container"><section className="missing-card"><span className="missing-illustration"><Compass size={32} /></span><h1>Trang này đang trốn đâu đó</h1><p>Đường dẫn không đúng hoặc nội dung đã được chuyển đi.</p><Link to="/" className="button button-primary"><ArrowLeft size={17} />Về trang chủ</Link></section></main>;
}
