import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import { useQuizStore } from "../hooks/useQuizStore";

export function App() {
  const { error, clearError } = useQuizStore();
  const location = useLocation();
  const isPlayer = location.pathname.startsWith("/play/") || location.pathname.includes("/preview");

  return (
    <div className="app-shell">
      {!isPlayer && (
        <header className="topbar">
          <div className="topbar-inner">
            <Link to="/" className="brand" aria-label="SOPHIA trang chủ">
              <span className="brand-mark"><Sparkles size={21} strokeWidth={2.7} /></span>
              <span className="brand-copy"><strong>SOPHIA</strong><small>Quiz Studio</small></span>
            </Link>
            <nav className="main-nav" aria-label="Điều hướng chính">
              <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Trang chủ</NavLink>
              <NavLink to="/quizzes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Quản lý bộ câu hỏi</NavLink>
            </nav>
            <Link to="/quizzes/new" aria-label="Tạo bộ câu hỏi" className="button button-primary header-cta"><Plus size={18} /> <span>Tạo bộ câu hỏi</span></Link>
          </div>
        </header>
      )}
      {error && <div className="global-alert" role="alert">{error}<button onClick={clearError} aria-label="Đóng thông báo">×</button></div>}
      <Outlet />
    </div>
  );
}
