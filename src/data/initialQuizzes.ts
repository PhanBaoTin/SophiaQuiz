import type { QuizSet } from "../types/quiz";

const questions = [
  {
    id: "xhcn-question-functions",
    text: "Căn cứ vào tính chất của quyền lực nhà nước, chức năng của Nhà nước xã hội chủ nghĩa được chia thành những chức năng nào?",
    answers: [
      "Chức năng đối nội và chức năng đối ngoại.",
      "Chức năng chính trị, chức năng kinh tế và chức năng văn hóa - xã hội.",
      "Chức năng trấn áp (bạo lực) và chức năng xã hội (tổ chức, xây dựng).",
      "Chức năng lập pháp, chức năng hành pháp và chức năng tư pháp.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-question-democracy-state",
    text: "Mối quan hệ biện chứng giữa Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa được xác định như thế nào?",
    answers: [
      "Dân chủ XHCN là công cụ, phương tiện; Nhà nước XHCN là cơ sở, nền tảng.",
      "Dân chủ XHCN là cơ sở, nền tảng; Nhà nước XHCN là công cụ, phương tiện để thực thi dân chủ.",
      "Dân chủ XHCN và Nhà nước XHCN tồn tại hoàn toàn độc lập, không liên quan đến nhau.",
      "Nhà nước XHCN quyết định toàn bộ, còn Dân chủ XHCN chỉ mang tính hình thức.",
    ],
    correct: "B",
  },
  {
    id: "xhcn-question-economic-nature",
    text: "Về bản chất kinh tế, Nhà nước xã hội chủ nghĩa dựa trên chế độ sở hữu nào đối với tư liệu sản xuất?",
    answers: [
      "Chế độ tư hữu tư nhân tư bản chủ nghĩa.",
      "Chế độ sở hữu tư nhân hỗn hợp.",
      "Chế độ công hữu về tư liệu sản xuất là chủ yếu.",
      "Chế độ sở hữu tập thể của giai cấp tư sản.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-question-democracy-development",
    text: "Trong đường lối đổi mới của Đảng Cộng sản Việt Nam, Dân chủ được xác định giữ vị trí, vai trò gì đối với sự phát triển đất nước?",
    answers: [
      "Dân chủ chỉ là công cụ quản lý hành chính tạm thời.",
      "Dân chủ vừa là mục tiêu, vừa là động lực phát triển đất nước.",
      "Dân chủ là mục tiêu duy nhất, không phải là động lực.",
      "Dân chủ là động lực duy nhất, không thuộc về mục tiêu của chủ nghĩa xã hội.",
    ],
    correct: "B",
  },
  {
    id: "xhcn-question-direct-democracy",
    text: "Việc nhân dân bằng hành động trực tiếp bàn bạc, quyết định và kiểm tra, giám sát công việc của nhà nước hoặc cộng đồng dân cư thuộc hình thức dân chủ nào?",
    answers: [
      "Dân chủ gián tiếp.",
      "Dân chủ đại diện.",
      "Dân chủ trực tiếp.",
      "Dân chủ ủy quyền.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-question-leading-force",
    text: "Trong Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam, lực lượng nào giữ vai trò lãnh đạo tối cao?",
    answers: [
      "Mặt trận Tổ quốc Việt Nam.",
      "Quốc hội nước Cộng hòa XHCN Việt Nam.",
      "Đảng Cộng sản Việt Nam.",
      "Tòa án nhân dân tối cao.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-question-governing-principle",
    text: "Nguyên tắc tổ chức và hoạt động cơ bản của bộ máy Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam là nguyên tắc nào?",
    answers: [
      "Nguyên tắc Tam quyền phân lập.",
      "Nguyên tắc Tập trung dân chủ.",
      "Nguyên tắc Tự do tuyệt đối.",
      "Nguyên tắc Phân quyền độc lập.",
    ],
    correct: "B",
  },
] as const;

const democracyQuestions = [
  {
    id: "xhcn-democracy-question-state-origin",
    text: "Theo lý luận của Chủ nghĩa Mác - Lênin, nguồn gốc kinh tế dẫn đến sự ra đời của nhà nước nói chung là gì?",
    answers: [
      "Sự xuất hiện của chế độ tư hữu về tư liệu sản xuất.",
      "Sự xuất hiện của giai cấp và đấu tranh giai cấp.",
      "Sự phát triển của văn hóa và ý thức cộng đồng.",
      "Sự ra đời của các tổ chức tôn giáo.",
    ],
    correct: "A",
  },
  {
    id: "xhcn-democracy-question-state-functions",
    text: "Căn cứ vào phạm vi tác động của quyền lực nhà nước, các chức năng của Nhà nước xã hội chủ nghĩa được chia thành:",
    answers: [
      "Chức năng chính trị, chức năng kinh tế và chức năng văn hóa - xã hội.",
      "Chức năng trấn áp và chức năng tổ chức, xây dựng.",
      "Chức năng lập pháp, chức năng hành pháp và chức năng tư pháp.",
      "Chức năng đối nội và chức năng đối ngoại.",
    ],
    correct: "D",
  },
  {
    id: "xhcn-democracy-question-first-socialist-state",
    text: "Sự ra đời của nền dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa đầu tiên trên thế giới gắn liền với sự kiện lịch sử nào?",
    answers: [
      "Công xã Pari năm 1871.",
      "Cách mạng tư sản Pháp năm 1789.",
      "Cách mạng Tháng Mười Nga năm 1917.",
      "Chiến tranh thế giới thứ hai kết thúc năm 1945.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-democracy-question-vietnam-establishment",
    text: "Nền dân chủ xã hội chủ nghĩa ở Việt Nam chính thức được xác lập từ sau sự kiện lịch sử nào?",
    answers: [
      "Chiến thắng Điện Biên Phủ năm 1954.",
      "Cách mạng Tháng Tám năm 1945.",
      "Đại hội đại biểu toàn quốc lần thứ VI của Đảng năm 1986.",
      "Giải phóng hoàn toàn miền Nam, thống nhất đất nước năm 1975.",
    ],
    correct: "B",
  },
  {
    id: "xhcn-democracy-question-representative",
    text: "Việc nhân dân bầu ra Đại biểu Quốc hội và Đại biểu Hội đồng nhân dân các cấp đại diện cho ý chí, nguyện vọng của mình là biểu hiện của hình thức dân chủ nào?",
    answers: [
      "Dân chủ trực tiếp.",
      "Dân chủ nguyên thủy.",
      "Dân chủ gián tiếp (Dân chủ đại diện).",
      "Dân chủ phi tập trung.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-democracy-question-constitution",
    text: "Trong Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam, vị trí của Hiến pháp và pháp luật được xác định như thế nào?",
    answers: [
      "Pháp luật đứng sau các văn bản chỉ đạo của chính quyền địa phương.",
      "Hiến pháp và pháp luật có thể bị thay đổi tùy theo ý chí cá nhân của cán bộ lãnh đạo.",
      "Pháp luật chỉ áp dụng đối với người dân, không áp dụng cho cơ quan nhà nước.",
      "Hiến pháp và pháp luật giữ vị trí tối thượng trong điều chỉnh các quan hệ xã hội.",
    ],
    correct: "D",
  },
  {
    id: "xhcn-democracy-question-economic-solution",
    text: "Theo quan điểm của Đảng Cộng sản Việt Nam, giải pháp trọng tâm về mặt kinh tế để phát huy quyền làm chủ của nhân dân hiện nay là gì?",
    answers: [
      "Xây dựng và hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa.",
      "Duy trì cơ chế tập trung bao cấp tuyệt đối.",
      "Hạn chế quyền tham gia kinh tế của các tầng lớp nhân dân.",
      "Xóa bỏ hoàn toàn các thành phần kinh tế phi xã hội chủ nghĩa.",
    ],
    correct: "A",
  },
] as const;

const requestedDemocracyQuestions = [
  {
    id: "xhcn-requested-question-economic-foundation",
    text: "Về mặt KINH TẾ, Đảng Cộng sản Việt Nam xác định giải pháp trọng tâm nào để tạo cơ sở vững chắc cho việc phát huy quyền làm chủ của nhân dân hiện nay?",
    answers: [
      "Duy trì cơ chế quản lý kinh tế tập trung bao cấp.",
      "Hạn chế quyền tự do kinh doanh của các thành phần kinh tế tư nhân.",
      "Xây dựng và hoàn thiện thể chế kinh tế thị trường định hướng xã hội chủ nghĩa.",
      "Tự do hóa kinh tế tuyệt đối không có sự quản lý của Nhà nước.",
    ],
    correct: "C",
  },
  {
    id: "xhcn-requested-question-direct-democracy",
    text: "Hình thức Dân chủ trực tiếp ở Việt Nam được thể hiện thông qua hành động nào của nhân dân?",
    answers: [
      "Bầu đại biểu Quốc hội để thay mặt nhân dân quyết định các vấn đề quan trọng của quốc gia.",
      "Bầu đại biểu Hội đồng nhân dân các cấp đại diện cho ý chí, nguyện vọng ở địa phương.",
      "Ủy quyền toàn bộ quyền lực cho các tổ chức đoàn thể chính trị - xã hội quản lý.",
      "Nhân dân bằng hành động trực tiếp bàn bạc, quyết định, kiểm tra, giám sát công việc của nhà nước hoặc cộng đồng dân cư.",
    ],
    correct: "D",
  },
  {
    id: "xhcn-requested-question-democracy-established",
    text: "Nền dân chủ xã hội chủ nghĩa ở Việt Nam chính thức được xác lập gắn liền với sự kiện lịch sử nào?",
    answers: [
      "Cách mạng Tháng Tám năm 1945 với sự ra đời của nước Việt Nam Dân chủ Cộng hòa.",
      "Đại hội đại biểu toàn quốc lần thứ VI của Đảng năm 1986.",
      "Chiến thắng lịch sử Điện Biên Phủ lừng lẫy năm 1954.",
      "Giải phóng hoàn toàn miền Nam, thống nhất đất nước năm 1975.",
    ],
    correct: "A",
  },
  {
    id: "xhcn-requested-question-law-position",
    text: "Đặc điểm cốt lõi về vị trí của pháp luật trong Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam là gì?",
    answers: [
      "Hiến pháp và pháp luật giữ vị trí tối thượng trong điều chỉnh các quan hệ xã hội.",
      "Pháp luật xếp sau các quyết định hành chính của chính quyền địa phương.",
      "Pháp luật chỉ áp dụng bắt buộc với người dân, không áp dụng đối với cơ quan nhà nước.",
      "Pháp luật có thể thay đổi tùy thuộc vào ý chí cá nhân của người đứng đầu.",
    ],
    correct: "A",
  },
  {
    id: "xhcn-requested-question-renewal",
    text: "Sự kiện nào đánh dấu bước tiến quan trọng trong nhận thức của Đảng Cộng sản Việt Nam khi đề ra đường lối đổi mới toàn diện, đặc biệt nhấn mạnh việc phát huy dân chủ tạo động lực phát triển đất nước?",
    answers: [
      "Đại hội đại biểu toàn quốc lần thứ IV (năm 1976).",
      "Đại hội đại biểu toàn quốc lần thứ VI (năm 1986).",
      "Đại hội đại biểu toàn quốc lần thứ VIII (năm 1996).",
      "Đại hội đại biểu toàn quốc lần thứ X (năm 2006).",
    ],
    correct: "B",
  },
  {
    id: "xhcn-requested-question-state-power",
    text: "Nguyên tắc tổ chức quyền lực nhà nước trong Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam được xác định như thế nào?",
    answers: [
      "Quyền lực nhà nước được phân chia hoàn toàn biệt lập theo học thuyết \"Tam quyền phân lập\".",
      "Quyền lực nhà nước là thống nhất, có sự phân công, phối hợp, kiểm soát giữa các cơ quan nhà nước trong việc thực hiện quyền lập pháp, hành pháp và tư pháp.",
      "Quyền lực nhà nước tập trung tuyệt đối vào cơ quan tư pháp mà không có sự kiểm soát.",
      "Quyền lực nhà nước phân rã cho các chính quyền địa phương tự do quyết định.",
    ],
    correct: "B",
  },
  {
    id: "xhcn-requested-question-democracy-role",
    text: "Trong đường lối đổi mới và phát triển đất nước, Đảng Cộng sản Việt Nam xác định vị trí, vai trò của Dân chủ xã hội chủ nghĩa như thế nào?",
    answers: [
      "Dân chủ chỉ là công cụ quản lý hành chính tạm thời của bộ máy nhà nước.",
      "Dân chủ là mục tiêu tối cao duy nhất, không phải là động lực phát triển.",
      "Dân chủ vừa là mục tiêu, vừa là động lực phát triển đất nước.",
      "Dân chủ là phương tiện phụ trợ để thu hút vốn đầu tư nước ngoài.",
    ],
    correct: "C",
  },
] as const;

function toQuestions(
  source: typeof questions | typeof democracyQuestions | typeof requestedDemocracyQuestions,
): QuizSet["questions"] {
  return source.map((question) => ({
    id: question.id,
    text: question.text,
    options: question.answers.map((text, index) => ({
      id: `${question.id}-option-${"abcd"[index]}`,
      text,
    })) as QuizSet["questions"][number]["options"],
    correctOptionId: `${question.id}-option-${question.correct.toLocaleLowerCase()}`,
  }));
}

export const initialQuizzes: QuizSet[] = [
  {
    id: "xhcn-nha-nuoc-va-dan-chu-xhcn",
    title: "Nhà nước và dân chủ xã hội chủ nghĩa",
    description: "Ôn tập chức năng, bản chất của Nhà nước xã hội chủ nghĩa và các nội dung cơ bản về dân chủ xã hội chủ nghĩa Việt Nam.",
    category: "Chủ nghĩa xã hội khoa học",
    thinkingTime: 20,
    questions: toQuestions(questions),
    status: "published",
    createdAt: "2026-10-25T00:00:00.000Z",
    updatedAt: "2026-10-25T00:00:00.000Z",
    publishedAt: "2026-10-25T00:00:00.000Z",
    playCount: 0,
  },
  {
    id: "xhcn-dan-chu-va-nha-nuoc-phap-quyen",
    title: "Dân chủ và Nhà nước pháp quyền xã hội chủ nghĩa",
    description: "Ôn tập nguồn gốc nhà nước, nền dân chủ xã hội chủ nghĩa và Nhà nước pháp quyền Việt Nam.",
    category: "Chủ nghĩa xã hội khoa học",
    thinkingTime: 10,
    questions: toQuestions(democracyQuestions),
    status: "published",
    createdAt: "2026-10-25T00:00:00.000Z",
    updatedAt: "2026-10-25T00:00:00.000Z",
    publishedAt: "2026-10-25T00:00:00.000Z",
    playCount: 0,
  },
  {
    id: "xhcn-dan-chu-va-nha-nuoc-phap-quyen-viet-nam",
    title: "Dân chủ và Nhà nước pháp quyền Việt Nam",
    description: "Ôn tập dân chủ xã hội chủ nghĩa và Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam.",
    category: "Chủ nghĩa xã hội khoa học",
    thinkingTime: 10,
    questions: toQuestions(requestedDemocracyQuestions),
    status: "published",
    createdAt: "2026-10-26T00:00:00.000Z",
    updatedAt: "2026-10-26T00:00:00.000Z",
    publishedAt: "2026-10-26T00:00:00.000Z",
    playCount: 0,
  },
];
