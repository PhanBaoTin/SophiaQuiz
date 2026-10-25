Bạn hãy đóng vai Senior Frontend Engineer, chuyên phát triển ứng dụng React có UI/UX chất lượng cao.

Nhiệm vụ: Xây dựng hoàn chỉnh frontend cho ứng dụng **SOPHIA — Colorful Quiz Studio**, một ứng dụng cho phép người dùng tự tạo bộ câu hỏi trắc nghiệm, xuất bản, quản lý và chơi các bộ câu hỏi đó.

Tôi muốn bạn trực tiếp làm việc trong workspace VS Code hiện tại, đọc cấu trúc dự án, viết code, cài đặt dependency cần thiết, chạy kiểm tra và sửa lỗi.

Đây là dự án frontend-only.

KHÔNG cần backend.
KHÔNG cần API server.
KHÔNG cần database.
KHÔNG cần đăng nhập hoặc đăng ký.

Toàn bộ dữ liệu phải được lưu cục bộ trên trình duyệt bằng localStorage.

Nếu dự án đã có source code, hãy kiểm tra trước khi thay đổi. Tái sử dụng cấu trúc hợp lý nếu có, nhưng không để code cũ cản trở việc xây dựng ứng dụng theo thiết kế mới.

Không chỉ trả về kế hoạch hoặc code mẫu. Hãy trực tiếp triển khai ứng dụng hoàn chỉnh.

# 1. TECH STACK

Sử dụng:

- React.
- TypeScript.
- Vite.
- React Router DOM.
- Tailwind CSS nếu dự án đã sử dụng hoặc có thể tích hợp phù hợp.
- Lucide React cho icon.
- Web Audio API cho sound effects.
- localStorage để lưu dữ liệu.
- Vitest và React Testing Library cho các unit test quan trọng nếu phù hợp với cấu trúc dự án.

Nếu dự án đã có một bộ công cụ tương đương đang hoạt động, hãy ưu tiên tận dụng thay vì cài lại không cần thiết.

Không sử dụng backend hoặc database.

Không sử dụng dữ liệu giả làm dữ liệu chính sau khi người dùng bắt đầu tạo bộ câu hỏi thật.

# 2. DESIGN REFERENCE — VERY IMPORTANT

Sử dụng thiết kế SOPHIA đã tạo trên Stitch làm nguồn tham chiếu UI chính.

Nếu có ảnh thiết kế, file thiết kế hoặc source code từ Stitch trong workspace, hãy đọc và phân tích chúng trước khi triển khai.

Mục tiêu là tái tạo giao diện đã thiết kế, không phải tự tạo một giao diện khác dựa trên mô tả chung.

Nếu không truy cập được thiết kế Stitch, hãy sử dụng design system bên dưới.

## Visual style

Phong cách:

Colorful Learning Studio + Interactive Quiz Platform.

Tham khảo trải nghiệm của Wayground và Kahoot! nhưng không sao chép logo, nhận diện thương hiệu hoặc bố cục độc quyền của họ.

Giao diện phải:
- Sáng sủa.
- Nhiều màu sắc có chủ đích.
- Hiện đại.
- Thân thiện.
- Có cảm giác tương tác.
- Có tính nhất quán giữa tất cả màn hình.
- Không giống giao diện tài liệu Word.
- Không giống dashboard AI đại trà.
- Không sử dụng dark mode làm mặc định.

## Color palette

Định nghĩa design tokens bằng CSS variables:

--color-primary: #6C4CF1;
--color-primary-dark: #5035C9;
--color-blue: #4388F5;
--color-teal: #20BFA9;
--color-coral: #FF7468;
--color-orange: #FFAA45;
--color-yellow: #FFD75E;
--color-pink: #F47EB8;
--color-background: #F7F7FC;
--color-surface: #FFFFFF;
--color-text: #292943;
--color-text-muted: #74748C;
--color-border: #E8E7F2;
--color-success: #25A66A;
--color-error: #E95362;

Sử dụng các màu này xuyên suốt ứng dụng.

Không chỉ tô màu cho vài icon.

Áp dụng màu sắc vào:
- Quiz cover.
- Statistics.
- Category badges.
- Primary buttons.
- Timer.
- Answer options.
- Progress indicators.
- Success and error feedback.
- Empty states.

Mỗi khu vực cần có mức độ sử dụng màu phù hợp, không làm toàn bộ màn hình quá sặc sỡ.

## Typography

Sử dụng Inter, Plus Jakarta Sans hoặc font sans-serif tương đương.

Tiêu đề phải có phân cấp rõ ràng.

Nội dung câu hỏi phải dễ đọc, đặc biệt trên màn hình chơi.

Không sử dụng quá nhiều kiểu chữ khác nhau.

## Components

Tạo component dùng chung cho:
- Topbar.
- Button.
- Input.
- Textarea.
- Modal.
- Toast notification.
- Status badge.
- Quiz card.
- Statistics item.
- Timer.
- Answer option.
- Empty state.
- Loading state.
- Confirmation dialog.

Sử dụng border-radius khoảng 12–20px cho các thành phần cần cảm giác thân thiện.

Shadow nhẹ, tránh bóng đổ dày.

# 3. APPLICATION STRUCTURE

Ứng dụng có hai mục điều hướng chính trên topbar:

1. Trang chủ.
2. Quản lý bộ câu hỏi.

Ngoài ra, có các màn hình nội bộ:

- Tạo bộ câu hỏi.
- Chỉnh sửa bộ câu hỏi.
- Xem trước.
- Chơi bộ câu hỏi.
- Hoàn thành bộ câu hỏi.

Topbar của khu vực quản lý phải cố định hoặc sticky.

Trên màn hình chơi, có thể sử dụng một player header gọn hơn để người dùng tập trung vào câu hỏi.

Không tạo sidebar nếu không thực sự cần thiết.

# 4. ROUTING

Sử dụng React Router DOM.

Tạo các route tương ứng:

- `/` — Trang chủ.
- `/quizzes` — Quản lý bộ câu hỏi.
- `/quizzes/new` — Tạo bộ câu hỏi.
- `/quizzes/:id/edit` — Chỉnh sửa bộ câu hỏi.
- `/quizzes/:id/preview` — Xem trước.
- `/play/:id` — Chơi bộ câu hỏi.
- `/play/:id/complete` — Hoàn thành.

Có thể điều chỉnh cấu trúc route nếu cần, nhưng phải giữ trải nghiệm điều hướng rõ ràng.

Yêu cầu:
- Không reload toàn trang khi chuyển route.
- Không để trang trắng khi ID không tồn tại.
- Nếu quiz ID không tồn tại, hiển thị trang thông báo thân thiện và nút quay về thư viện.
- Xác nhận trước khi rời trang chỉnh sửa nếu có thay đổi chưa lưu.
- Không để người dùng vô tình mất nội dung đang tạo.

# 5. DATA MODEL

Thiết kế TypeScript types rõ ràng.

Ví dụ:

type QuizStatus = "draft" | "published";

type ThinkingTime = 5 | 10 | 15 | 20 | 30;

interface Question {
  id: string;
  text: string;
  options: [
    { id: string; text: string },
    { id: string; text: string },
    { id: string; text: string },
    { id: string; text: string }
  ];
  correctOptionId: string;
  explanation?: string;
}

interface QuizSet {
  id: string;
  title: string;
  description: string;
  category?: string;
  thinkingTime: number;
  questions: Question[];
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  playCount: number;
}

Có thể điều chỉnh kiểu dữ liệu cho hợp lý nhưng phải bảo đảm:
- Mỗi quiz có ID duy nhất.
- Mỗi câu hỏi có ID duy nhất.
- Mỗi câu hỏi có đúng bốn phương án.
- Mỗi câu hỏi chỉ có một đáp án đúng.
- Thời gian suy nghĩ thuộc về quiz set.
- Tất cả câu hỏi trong một quiz dùng chung thinking time.
- Mỗi quiz có trạng thái draft hoặc published.

Không sử dụng chỉ số mảng làm ID.

# 6. LOCAL STORAGE

Tạo một module quản lý dữ liệu riêng.

Ví dụ:

src/
  services/
    quizStorage.ts

Yêu cầu:

- Lưu danh sách quiz set vào localStorage.
- Tải dữ liệu khi ứng dụng khởi động.
- Lưu thay đổi khi người dùng tạo, sửa, xóa hoặc xuất bản quiz.
- Có xử lý dữ liệu JSON lỗi.
- Có giá trị mặc định khi localStorage chưa có dữ liệu.
- Không làm ứng dụng crash khi dữ liệu bị thiếu hoặc không hợp lệ.
- Cập nhật playCount sau khi người dùng hoàn thành một lượt chơi.
- Không ghi đè dữ liệu người dùng bằng sample data sau lần khởi động đầu tiên.

Có thể khởi tạo một số quiz mẫu trong lần chạy đầu tiên để dashboard không trống, nhưng phải cho phép người dùng xóa chúng.

Dữ liệu phải tồn tại sau khi reload trang.

Không cần tạo tài khoản hoặc đồng bộ dữ liệu giữa các thiết bị.

# 7. HOME DASHBOARD

Route: `/`

Tiêu đề:
"Chào mừng đến với SOPHIA!"

Mô tả:
"Tạo bộ câu hỏi của riêng bạn và biến việc ôn tập thành một trải nghiệm thú vị."

Primary action:
"+ Tạo bộ câu hỏi"

Thống kê:
- Tổng bộ câu hỏi.
- Tổng câu hỏi.
- Bộ câu hỏi đã xuất bản.
- Tổng lượt chơi.

Dữ liệu thống kê phải được tính từ dữ liệu thật trong localStorage.

Section:
"Bộ câu hỏi gần đây"

Hiển thị các quiz set được cập nhật gần nhất.

Mỗi quiz card cần hiển thị:
- Tên bộ câu hỏi.
- Mô tả ngắn.
- Số lượng câu hỏi.
- Thời gian suy nghĩ.
- Trạng thái.
- Thời gian cập nhật.
- Hành động phù hợp.

Quiz card phải có màu nhận diện khác nhau, nhưng vẫn sử dụng cùng một design system.

Các hành động:
- Bản nháp: tiếp tục chỉnh sửa.
- Đã xuất bản: chơi ngay.
- Có thể mở chi tiết để chỉnh sửa hoặc quản lý.

Nếu chưa có quiz, hiển thị empty state có nút tạo mới.

Không hard-code số liệu thống kê.

# 8. QUIZ LIBRARY

Route: `/quizzes`

Tiêu đề:
"Quản lý bộ câu hỏi"

Nút:
"+ Tạo bộ câu hỏi mới"

Chức năng:

- Hiển thị toàn bộ quiz set.
- Tìm kiếm theo tên hoặc mô tả.
- Lọc theo trạng thái draft/published.
- Sắp xếp theo thời gian cập nhật.
- Mở trang chỉnh sửa.
- Xem trước.
- Chơi quiz đã xuất bản.
- Xóa quiz sau khi xác nhận.

Mỗi quiz card hoặc row hiển thị:
- Tên.
- Mô tả.
- Danh mục.
- Số câu hỏi.
- Thinking time.
- Trạng thái.
- Ngày cập nhật.
- Các hành động phù hợp.

Quy tắc:
- Quiz draft không được chơi như một quiz đã xuất bản.
- Quiz published có thể mở để chơi.
- Khi chỉnh sửa quiz published, giữ trạng thái xuất bản hiện tại trong khi người dùng đang chỉnh sửa.
- Khi người dùng thay đổi nội dung đã xuất bản, yêu cầu lưu/xuất bản lại theo cách rõ ràng.
- Không cho xuất bản quiz chưa có câu hỏi hợp lệ.

Không cần phân trang nếu số lượng dữ liệu chưa lớn, nhưng code phải dễ mở rộng.

# 9. CREATE AND EDIT QUIZ

Routes:
- `/quizzes/new`
- `/quizzes/:id/edit`

Giao diện gồm ba phần chính.

## A. Thông tin bộ câu hỏi

Trường:
- Tên bộ câu hỏi.
- Mô tả.
- Danh mục, optional.

Validate:
- Tên không được để trống.
- Giới hạn độ dài hợp lý.
- Hiển thị lỗi gần trường nhập.

## B. Thời gian suy nghĩ

Heading:
"Thời gian suy nghĩ"

Mô tả:
"Thời gian áp dụng cho mỗi câu hỏi trong bộ đề."

Lựa chọn:
- 5 giây.
- 10 giây.
- 15 giây.
- 20 giây.
- 30 giây.
- Tùy chỉnh.

Nếu hỗ trợ tùy chỉnh, giới hạn giá trị trong khoảng 5–120 giây và validate số nguyên hợp lệ.

Thinking time là thiết lập ở cấp quiz set.

Không tạo timer riêng cho từng câu hỏi.

## C. Question builder

Cho phép:
- Thêm câu hỏi.
- Sửa câu hỏi.
- Xóa câu hỏi.
- Chọn đáp án đúng.
- Xem danh sách câu hỏi.
- Mở rộng/thu gọn câu hỏi nếu danh sách dài.

Mỗi câu hỏi có:
- Nội dung.
- Bốn đáp án.
- Một đáp án đúng.
- ID riêng.

Các trường:
- Nội dung câu hỏi.
- Đáp án A.
- Đáp án B.
- Đáp án C.
- Đáp án D.

Cho phép chọn đáp án đúng bằng radio hoặc selectable option.

Validate:
- Nội dung câu hỏi không rỗng.
- Cả bốn đáp án phải có nội dung.
- Phải chọn đáp án đúng.
- Không được lưu câu hỏi chưa hợp lệ.

Có thể hỗ trợ giải thích đáp án nếu phù hợp, nhưng không bắt buộc.

## D. Actions

Cung cấp:
- Lưu bản nháp.
- Xem trước.
- Xuất bản.

Lưu bản nháp:
- Lưu dữ liệu vào localStorage.
- Có thể lưu quiz chưa hoàn chỉnh, nhưng không được chơi quiz đó.

Xem trước:
- Hiển thị giao diện tương tự player.
- Không thay đổi playCount.
- Không làm thay đổi dữ liệu gốc ngoài các thay đổi đã lưu.

Xuất bản:
- Validate toàn bộ quiz.
- Yêu cầu ít nhất một câu hỏi hợp lệ.
- Lưu trạng thái published.
- Ghi publishedAt.
- Thông báo thành công.
- Điều hướng đến trang phù hợp.

Không mất dữ liệu khi người dùng điều hướng nhầm hoặc reload trong lúc đang chỉnh sửa.

Nếu có thay đổi chưa lưu, hãy cảnh báo trước khi rời trang.

# 10. QUIZ PREVIEW

Route: `/quizzes/:id/preview`

Hiển thị:
- Tên quiz.
- Thời gian suy nghĩ.
- Số lượng câu hỏi.
- Một câu hỏi mẫu.
- Bốn đáp án.
- Timer.
- Nút quay lại chỉnh sửa.
- Nút bắt đầu chơi thử.

Nếu quiz chưa được xuất bản, vẫn cho phép preview.

Preview phải sử dụng cùng component với quiz player khi hợp lý để tránh UI khác biệt.

Không tăng playCount khi preview.

Không thay đổi câu hỏi đã lưu khi người dùng thử chọn đáp án trong preview.

# 11. QUIZ PLAYER

Route: `/play/:id`

Đây là phần quan trọng nhất.

Chỉ cho phép chơi quiz đã xuất bản.

Hiển thị một câu hỏi tại một thời điểm.

Player phải bao gồm:
- Quiz title.
- Question progress.
- Progress indicator.
- Timer.
- Nội dung câu hỏi.
- Bốn phương án.
- Feedback area.

Thiết kế:
- Background sáng.
- Màu sắc nổi bật.
- Bốn phương án có màu nhận diện khác nhau.
- Timer nổi bật và ổn định.
- Bố cục tập trung vào câu hỏi.
- Không có sidebar quản lý.
- Không để nội dung dịch chuyển bất thường khi chọn đáp án.

Trên desktop có thể dùng grid 2×2.
Trên mobile dùng một cột.

## 11.1. TIMER LOGIC

Thinking time được lấy từ quiz set.

Khi bắt đầu mỗi lượt trả lời:
- Timer bắt đầu từ thinkingTime.
- Timer đếm ngược đến 0.
- Khi đạt 0, hiển thị timeout feedback.
- Người dùng vẫn ở câu hiện tại.
- Cho phép thử lại.
- Timer được reset cho lần thử tiếp theo.

Khi trả lời sai:
- Timer dừng trong lúc hiển thị feedback.
- Sau feedback, reset timer cho lần thử tiếp theo.

Khi trả lời đúng:
- Dừng timer.
- Hiển thị feedback thành công.
- Sau khoảng 700–1000ms, chuyển sang câu tiếp theo.

Dùng timestamp hoặc deadline-based timing thay vì chỉ phụ thuộc vào số lần gọi setInterval.

Điều này giúp timer ổn định hơn khi trình duyệt bị throttling.

Cleanup interval, timeout và event listeners khi component unmount.

Không để nhiều timer chạy đồng thời.

## 11.2. ANSWER RULES

Đây là business rule bắt buộc:

CHỈ ĐƯỢC CHUYỂN SANG CÂU TIẾP THEO KHI NGƯỜI DÙNG TRẢ LỜI ĐÚNG.

Nếu trả lời sai:
- Không chuyển câu.
- Không tiết lộ đáp án đúng.
- Hiển thị feedback sai.
- Phát âm thanh sai.
- Cho phép thử lại.

Nếu hết giờ:
- Không chuyển câu.
- Hiển thị timeout feedback.
- Phát âm thanh timeout.
- Cho phép thử lại.

Nếu trả lời đúng:
- Khóa các đáp án trong thời gian feedback.
- Highlight đáp án đúng.
- Hiển thị thông báo thành công.
- Phát âm thanh đúng.
- Chuyển câu sau một khoảng thời gian ngắn.

Không được chuyển câu chỉ vì người dùng chọn một đáp án.

Không được tự động chuyển câu khi timer kết thúc.

Không thêm nút Next có thể bỏ qua điều kiện trả lời đúng.

Khi hoàn thành câu cuối:
- Chuyển đến trang completion.
- Cập nhật playCount đúng một lần cho mỗi lượt chơi hoàn thành.
- Không tăng playCount khi refresh hoặc truy cập lại trang completion.

## 11.3. SOUND EFFECTS

Sử dụng Web Audio API để tạo âm thanh tổng hợp đơn giản.

Không yêu cầu backend hoặc tải audio từ server.

Tạo module riêng, ví dụ:
`src/utils/soundEffects.ts`

Cần có:
- Âm thanh tick/countdown nhẹ.
- Âm thanh trả lời đúng vui vẻ.
- Âm thanh trả lời sai ngắn gọn.
- Âm thanh hết giờ.

Các âm thanh phải khác nhau rõ ràng.

Không phát âm thanh quá lớn hoặc gây khó chịu.

Cho phép tắt/bật âm thanh bằng một nút dễ tìm.

Không phát âm thanh countdown quá dày đặc.

Chỉ bắt đầu phát âm thanh sau tương tác hợp lệ của người dùng nếu trình duyệt yêu cầu.

Cleanup audio resources khi không cần thiết.

Nếu âm thanh bị trình duyệt chặn, ứng dụng vẫn phải hoạt động bình thường.

## 11.4. VISUAL FEEDBACK

Đáp án đúng:
- Xanh lá.
- Icon/check indicator.
- Animation ngắn.
- Thông báo tích cực.

Đáp án sai:
- Đỏ san hô.
- Icon cảnh báo.
- Animation shake nhẹ nếu phù hợp.
- Thông báo thử lại.

Hết giờ:
- Trạng thái màu cam hoặc coral.
- Thông báo hết thời gian.
- Không tiết lộ đáp án đúng.

Khi gần hết giờ:
- Timer chuyển trạng thái màu.
- Không nhấp nháy quá mức.

Không sử dụng animation dài hoặc gây mất tập trung.

Tôn trọng `prefers-reduced-motion`.

# 12. QUIZ COMPLETION

Route:
`/play/:id/complete`

Hiển thị:
- Thông báo hoàn thành.
- Tên quiz.
- Số câu đã hoàn thành.
- Nút chơi lại.
- Nút về thư viện.

Không cần hệ thống điểm số phức tạp.

Mỗi câu đều phải được trả lời đúng mới có thể hoàn thành quiz.

Nút chơi lại phải bắt đầu một lượt chơi mới từ câu đầu tiên.

Không giữ nguyên trạng thái hoàn thành cũ.

# 13. UI STATES

Triển khai đầy đủ:
- Empty dashboard.
- Empty library.
- No search results.
- Empty question list.
- Form validation errors.
- Unsaved changes warning.
- Delete confirmation.
- Publish confirmation hoặc success feedback.
- Loading/initialization state nếu cần.
- Missing quiz.
- Draft cannot be played.
- Correct answer.
- Wrong answer.
- Timeout.
- Timer warning.
- Completion.

Không để button chỉ có hình thức nhưng không hoạt động.

Mọi action quan trọng phải có kết quả thực tế.

# 14. RESPONSIVE DESIGN

Kiểm tra các viewport:
- Desktop: 1366×768.
- Tablet: 768px.
- Mobile: 390×844.

Yêu cầu:
- Không có horizontal overflow.
- Topbar không che nội dung.
- Sidebar không cần thiết thì không tạo.
- Form không bị cắt.
- Modal nằm vừa viewport.
- Timer luôn dễ nhìn.
- Answer options dễ bấm trên mobile.
- Không ép nội dung dài vào một fixed height.
- Header và các vùng sticky không chồng lấn.
- Không tạo nhiều nested scroll containers nếu không cần thiết.

# 15. CODE ORGANIZATION

Tổ chức code rõ ràng, có thể mở rộng.

Ví dụ:

src/
  app/
    App.tsx
    router.tsx

  components/
    layout/
      AppLayout.tsx
      Topbar.tsx

    ui/
      Button.tsx
      Input.tsx
      Modal.tsx
      Toast.tsx
      Badge.tsx
      EmptyState.tsx

    quiz/
      QuizCard.tsx
      QuestionEditor.tsx
      QuestionList.tsx
      ThinkingTimeSelector.tsx
      QuizTimer.tsx
      AnswerOption.tsx
      QuizProgress.tsx

  pages/
    DashboardPage.tsx
    QuizLibraryPage.tsx
    QuizEditorPage.tsx
    QuizPreviewPage.tsx
    QuizPlayerPage.tsx
    QuizCompletePage.tsx

  hooks/
    useQuizStorage.ts
    useQuizTimer.ts

  services/
    quizStorage.ts

  utils/
    soundEffects.ts
    quizValidation.ts
    dateUtils.ts

  types/
    quiz.ts

  styles/
    globals.css

Đây chỉ là cấu trúc tham khảo.

Bạn có thể điều chỉnh nếu có cấu trúc tốt hơn, nhưng phải giữ ranh giới rõ ràng giữa:
- UI components.
- Quiz business logic.
- Local storage.
- Timer.
- Sound effects.
- Data validation.

Không viết toàn bộ ứng dụng trong một file.

Không tạo quá nhiều abstraction không cần thiết.

# 16. ACCESSIBILITY

- Button phải có nhãn rõ ràng.
- Form field phải có label.
- Có focus state khi dùng bàn phím.
- Có thể chọn đáp án bằng bàn phím nếu phù hợp.
- Đáp án đúng/sai không chỉ phân biệt bằng màu sắc.
- Sử dụng semantic HTML.
- Modal phải quản lý focus hợp lý.
- Tôn trọng reduced-motion.
- Âm thanh không phải cách duy nhất để truyền đạt feedback.

# 17. IMPLEMENTATION WORKFLOW

Thực hiện theo thứ tự sau:

STEP 1:
Kiểm tra workspace, package.json, source code và các file thiết kế Stitch có sẵn.

STEP 2:
Nếu chưa có dự án React/Vite, tạo cấu trúc dự án phù hợp ngay trong workspace hiện tại. Tránh tạo một thư mục dự án lồng nhau không cần thiết.

STEP 3:
Thiết lập design tokens, global styles, routing và layout.

STEP 4:
Xây dựng dashboard và quiz library.

STEP 5:
Xây dựng quiz editor với chức năng tạo, sửa, xóa câu hỏi.

STEP 6:
Xây dựng localStorage service và kiểm tra persistence.

STEP 7:
Xây dựng preview và quiz player.

STEP 8:
Triển khai timer, retry behavior, sound effects và feedback states.

STEP 9:
Xây dựng completion screen.

STEP 10:
Chạy ứng dụng, kiểm tra TypeScript, lint và production build nếu có các script tương ứng.

STEP 11:
Sửa các lỗi được phát hiện.

STEP 12:
Kiểm tra lại các business rules quan trọng bằng test hoặc kiểm thử thủ công.

Không dừng lại sau khi tạo cấu trúc thư mục.

Không chỉ tạo giao diện tĩnh.

# 18. ACCEPTANCE CRITERIA

Ứng dụng chỉ được xem là hoàn thành khi:

1. Có dashboard hoạt động.
2. Có quiz library hoạt động.
3. Có thể tạo quiz set mới.
4. Có thể thêm nhiều câu hỏi thủ công.
5. Có thể chỉnh sửa và xóa câu hỏi.
6. Có thể đặt thinking time cho toàn bộ quiz set.
7. Có thể lưu draft.
8. Có thể xuất bản quiz hợp lệ.
9. Có thể mở quiz đã xuất bản để chơi.
10. Mỗi màn hình chơi chỉ hiển thị một câu hỏi.
11. Có countdown timer.
12. Có âm thanh đúng, sai và timeout.
13. Trả lời sai không chuyển câu.
14. Hết giờ không chuyển câu.
15. Chỉ trả lời đúng mới chuyển câu.
16. Câu cuối chỉ hoàn thành sau khi trả lời đúng.
17. Có thể chơi lại.
18. Dữ liệu vẫn tồn tại sau khi reload.
19. Dashboard và library cập nhật theo dữ liệu thực.
20. Không cần backend hoặc database.
21. Không có lỗi TypeScript hoặc build mới.
22. Responsive trên desktop và mobile.
23. UI bám sát thiết kế Stitch và sử dụng màu sắc phong phú xuyên suốt ứng dụng.

Bắt đầu bằng việc kiểm tra workspace, sau đó triển khai trực tiếp toàn bộ ứng dụng.

Nếu có vấn đề nhỏ về thiết kế, hãy đưa ra quyết định hợp lý dựa trên design system. Không dừng lại chỉ để hỏi tôi những câu hỏi không cần thiết.