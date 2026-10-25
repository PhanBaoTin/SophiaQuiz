import { BookOpen, Clock3, Edit3, Eye, Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readImageAsset } from "../../services/imageAssets";
import type { QuizSet } from "../../types/quiz";
import { Button } from "../ui/Button";

const coverClasses = ["cover-purple", "cover-blue", "cover-teal", "cover-coral"];
const coverIcons = ["✦", "◈", "✿", "✧"];

export function QuizCard({ quiz, index = 0, onDelete }: { quiz: QuizSet; index?: number; onDelete?: (quiz: QuizSet) => void }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setAvatarUrl(null);
    if (!quiz.avatarImageId) return () => { active = false; };
    let objectUrl: string | null = null;
    void readImageAsset(quiz.avatarImageId).then((blob) => {
      if (!blob) return;
      objectUrl = URL.createObjectURL(blob);
      if (active) setAvatarUrl(objectUrl);
      else URL.revokeObjectURL(objectUrl);
    }).catch((error: unknown) => {
      if (active) console.error("SOPHIA: could not load a quiz avatar image in the library.", error);
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [quiz.avatarImageId]);

  return (
    <article className="quiz-card">
      <div className={`quiz-cover ${coverClasses[index % coverClasses.length]}`}>
        {avatarUrl ? <img className="quiz-cover-image" src={avatarUrl} alt="" /> : <span className="cover-decoration" aria-hidden="true">{coverIcons[index % coverIcons.length]}</span>}
        <span className={`status-badge ${quiz.status === "published" ? "status-published" : "status-draft"}`}>
          <span className="status-dot" />{quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
        </span>
        {quiz.category && <span className="category-label">{quiz.category}</span>}
      </div>
      <div className="quiz-card-content">
        <div className="quiz-card-title-row">
          <h3 title={quiz.title}>{quiz.title || "Bộ câu hỏi chưa đặt tên"}</h3>
          {onDelete && <button className="icon-button delete-icon" aria-label={`Xóa ${quiz.title || "bộ câu hỏi"}`} onClick={() => onDelete(quiz)}><Trash2 size={17} /></button>}
        </div>
        <p className="quiz-description">{quiz.description || "Chưa có mô tả cho bộ câu hỏi này."}</p>
        <div className="quiz-meta">
          <span><BookOpen size={15} />{quiz.questions.length} câu hỏi</span>
          <span><Clock3 size={15} />{quiz.thinkingTime} giây / câu</span>
        </div>
        <div className="quiz-updated">Cập nhật {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(quiz.updatedAt))}</div>
        <div className="quiz-card-actions">
          {quiz.status === "published" ? (
            <Link className="button button-primary card-play" to={`/play/${quiz.id}`}><Play size={16} fill="currentColor" />Chơi ngay</Link>
          ) : (
            <Link className="button button-soft card-play" to={`/quizzes/${quiz.id}/edit`}><Edit3 size={16} />Tiếp tục soạn thảo</Link>
          )}
          <Link className="button button-icon" to={`/quizzes/${quiz.id}/edit`} aria-label="Chỉnh sửa"><Edit3 size={17} /></Link>
          <Link className="button button-icon" to={`/quizzes/${quiz.id}/preview`} aria-label="Xem trước"><Eye size={17} /></Link>
        </div>
      </div>
    </article>
  );
}

export function DeleteQuizButton({ quiz, onDelete }: { quiz: QuizSet; onDelete: (quiz: QuizSet) => void }) {
  return <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => onDelete(quiz)}>Xóa</Button>;
}
