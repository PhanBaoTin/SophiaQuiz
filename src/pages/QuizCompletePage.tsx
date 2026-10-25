import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Play, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { useQuizStore } from "../hooks/useQuizStore";

interface CompletionState {
  preview?: boolean;
  questionsCompleted?: number;
  runId?: string;
}

export function QuizCompletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as CompletionState;
  const { quizzes } = useQuizStore();
  const quiz = quizzes.find((item) => item.id === id);

  if (!quiz) return <main className="page-container"><section className="missing-card"><h1>Không tìm thấy bộ câu hỏi</h1><p>Bộ câu hỏi này không tồn tại hoặc đã được xóa.</p><Link to="/quizzes" className="button button-primary"><ArrowLeft size={17} />Về thư viện</Link></section></main>;
  if (!state.runId) return <main className="page-container"><section className="missing-card"><h1>Chưa có lượt chơi hoàn thành</h1><p>Hãy hoàn thành bộ câu hỏi để xem kết quả tại đây.</p><Link to={quiz.status === "published" ? `/play/${quiz.id}` : "/quizzes"} className="button button-primary"><Play size={17} />{quiz.status === "published" ? "Bắt đầu chơi" : "Về thư viện"}</Link></section></main>;

  return (
    <main className="completion-page">
      <div className="completion-confetti" aria-hidden="true"><span>✦</span><span>✿</span><span>✧</span><span>✦</span><span>◆</span><span>✿</span><span>✧</span></div>
      <section className="completion-card">
        <div className="completion-trophy"><Trophy size={38} fill="currentColor" /></div>
        <span className="completion-eyebrow"><Sparkles size={15} />{state.preview ? "LƯỢT XEM THỬ HOÀN TẤT" : "HOÀN THÀNH XUẤT SẮC"}</span>
        <h1>{state.preview ? "Bạn đã thử xong!" : "Bạn làm được rồi!"}</h1>
        <p className="completion-description">Bạn đã trả lời đúng tất cả câu hỏi trong</p>
        <h2>{quiz.title}</h2>
        <div className="completion-stat"><span className="completion-check"><Check size={20} /></span><strong>{state.questionsCompleted ?? quiz.questions.length}</strong><span>câu hỏi hoàn thành</span></div>
        <div className="completion-actions">
          {state.preview ? <button className="button button-primary" onClick={() => navigate(`/quizzes/${quiz.id}/preview`, { replace: true })}><RotateCcw size={17} />Xem thử lại</button> : quiz.status === "published" && <button className="button button-primary" onClick={() => navigate(`/play/${quiz.id}`, { replace: true })}><RotateCcw size={17} />Chơi lại</button>}
          {state.preview && <Link className="button button-primary" to={`/quizzes/${quiz.id}/edit`}><Play size={17} />Quay lại chỉnh sửa</Link>}
          <Link className="button button-secondary" to="/quizzes"><ArrowLeft size={17} />Về thư viện</Link>
        </div>
        <div className="completion-local-note"><span>✦</span> Tiến trình và bộ câu hỏi được lưu trên thiết bị của bạn.</div>
      </section>
    </main>
  );
}
