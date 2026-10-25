import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Layers3, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { QuizCard } from "../components/quiz/QuizCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useQuizStore } from "../hooks/useQuizStore";

export function DashboardPage() {
  const { quizzes } = useQuizStore();
  const recent = [...quizzes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
  const stats = [
    { label: "Tổng bộ câu hỏi", value: quizzes.length, icon: <Layers3 size={19} />, tone: "stat-purple" },
    { label: "Tổng câu hỏi", value: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0), icon: <BookOpen size={19} />, tone: "stat-blue" },
    { label: "Đã xuất bản", value: quizzes.filter((quiz) => quiz.status === "published").length, icon: <CheckCircle2 size={19} />, tone: "stat-teal" },
    { label: "Tổng lượt chơi", value: quizzes.reduce((sum, quiz) => sum + quiz.playCount, 0), icon: <Flame size={19} />, tone: "stat-coral" },
  ];

  return (
    <main className="page-container">
      <section className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><Sparkles size={14} /> KHÔNG GIAN SÁNG TẠO CỦA BẠN</span>
          <h1>Chào mừng đến với<br /><span>SOPHIA!</span></h1>
          <p>Tạo bộ câu hỏi của riêng bạn và biến việc ôn tập thành một trải nghiệm thú vị.</p>
          <div className="hero-actions">
            <Link to="/quizzes/new" className="button button-mint"><Plus size={19} />Tạo bộ câu hỏi mới</Link>
            <Link to="/quizzes" className="button button-hero-secondary">Khám phá kho đề <ArrowRight size={17} /></Link>
          </div>
          <div className="hero-trust"><span><CheckCircle2 size={15} /> Lưu trữ an toàn trên thiết bị</span><span><Sparkles size={15} /> Thiết kế cho việc học vui vẻ</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="floating-star star-one">✦</div><div className="floating-star star-two">✧</div>
          <div className="preview-window">
            <div className="preview-window-head"><i /><i /><i /><span>QUIZ STUDIO</span></div>
            <div className="preview-question"><span className="preview-label">CÂU HỎI MỚI</span><strong>Sẵn sàng khám phá<br />kiến thức chưa?</strong></div>
            <div className="preview-answers"><span className="answer-chip chip-blue">A</span><span className="answer-chip chip-teal">B</span><span className="answer-chip chip-coral">C</span><span className="answer-chip chip-orange">D</span></div>
          </div>
          <div className="floating-note"><span className="note-icon">✦</span><span><strong>Ý tưởng của bạn</strong><small>Biến thành cuộc chơi!</small></span></div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Thống kê">
        {stats.map((stat) => <article className={`stat-card ${stat.tone}`} key={stat.label}>
          <span className="stat-icon">{stat.icon}</span><span className="stat-value">{stat.value}</span><span className="stat-label">{stat.label}</span>
        </article>)}
      </section>

      <section className="section-heading">
        <div><span className="section-kicker">KHÔNG GIAN CỦA BẠN</span><h2>Bộ câu hỏi gần đây</h2><p>Tiếp tục sáng tạo hoặc bắt đầu một hành trình mới.</p></div>
        <Link className="text-link" to="/quizzes">Xem tất cả thư viện <ArrowRight size={17} /></Link>
      </section>
      {recent.length ? (
        <div className="quiz-grid">{recent.map((quiz, index) => <QuizCard key={quiz.id} quiz={quiz} index={index} />)}</div>
      ) : (
        <EmptyState icon={<BookOpen size={25} />} title="Thư viện của bạn đang chờ câu hỏi đầu tiên" description="Tạo bộ câu hỏi đầu tiên và bắt đầu biến kiến thức thành một hành trình thú vị." action={<Link to="/quizzes/new" className="button button-primary"><Plus size={17} />Tạo bộ câu hỏi đầu tiên</Link>} />
      )}
      <div className="dashboard-tip"><span className="tip-icon"><Clock3 size={19} /></span><p><strong>Mẹo nhỏ:</strong> Chọn thời gian suy nghĩ phù hợp để mỗi lượt chơi vừa vui, vừa giúp bạn tập trung.</p><span className="tip-flower">✿</span></div>
    </main>
  );
}
