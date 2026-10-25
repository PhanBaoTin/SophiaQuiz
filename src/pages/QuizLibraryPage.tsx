import { BookOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QuizCard } from "../components/quiz/QuizCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useQuizStore } from "../hooks/useQuizStore";
import type { QuizSet } from "../types/quiz";

export function QuizLibraryPage() {
  const { quizzes, deleteQuiz } = useQuizStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<QuizSet | null>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!pendingDelete) return;
    cancelDeleteRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPendingDelete(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [pendingDelete]);
  const visibleQuizzes = useMemo(() => quizzes
    .filter((quiz) => filter === "all" || quiz.status === filter)
    .filter((quiz) => `${quiz.title} ${quiz.description} ${quiz.category}`.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [quizzes, filter, search]);

  return (
    <main className="page-container library-page">
      <div className="page-heading">
        <div><span className="section-kicker">SOPHIA QUIZ STUDIO</span><h1>Quản lý bộ câu hỏi</h1><p>Tất cả ý tưởng và bộ đề của bạn, được lưu ngay trên thiết bị này.</p></div>
        <Link to="/quizzes/new" className="button button-primary"><Plus size={18} />Tạo bộ câu hỏi mới</Link>
      </div>
      <section className="library-toolbar">
        <label className="search-box"><Search size={18} /><span className="sr-only">Tìm kiếm bộ câu hỏi</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, mô tả hoặc danh mục..." /></label>
        <label className="filter-select"><SlidersHorizontal size={17} /><span className="sr-only">Lọc trạng thái</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select></label>
        <span className="results-count">{visibleQuizzes.length} bộ câu hỏi</span>
      </section>
      {visibleQuizzes.length ? (
        <div className="quiz-grid">{visibleQuizzes.map((quiz, index) => <QuizCard key={quiz.id} quiz={quiz} index={index} onDelete={setPendingDelete} />)}</div>
      ) : quizzes.length ? (
        <EmptyState icon={<Search size={24} />} title="Không tìm thấy bộ câu hỏi" description="Thử từ khóa khác hoặc đổi bộ lọc để tìm bộ câu hỏi bạn cần." />
      ) : (
        <EmptyState icon={<BookOpen size={25} />} title="Chưa có bộ câu hỏi nào" description="Tạo bộ câu hỏi đầu tiên của bạn. Mọi nội dung sẽ được lưu cục bộ trên trình duyệt." action={<Link to="/quizzes/new" className="button button-primary"><Plus size={17} />Tạo bộ câu hỏi</Link>} />
      )}
      {pendingDelete && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingDelete(null); }}>
        <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="confirm-icon danger-soft">!</div><h2 id="delete-title">Xóa bộ câu hỏi?</h2>
          <p>Bạn có chắc muốn xóa <strong>{pendingDelete.title || "bộ câu hỏi chưa đặt tên"}</strong>? Hành động này không thể hoàn tác.</p>
          <div className="modal-actions"><button ref={cancelDeleteRef} className="button button-secondary" onClick={() => setPendingDelete(null)}>Giữ lại</button><button className="button button-danger" onClick={() => { deleteQuiz(pendingDelete.id); setPendingDelete(null); }}>Xóa bộ câu hỏi</button></div>
        </section>
      </div>}
    </main>
  );
}
