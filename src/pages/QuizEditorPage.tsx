import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Eye, ImagePlus, Music2, Plus, Radio, Save, Trash2, Upload, X } from "lucide-react";
import { Link, useBlocker, useNavigate, useParams, type BlockerFunction } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useQuizStore } from "../hooks/useQuizStore";
import { clearEditorDraft, readEditorDraft, writeEditorDraft } from "../services/quizStorage";
import { deleteImageAsset, readImageAsset, saveImageAsset } from "../services/imageAssets";
import { deleteSoundAsset, readSoundAsset, saveSoundAsset } from "../services/soundAssets";
import type { AnswerOption, Question, QuizInput, QuizSet, QuizSoundType } from "../types/quiz";
import { validateQuestion, validateQuiz } from "../utils/quizValidation";

const OPTION_COLORS = ["option-blue", "option-teal", "option-coral", "option-orange"];
const LETTERS = ["A", "B", "C", "D"];
const SOUND_OPTIONS: { type: QuizSoundType; title: string; description: string }[] = [
  { type: "countdown", title: "Âm thanh đếm ngược", description: "Phát lặp trong lúc người chơi suy nghĩ." },
  { type: "correct", title: "Âm thanh trả lời đúng", description: "Phát khi người chơi chọn đúng đáp án." },
  { type: "wrong", title: "Âm thanh trả lời sai", description: "Phát khi người chơi chọn đáp án sai." },
];
const MAX_SOUND_FILE_SIZE = 10 * 1024 * 1024;
const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

function newQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    text: "",
    options: Array.from({ length: 4 }, () => ({ id: crypto.randomUUID(), text: "" })) as Question["options"],
    correctOptionId: "",
  };
}

function blankInput(): QuizInput {
  return { title: "", description: "", category: "", thinkingTime: 15, sounds: {}, questions: [newQuestion()] };
}

function toInput(quiz: QuizSet): QuizInput {
  return { title: quiz.title, description: quiz.description, category: quiz.category, thinkingTime: quiz.thinkingTime, avatarImageId: quiz.avatarImageId, sounds: quiz.sounds ?? {}, questions: quiz.questions };
}

function isEditorDraft(value: unknown, id: string | undefined): value is { quizId?: string; input: QuizInput } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { quizId?: unknown; input?: unknown };
  if (candidate.quizId !== id || !candidate.input || typeof candidate.input !== "object") return false;
  const input = candidate.input as Partial<QuizInput>;
  return typeof input.title === "string" && typeof input.description === "string" &&
    typeof input.category === "string" && typeof input.thinkingTime === "number" &&
    (input.avatarImageId === undefined || typeof input.avatarImageId === "string") && Array.isArray(input.questions);
}

export function QuizEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, saveQuiz } = useQuizStore();
  const existing = quizzes.find((quiz) => quiz.id === id);
  const restored = useMemo(() => {
    const candidate = readEditorDraft<unknown>();
    return isEditorDraft(candidate, id) ? candidate.input : null;
  }, [id]);
  const original = useMemo(() => existing ? toInput(existing) : blankInput(), [existing]);
  const [input, setInput] = useState<QuizInput>(() => restored ?? original);
  const [savedSignature, setSavedSignature] = useState(() => JSON.stringify(original));
  const [fieldError, setFieldError] = useState<{ title?: string; thinkingTime?: string; questions?: string }>({});
  const [questionMessage, setQuestionMessage] = useState<Record<string, string>>({});
  const [soundPreviewUrls, setSoundPreviewUrls] = useState<Partial<Record<QuizSoundType, string>>>({});
  const [soundError, setSoundError] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "avatar">("content");
  const previewUrls = useRef<Partial<Record<QuizSoundType, string>>>({});
  const uploadedAvatarIds = useRef(new Set<string>());
  const [expanded, setExpanded] = useState<string[]>(() => (restored ?? original).questions.map((question) => question.id));
  const dirtyRef = useRef(false);
  const isDirty = JSON.stringify(input) !== savedSignature;
  dirtyRef.current = isDirty;
  const shouldBlock = useCallback<BlockerFunction>(({ currentLocation, nextLocation }) =>
    dirtyRef.current && currentLocation.pathname !== nextLocation.pathname, []);
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    let active = true;
    for (const { type, title } of SOUND_OPTIONS) {
      const assetId = input.sounds?.[type];
      if (!assetId || previewUrls.current[type]) continue;
      void readSoundAsset(assetId).then((blob) => {
        if (!active) return;
        if (!blob) {
          setSoundError(`Không tìm thấy file ${title.toLowerCase()}. Hãy tải file lên lại.`);
          return;
        }
        const url = URL.createObjectURL(blob);
        previewUrls.current[type] = url;
        setSoundPreviewUrls({ ...previewUrls.current });
      }).catch((error: unknown) => {
        if (active) {
          console.error("SOPHIA: could not load an audio preview.", error);
          setSoundError("Không thể tải âm thanh đã lưu. Hãy kiểm tra bộ nhớ của trình duyệt.");
        }
      });
    }
    return () => { active = false; };
  }, [input.sounds]);

  useEffect(() => () => {
    Object.values(previewUrls.current).forEach((url) => { if (url) URL.revokeObjectURL(url); });
  }, []);

  useEffect(() => {
    let active = true;
    setAvatarPreviewUrl(null);
    const imageId = input.avatarImageId;
    if (!imageId) return () => { active = false; };
    void readImageAsset(imageId).then((blob) => {
      if (!active) return;
      if (!blob) {
        setAvatarError("Không tìm thấy ảnh đã lưu. Hãy tải ảnh lên lại.");
        return;
      }
      setAvatarPreviewUrl(URL.createObjectURL(blob));
      setAvatarError(null);
    }).catch((error: unknown) => {
      if (active) {
        console.error("SOPHIA: could not load the quiz avatar image.", error);
        setAvatarError("Không thể tải ảnh đã lưu. Hãy kiểm tra bộ nhớ của trình duyệt.");
      }
    });
    return () => { active = false; };
  }, [input.avatarImageId]);

  useEffect(() => () => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      if (window.confirm("Bạn có thay đổi chưa lưu. Rời trang? Bản chỉnh sửa tạm vẫn được lưu trên thiết bị.")) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    try {
      if (isDirty) writeEditorDraft({ quizId: id, input });
      else if (readEditorDraft<{ quizId?: string }>()?.quizId === id) clearEditorDraft();
    } catch (error) {
      console.error("SOPHIA: could not save the temporary editor draft.", error);
    }
  }, [id, input, isDirty]);

  if (id && !existing) {
    return <main className="page-container"><section className="missing-card"><h1>Không tìm thấy bộ câu hỏi</h1><p>Bộ câu hỏi có thể đã bị xóa hoặc đường dẫn không còn hợp lệ.</p><Link to="/quizzes" className="button button-primary">Quay về thư viện</Link></section></main>;
  }

  const setField = <K extends keyof QuizInput>(key: K, value: QuizInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setFieldError((errors) => ({ ...errors, [key]: undefined }));
  };

  const uploadSound = async (type: QuizSoundType, file: File | undefined) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".mp3") || (file.type && file.type !== "audio/mpeg" && file.type !== "audio/mp3")) {
      setSoundError("Vui lòng chọn file MP3.");
      return;
    }
    if (file.size > MAX_SOUND_FILE_SIZE) {
      setSoundError("File MP3 không được vượt quá 10 MB.");
      return;
    }
    try {
      const assetId = crypto.randomUUID();
      await saveSoundAsset(assetId, file);
      const url = URL.createObjectURL(file);
      const oldUrl = previewUrls.current[type];
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      previewUrls.current[type] = url;
      setSoundPreviewUrls({ ...previewUrls.current });
      setInput((current) => ({ ...current, sounds: { ...current.sounds, [type]: assetId } }));
      setSoundError(null);
    } catch (error) {
      console.error("SOPHIA: could not save an uploaded audio file.", error);
      setSoundError("Không thể lưu file âm thanh trên thiết bị. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.");
    }
  };

  const uploadAvatar = async (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Vui lòng chọn ảnh định dạng JPG, PNG hoặc WebP.");
      return;
    }
    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setAvatarError("Ảnh đại diện không được vượt quá 5 MB.");
      return;
    }
    try {
      const imageId = crypto.randomUUID();
      await saveImageAsset(imageId, file);
      const previousId = input.avatarImageId;
      if (previousId && uploadedAvatarIds.current.has(previousId)) {
        try {
          await deleteImageAsset(previousId);
          uploadedAvatarIds.current.delete(previousId);
        } catch (error) {
          console.error("SOPHIA: could not remove a replaced temporary quiz image.", error);
        }
      }
      uploadedAvatarIds.current.add(imageId);
      setInput((current) => ({ ...current, avatarImageId: imageId }));
      setAvatarError(null);
    } catch (error) {
      console.error("SOPHIA: could not save the uploaded quiz avatar image.", error);
      setAvatarError("Không thể lưu ảnh trên thiết bị. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.");
    }
  };

  const removeAvatar = () => {
    setInput((current) => ({ ...current, avatarImageId: undefined }));
    setAvatarPreviewUrl(null);
    setAvatarError(null);
  };

  const removeSound = (type: QuizSoundType) => {
    const url = previewUrls.current[type];
    if (url) URL.revokeObjectURL(url);
    delete previewUrls.current[type];
    setSoundPreviewUrls({ ...previewUrls.current });
    setInput((current) => {
      const sounds = { ...current.sounds };
      delete sounds[type];
      return { ...current, sounds };
    });
    setSoundError(null);
  };

  const updateQuestion = (questionId: string, update: (question: Question) => Question) => {
    setInput((current) => ({ ...current, questions: current.questions.map((question) => question.id === questionId ? update(question) : question) }));
    setQuestionMessage((messages) => ({ ...messages, [questionId]: "" }));
  };

  const addQuestion = () => {
    const question = newQuestion();
    setInput((current) => ({ ...current, questions: [...current.questions, question] }));
    setExpanded((current) => [...current, question.id]);
  };

  const removeQuestion = (questionId: string) => {
    setInput((current) => ({ ...current, questions: current.questions.filter((question) => question.id !== questionId) }));
    setQuestionMessage((messages) => { const next = { ...messages }; delete next[questionId]; return next; });
  };

  const persist = (publish: boolean): string | null => {
    const errors = publish ? validateQuiz(input) : {};
    setFieldError(errors);
    if (Object.keys(errors).length) {
      if (errors.questions) setExpanded(input.questions.map((question) => question.id));
      setQuestionMessage(Object.fromEntries(input.questions.map((question) => [question.id, validateQuestion(question) ?? ""])));
      return null;
    }
    const now = new Date().toISOString();
    const quiz: QuizSet = {
      id: existing?.id ?? crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      thinkingTime: input.thinkingTime,
      avatarImageId: input.avatarImageId,
      sounds: input.sounds,
      questions: input.questions.map((question) => ({ ...question, text: question.text.trim(), options: question.options.map((option) => ({ ...option, text: option.text.trim() })) as Question["options"], explanation: question.explanation?.trim() })),
      status: publish ? "published" : (existing?.status === "published" ? "draft" : "draft"),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt: publish ? now : undefined,
      playCount: existing?.playCount ?? 0,
    };
    if (!saveQuiz(quiz)) return null;
    for (const imageId of uploadedAvatarIds.current) {
      if (imageId !== input.avatarImageId) {
        void deleteImageAsset(imageId).catch((error: unknown) => console.error("SOPHIA: could not remove an unused uploaded quiz image.", error));
      }
    }
    uploadedAvatarIds.current.clear();
    if (existing?.avatarImageId && existing.avatarImageId !== input.avatarImageId) {
      void deleteImageAsset(existing.avatarImageId).catch((error: unknown) => console.error("SOPHIA: could not remove a replaced quiz image.", error));
    }
    const currentSoundIds = new Set(Object.values(input.sounds ?? {}).filter((assetId): assetId is string => Boolean(assetId)));
    for (const oldAssetId of Object.values(existing?.sounds ?? {})) {
      if (oldAssetId && !currentSoundIds.has(oldAssetId)) {
        void deleteSoundAsset(oldAssetId).catch((error: unknown) => console.error("SOPHIA: could not remove a replaced audio file.", error));
      }
    }
    try {
      clearEditorDraft();
    } catch (error) {
      console.error("SOPHIA: could not clear the temporary editor draft.", error);
    }
    dirtyRef.current = false;
    setSavedSignature(JSON.stringify(input));
    return quiz.id;
  };

  const saveAndLeave = () => {
    if (!persist(false)) return;
    navigate("/quizzes");
  };

  const preview = () => {
    if (!input.title.trim()) {
      setFieldError({ title: "Đặt tên bộ câu hỏi trước khi xem trước." });
      return;
    }
    if (existing && !isDirty) {
      navigate(`/quizzes/${existing.id}/preview`);
      return;
    }
    const savedId = persist(false);
    if (savedId) navigate(`/quizzes/${savedId}/preview`);
  };

  const publish = () => {
    const savedId = persist(true);
    if (savedId) navigate(`/quizzes/${savedId}/preview`);
  };

  const isPublishedEdit = existing?.status === "published" && isDirty;

  return (
    <main className="page-container editor-page">
      <div className="editor-topline">
        <Link to={existing ? "/quizzes" : "/"} className="back-link"><ArrowLeft size={17} />Quay lại</Link>
        <span className="editor-save-state"><span className={`save-dot ${isDirty ? "save-dot-pending" : ""}`} />{isDirty ? "Thay đổi được lưu tạm trên thiết bị" : "Đã lưu"}</span>
      </div>
      <div className="page-heading editor-heading">
        <div><span className="section-kicker">{existing ? "CHỈNH SỬA BỘ CÂU HỎI" : "BẮT ĐẦU SÁNG TẠO"}</span><h1>{existing ? "Không gian chỉnh sửa" : "Tạo bộ câu hỏi mới"}</h1><p>Ý tưởng của bạn, câu hỏi của bạn — hãy cùng tạo nên điều thú vị.</p></div>
        {existing?.status === "published" && <span className="published-notice">Bộ đề đang xuất bản{isPublishedEdit ? " · cần xuất bản lại để áp dụng thay đổi" : ""}</span>}
      </div>

      <div className="editor-layout">
        <div className="editor-main-column">
          <div className="editor-tabs" role="tablist" aria-label="Nội dung chỉnh sửa bộ câu hỏi">
            <button id="editor-content-tab" className={`editor-tab ${activeTab === "content" ? "editor-tab-active" : ""}`} type="button" role="tab" aria-selected={activeTab === "content"} aria-controls="editor-content-panel" onClick={() => setActiveTab("content")}>Nội dung bộ câu hỏi</button>
            <button id="editor-avatar-tab" className={`editor-tab ${activeTab === "avatar" ? "editor-tab-active" : ""}`} type="button" role="tab" aria-selected={activeTab === "avatar"} aria-controls="editor-avatar-panel" onClick={() => setActiveTab("avatar")}>Ảnh đại diện</button>
          </div>
          <div className="editor-tab-panel" id="editor-content-panel" role="tabpanel" aria-labelledby="editor-content-tab" hidden={activeTab !== "content"}>
          <section className="editor-panel">
            <div className="panel-heading"><span className="panel-number">01</span><div><h2>Thông tin bộ câu hỏi</h2><p>Đặt tiêu đề giúp mọi người nhớ về bộ đề của bạn.</p></div></div>
            <label className="field-label" htmlFor="quiz-title">Tên bộ câu hỏi <span>*</span></label>
            <input id="quiz-title" className={`text-input ${fieldError.title ? "input-error" : ""}`} maxLength={80} value={input.title} onChange={(event) => setField("title", event.target.value)} placeholder="Ví dụ: Khám phá vũ trụ" />
            {fieldError.title && <span className="field-error">{fieldError.title}</span>}
            <div className="field-count">{input.title.length}/80</div>
            <label className="field-label" htmlFor="quiz-description">Mô tả <span className="optional">(không bắt buộc)</span></label>
            <textarea id="quiz-description" className="text-input text-area" maxLength={240} value={input.description} onChange={(event) => setField("description", event.target.value)} placeholder="Bộ câu hỏi này nói về điều gì?" rows={3} />
            <label className="field-label" htmlFor="quiz-category">Danh mục <span className="optional">(không bắt buộc)</span></label>
            <input id="quiz-category" className="text-input" maxLength={40} value={input.category} onChange={(event) => setField("category", event.target.value)} placeholder="Ví dụ: Khoa học, Lịch sử..." />
          </section>

          <section className="editor-panel">
            <div className="panel-heading"><span className="panel-number panel-number-blue">02</span><div><h2>Thời gian suy nghĩ</h2><p>Thời gian áp dụng cho mỗi câu hỏi trong bộ đề.</p></div></div>
            <div className="time-options">
              {[5, 10, 15, 20, 30].map((seconds) => <button key={seconds} type="button" className={`time-option ${input.thinkingTime === seconds ? "selected" : ""}`} onClick={() => setField("thinkingTime", seconds)}><strong>{seconds}</strong><span>giây</span></button>)}
              <label className={`time-option time-custom ${![5, 10, 15, 20, 30].includes(input.thinkingTime) ? "selected" : ""}`}><span>Tùy chỉnh</span><input aria-label="Thời gian tùy chỉnh tính bằng giây" type="number" min={5} max={120} value={![5, 10, 15, 20, 30].includes(input.thinkingTime) ? input.thinkingTime : ""} placeholder="5–120" onChange={(event) => setField("thinkingTime", event.target.value === "" ? 15 : Number(event.target.value))} /></label>
            </div>
            {fieldError.thinkingTime && <span className="field-error">{fieldError.thinkingTime}</span>}
          </section>

          <section className="editor-panel">
            <div className="panel-heading"><span className="panel-number panel-number-pink"><Music2 size={16} /></span><div><h2>Âm thanh bộ câu hỏi</h2><p>Tải MP3 lên để cá nhân hóa trải nghiệm làm bài. Mỗi file tối đa 10 MB.</p></div></div>
            <div className="sound-upload-list">
              {SOUND_OPTIONS.map(({ type, title, description }) => (
                <div className="sound-upload-item" key={type}>
                  <div className="sound-upload-copy"><strong>{title}</strong><span>{description}</span></div>
                  <div className="sound-upload-actions">
                    <label className="sound-upload-button"><Upload size={14} />{input.sounds?.[type] ? "Thay file" : "Tải MP3"}<input type="file" accept=".mp3,audio/mpeg" aria-label={`${title} - chọn file MP3`} onChange={(event) => { void uploadSound(type, event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
                    {input.sounds?.[type] && <button className="sound-remove-button" type="button" aria-label={`Xóa ${title.toLowerCase()}`} onClick={() => removeSound(type)}><X size={15} /></button>}
                  </div>
                  {soundPreviewUrls[type] && <audio className="sound-preview" controls preload="none" src={soundPreviewUrls[type]} aria-label={`Nghe thử ${title.toLowerCase()}`} />}
                </div>
              ))}
            </div>
            <p className="sound-storage-note">Âm thanh được lưu riêng trên trình duyệt này và sẽ dùng khi chơi hoặc xem trước bộ câu hỏi.</p>
            {soundError && <div className="builder-error" role="alert">{soundError}</div>}
          </section>

          <section className="editor-panel question-builder">
            <div className="panel-heading panel-heading-between"><div className="panel-heading"><span className="panel-number panel-number-teal">03</span><div><h2>Câu hỏi của bạn</h2><p>Mỗi câu hỏi có bốn đáp án và một lựa chọn đúng.</p></div></div><span className="question-count">{input.questions.length} câu</span></div>
            {fieldError.questions && <div className="builder-error" role="alert">{fieldError.questions}</div>}
            {input.questions.length === 0 && <div className="question-empty">Chưa có câu hỏi. Hãy thêm câu hỏi đầu tiên để bắt đầu nhé!</div>}
            <div className="question-list">
              {input.questions.map((question, index) => {
                const isExpanded = expanded.includes(question.id);
                return <article className="question-editor-card" key={question.id}>
                  <div className="question-card-header">
                    <button className="question-toggle" type="button" onClick={() => setExpanded((current) => isExpanded ? current.filter((item) => item !== question.id) : [...current, question.id])} aria-expanded={isExpanded}>
                      <span className="question-index">Q{String(index + 1).padStart(2, "0")}</span><span className="question-summary">{question.text || "Câu hỏi chưa có nội dung"}</span>{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button className="icon-button delete-icon" type="button" aria-label={`Xóa câu hỏi ${index + 1}`} onClick={() => removeQuestion(question.id)}><Trash2 size={16} /></button>
                  </div>
                  {isExpanded && <div className="question-fields">
                    <label className="field-label" htmlFor={`question-${question.id}`}>Nội dung câu hỏi <span>*</span></label>
                    <textarea id={`question-${question.id}`} className="text-input text-area" value={question.text} maxLength={300} rows={2} placeholder="Nhập câu hỏi của bạn..." onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, text: event.target.value }))} />
                    <div className="options-editor">
                      {question.options.map((option: AnswerOption, optionIndex) => <label className={`answer-input-row ${OPTION_COLORS[optionIndex]}`} key={option.id}>
                        <input type="radio" name={`correct-${question.id}`} checked={question.correctOptionId === option.id} onChange={() => updateQuestion(question.id, (current) => ({ ...current, correctOptionId: option.id }))} aria-label={`Đặt đáp án ${LETTERS[optionIndex]} là đáp án đúng`} />
                        <span className="answer-letter">{LETTERS[optionIndex]}</span>
                        <input className="answer-text-input" value={option.text} maxLength={160} placeholder={`Nội dung đáp án ${LETTERS[optionIndex]}`} onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, options: current.options.map((item) => item.id === option.id ? { ...item, text: event.target.value } : item) as Question["options"] }))} />
                        {question.correctOptionId === option.id && <Check className="answer-correct-icon" size={16} aria-label="Đáp án đúng" />}
                      </label>)}
                    </div>
                    {questionMessage[question.id] && <span className="field-error">{questionMessage[question.id]}</span>}
                    <label className="field-label" htmlFor={`explanation-${question.id}`}>Giải thích <span className="optional">(không bắt buộc)</span></label>
                    <input id={`explanation-${question.id}`} className="text-input" value={question.explanation ?? ""} placeholder="Giải thích đáp án đúng..." onChange={(event) => updateQuestion(question.id, (current) => ({ ...current, explanation: event.target.value }))} />
                    <div className="correct-hint"><Radio size={15} /> Chọn vòng tròn trước đáp án đúng.</div>
                  </div>}
                </article>;
              })}
            </div>
            <button className="add-question-button" type="button" onClick={addQuestion}><Plus size={18} />Thêm câu hỏi</button>
          </section>
          </div>
          <section className="editor-panel editor-tab-panel" id="editor-avatar-panel" role="tabpanel" aria-labelledby="editor-avatar-tab" hidden={activeTab !== "avatar"}>
            <div className="panel-heading"><span className="panel-number panel-number-blue"><ImagePlus size={17} /></span><div><h2>Ảnh đại diện bộ câu hỏi</h2><p>Tải ảnh để cá nhân hóa bộ câu hỏi trong thư viện.</p></div></div>
            {avatarPreviewUrl ? <div className="avatar-preview"><img src={avatarPreviewUrl} alt="Ảnh đại diện bộ câu hỏi" /></div> : <div className="avatar-empty"><ImagePlus size={30} /><span>Chưa tải ảnh đại diện lên</span></div>}
            <div className="avatar-actions">
              <label className="sound-upload-button"><Upload size={14} />{input.avatarImageId ? "Thay ảnh" : "Tải ảnh lên"}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh đại diện bộ câu hỏi" onChange={(event) => { void uploadAvatar(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>
              {input.avatarImageId && <button className="sound-remove-button" type="button" aria-label="Xóa ảnh đại diện" onClick={removeAvatar}><X size={15} /></button>}
            </div>
            <p className="sound-storage-note">Ảnh không bắt buộc. Hỗ trợ JPG, PNG hoặc WebP, tối đa 5 MB.</p>
            {avatarError && <div className="builder-error" role="alert">{avatarError}</div>}
          </section>
        </div>
        <aside className="editor-aside">
          <div className="publish-card"><span className="publish-sparkle">✦</span><h3>Sẵn sàng chia sẻ?</h3><p>Lưu nháp để hoàn thiện sau, hoặc xuất bản khi bộ câu hỏi đã sẵn sàng.</p>
            <div className="publish-summary"><span>{input.questions.length} câu hỏi</span><span>{input.thinkingTime} giây mỗi câu</span></div>
            <Button variant="secondary" icon={<Save size={17} />} onClick={saveAndLeave}>Lưu bản nháp</Button>
            <Button variant="primary" icon={<Upload size={17} />} onClick={publish}>{isPublishedEdit ? "Cập nhật bản xuất bản" : "Xuất bản bộ câu hỏi"}</Button>
            <Button variant="ghost" icon={<Eye size={17} />} onClick={preview}>Xem trước</Button>
            <small>{isDirty ? "Bản nháp tự động lưu trên trình duyệt khi bạn chỉnh sửa." : "Mọi thay đổi được lưu cục bộ trên thiết bị."}</small>
          </div>
          <div className="editor-tip"><strong>✨ Mẹo tạo câu hỏi hay</strong><p>Viết câu hỏi ngắn gọn, đưa ra bốn lựa chọn rõ ràng và đảm bảo chỉ có một đáp án chính xác.</p></div>
        </aside>
      </div>
    </main>
  );
}
