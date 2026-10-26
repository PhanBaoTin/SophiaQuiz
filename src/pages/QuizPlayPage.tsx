import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clock3, Volume2, VolumeX, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuizStore } from "../hooks/useQuizStore";
import { readSoundAsset } from "../services/soundAssets";
import { playSound } from "../utils/soundEffects";

const ANSWER_STYLES = ["answer-blue", "answer-teal", "answer-coral", "answer-orange"];
const ANSWER_SHAPES = ["▲", "●", "■", "◆"];

type Phase = "ready" | "thinking" | "answering" | "wrong" | "correct";

export function QuizPlayPage({ preview = false }: { preview?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, incrementPlayCount } = useQuizStore();
  const quiz = quizzes.find((item) => item.id === id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [remaining, setRemaining] = useState(quiz?.thinkingTime ?? 15);
  const [countdownPopupVisible, setCountdownPopupVisible] = useState(false);
  const [flashingWrongOptionId, setFlashingWrongOptionId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const deadline = useRef(Date.now() + (quiz?.thinkingTime ?? 15) * 1000);
  const completed = useRef(false);
  const ticked = useRef<number | null>(null);
  const wrongFlashTimeout = useRef<number | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const currentQuestion = quiz?.questions[questionIndex];

  useEffect(() => {
    setQuestionIndex(0);
    setPhase("ready");
    setRemaining(quiz?.thinkingTime ?? 15);
    setCountdownPopupVisible(false);
    setFlashingWrongOptionId(null);
    deadline.current = Date.now() + (quiz?.thinkingTime ?? 15) * 1000;
    completed.current = false;
  }, [id, quiz?.thinkingTime]);

  useEffect(() => () => {
    if (wrongFlashTimeout.current !== null) window.clearTimeout(wrongFlashTimeout.current);
  }, []);

  useEffect(() => {
    const assetId = quiz?.sounds?.countdown;
    if (phase !== "thinking" || !soundEnabled || !assetId) return;
    let cancelled = false;
    let audio: HTMLAudioElement | null = null;
    let objectUrl: string | null = null;
    void readSoundAsset(assetId).then((blob) => {
      if (!blob) throw new Error("The countdown audio file is missing from browser storage.");
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      audio = new Audio(objectUrl);
      audio.loop = true;
      audio.volume = 0.35;
      return audio.play();
    }).catch((error: unknown) => {
      if (!cancelled) console.error("SOPHIA: could not play the countdown audio file.", error);
    });
    return () => {
      cancelled = true;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [phase, soundEnabled, quiz?.sounds?.countdown]);

  useEffect(() => {
    if (!quiz || !currentQuestion || phase !== "thinking") return;
    deadline.current = Date.now() + remaining * 1000;
    const interval = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (next <= 3 && next > 0 && ticked.current !== next && soundEnabledRef.current) {
        ticked.current = next;
        playSound("tick");
      }
      if (next === 0) {
        setPhase("answering");
        if (soundEnabledRef.current) playSound("timeout");
      }
    }, 150);
    return () => window.clearInterval(interval);
  }, [quiz, currentQuestion, phase, questionIndex]);

  useEffect(() => {
    if (phase !== "correct") return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 < (quiz?.questions.length ?? 0)) {
        setQuestionIndex((index) => index + 1);
        setRemaining(quiz?.thinkingTime ?? 15);
        setCountdownPopupVisible(false);
        setFlashingWrongOptionId(null);
        ticked.current = null;
        setPhase("ready");
      } else if (quiz) {
        if (!preview && !completed.current) {
          completed.current = true;
          incrementPlayCount(quiz.id);
        }
        navigate(`/play/${quiz.id}/complete`, { state: { runId: crypto.randomUUID(), preview, questionsCompleted: quiz.questions.length } });
      }
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [phase, questionIndex, quiz, preview, incrementPlayCount, navigate]);

  if (!quiz) return <main className="player-page"><MissingQuiz /></main>;
  if (!preview && quiz.status !== "published") return <main className="page-container"><section className="missing-card"><span className="status-badge status-draft">Bản nháp</span><h1>Bộ câu hỏi chưa được xuất bản</h1><p>Hãy xuất bản bộ câu hỏi trước khi bắt đầu chơi.</p><Link className="button button-primary" to={`/quizzes/${quiz.id}/edit`}>Tiếp tục chỉnh sửa</Link><Link className="back-link" to="/quizzes">Về thư viện</Link></section></main>;
  if (!currentQuestion) return <main className="player-page"><MissingQuiz message="Bộ câu hỏi này chưa có câu hỏi." /></main>;

  const progress = ((questionIndex + 1) / quiz.questions.length) * 100;
  const chooseAnswer = (optionId: string) => {
    if (phase !== "answering" && phase !== "wrong") return;
    if (optionId === currentQuestion.correctOptionId) {
      setPhase("correct");
      if (soundEnabled) playSound("correct", quiz.sounds?.correct);
    } else {
      setFlashingWrongOptionId(optionId);
      if (wrongFlashTimeout.current !== null) window.clearTimeout(wrongFlashTimeout.current);
      wrongFlashTimeout.current = window.setTimeout(() => {
        setFlashingWrongOptionId(null);
        wrongFlashTimeout.current = null;
      }, 700);
      setPhase("wrong");
      if (soundEnabled) playSound("wrong", quiz.sounds?.wrong);
    }
  };

  const startCountdown = () => {
    if (phase !== "ready") return;
    ticked.current = null;
    setRemaining(quiz.thinkingTime);
    deadline.current = Date.now() + quiz.thinkingTime * 1000;
    setCountdownPopupVisible(true);
    setPhase("thinking");
  };

  return (
    <div className="player-page">
      <header className="player-header">
        <Link to={preview ? `/quizzes/${quiz.id}/edit` : "/quizzes"} className="player-brand"><span className="brand-mark"><ArrowLeft size={18} /></span><span><strong>{preview ? "Xem trước" : "SOPHIA"}</strong><small>{quiz.title}</small></span></Link>
        <div className="player-progress">
          <div className="player-progress-label"><span>{preview ? "Chế độ xem thử" : "Tiến độ làm bài"}</span><strong>Câu {questionIndex + 1} / {quiz.questions.length}</strong></div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="player-controls">
          {phase === "ready" ? (
            <button type="button" className="timer-pill timer-start" onClick={startCountdown} aria-label={`Bắt đầu đếm ngược ${quiz.thinkingTime} giây`}>
              <Clock3 size={17} /><strong>Bắt đầu</strong>
            </button>
          ) : (
            <div className={`timer-pill ${phase === "thinking" && remaining <= 5 ? "timer-warning" : ""} ${phase !== "thinking" ? "timer-ready" : ""}`} aria-label={phase === "thinking" ? `Đếm ngược: ${remaining} giây` : "Đếm ngược hoàn tất, có thể trả lời"}>
              <Clock3 size={17} /><strong>{phase === "thinking" ? remaining : "✓"}</strong><span>{phase === "thinking" ? "đếm ngược" : "trả lời"}</span>
            </div>
          )}
          <button className="icon-button sound-button" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}>{soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}</button>
          <Link to={preview ? `/quizzes/${quiz.id}/edit` : "/quizzes"} className="button button-secondary exit-button"><X size={16} />{preview ? "Thoát xem thử" : "Thoát"}</Link>
        </div>
      </header>
      <main className="player-content">
        <div className="player-meta"><span className="category-pill">{quiz.category || "BỘ CÂU HỎI"}</span><span className="question-number">CÂU HỎI {String(questionIndex + 1).padStart(2, "0")}</span></div>
        <section className="question-stage" aria-live="polite">
          <div className="question-stage-top"><span className="stage-sparkle">✦</span><span>{quiz.title}</span><span className="stage-sparkle">✦</span></div>
          <h1>{currentQuestion.text}</h1>
          <div className={`timer-line ${phase === "thinking" && remaining <= 5 ? "timer-line-warning" : ""} ${phase === "answering" || phase === "wrong" || phase === "correct" ? "timer-line-ready" : ""}`} aria-label="Đếm ngược">
            <span style={{ width: `${phase === "ready" ? 0 : phase === "answering" || phase === "wrong" || phase === "correct" ? 100 : (remaining / quiz.thinkingTime) * 100}%` }} />
          </div>
          <div className="answer-grid">
            {currentQuestion.options.map((option, index) => {
              const isCorrectChoice = phase === "correct" && option.id === currentQuestion.correctOptionId;
              const isDisabled = phase === "ready" || phase === "thinking" || phase === "correct";
              return <button key={option.id} type="button" className={`player-answer ${ANSWER_STYLES[index]} ${phase === "ready" || phase === "thinking" ? "answer-thinking" : ""} ${isCorrectChoice ? "answer-correct" : ""} ${flashingWrongOptionId === option.id ? "answer-wrong" : ""}`} disabled={isDisabled} onClick={() => chooseAnswer(option.id)}>
                <span className="answer-shape">{isCorrectChoice ? <Check size={21} /> : ANSWER_SHAPES[index]}</span><span className="player-answer-text">{option.text}</span>
              </button>;
            })}
          </div>
          <div className={`feedback-slot feedback-${phase}`} role="status" aria-live="assertive">
            {phase === "ready" && <span>Nhấn “Bắt đầu” khi bạn đã sẵn sàng đếm ngược.</span>}
            {phase === "thinking" && <span>Đang đếm ngược — bạn có thể trả lời khi thời gian kết thúc.</span>}
            {phase === "answering" && <span>Đếm ngược đã kết thúc. Hãy chọn đáp án của bạn!</span>}
            {phase === "wrong" && <><span className="feedback-symbol"><X size={18} /></span><strong>Chưa chính xác — hãy chọn một đáp án khác.</strong></>}
          </div>
        </section>
        <div className="player-footnote"><span>✦</span> Bạn chỉ cần trả lời đúng để tiến đến câu tiếp theo.</div>
      </main>
      {phase === "correct" && (
        <div className="correct-popup-backdrop">
          <div className="correct-popup" role="status" aria-live="assertive">
            <span className="correct-popup-icon"><Check size={26} /></span>
            <strong>Chính xác!</strong>
            <span>{questionIndex + 1 === quiz.questions.length ? "Tuyệt vời! Bạn đã hoàn thành bộ câu hỏi." : "Cùng đến câu tiếp theo nhé."}</span>
          </div>
        </div>
      )}
      {countdownPopupVisible && (phase === "thinking" || phase === "answering") && (
        <div className="countdown-popup-backdrop">
          <section className="countdown-popup" role="dialog" aria-modal="true" aria-labelledby="countdown-popup-title">
            {phase === "thinking" ? (
              <>
                <span className="countdown-popup-label">Thời gian còn lại</span>
                <strong className="countdown-popup-number" aria-live="assertive">{remaining}</strong>
                <span className="countdown-popup-unit">giây</span>
              </>
            ) : (
              <>
                <span className="countdown-popup-expired-icon"><Clock3 size={26} /></span>
                <strong id="countdown-popup-title" className="countdown-popup-expired">Hết Giờ</strong>
                <span className="countdown-popup-message">Bây giờ bạn có thể chọn đáp án.</span>
                <button type="button" className="button button-primary" onClick={() => setCountdownPopupVisible(false)}>Bắt đầu trả lời</button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function MissingQuiz({ message = "Bộ câu hỏi không tồn tại hoặc đã được xóa." }: { message?: string }) {
  return <section className="missing-card"><span className="missing-illustration">?</span><h1>Không tìm thấy bộ câu hỏi</h1><p>{message}</p><Link to="/quizzes" className="button button-primary"><ArrowLeft size={17} />Quay về thư viện</Link></section>;
}
