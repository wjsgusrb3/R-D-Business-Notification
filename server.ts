import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Gemini API 클라이언트 초기화
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// ─────────────────────────────────────────────
// 실시간 AI 공고 검색 API
// 수정: gemini-3.5-flash(존재하지 않음) → gemini-2.0-flash
// ─────────────────────────────────────────────
app.post("/api/grants/search", async (req, res) => {
  try {
    const { keywords, companyName } = req.body;
    const queryKeywords = keywords || "로봇, 인공지능, 자율주행, 정밀측정, 제조업";
    const company = companyName || "(주)테스트엔지니어링";

    if (!aiClient) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY가 설정되지 않았습니다. .env 파일에 GEMINI_API_KEY를 추가해 주세요." 
      });
    }

    const systemPrompt = `당신은 대한민국 R&D 지원사업 매칭 전문가 AI입니다.
사용자 기업 "${company}"의 핵심 기술 키워드는 "${queryKeywords}"입니다.
이를 기반으로 2026년 실제 신청 가능한 정부 R&D/시설/수출/사업화 지원사업 공고 5개를 생성하십시오.
반드시 순수 JSON 배열만 반환하십시오. 마크다운 블록(\`\`\`json)이나 설명 텍스트는 절대 포함하지 마십시오.`;

    const response = await aiClient.models.generateContent({
      // 수정: 실제 존재하는 모델명으로 변경
      model: "gemini-2.0-flash",
      contents: `사용자 키워드 "${queryKeywords}"에 최적화된 R&D 지원사업 5개를 JSON 배열로 반환하십시오.
각 항목의 필수 필드:
- id (1~5 정수)
- title (사업명)
- agency (소관 기관, 예: IRIS, KEIT, KOTRA, SMTECH, IITP)
- targets (기술 태그, 쉼표 구분, 예: "인공지능, 제어, 로봇")
- deadline (마감일, 2026-07-01 ~ 2026-09-30 사이 날짜)
- dDay (예: "D-15")
- budget (예: "최대 5억원")
- type ("R&D" | "시설보급" | "수출지원" | "사업화")
- description (2~3문장 한글 설명)
- eligibility (신청 자격 요건)
- benefit (지원 혜택 상세)
- steps (심사 단계, 예: "서류 심사 ➔ 대면 피칭 ➔ 협약")
- score (키워드 매칭 정합도 40~99 정수, 최적 2~3개는 85점 이상)
- reason (이 과제를 추천하는 AI 분석 이유, 존댓말로 2~3문장)`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              agency: { type: Type.STRING },
              targets: { type: Type.STRING },
              deadline: { type: Type.STRING },
              dDay: { type: Type.STRING },
              budget: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING },
              eligibility: { type: Type.STRING },
              benefit: { type: Type.STRING },
              steps: { type: Type.STRING },
              score: { type: Type.INTEGER },
              reason: { type: Type.STRING }
            },
            required: ["id","title","agency","targets","deadline","dDay","budget","type","description","eligibility","benefit","steps","score","reason"]
          }
        },
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Gemini API로부터 응답이 없습니다.");

    const grants = JSON.parse(text);
    // D-Day를 서버에서도 동적 계산하여 내려줌
    const today = Date.now();
    const grantsWithDDay = grants.map((g: any) => ({
      ...g,
      dDay: (() => {
        const diff = Math.ceil((new Date(g.deadline).getTime() - today) / 86400000);
        if (diff > 0) return `D-${diff}`;
        if (diff === 0) return 'D-Day';
        return `D+${Math.abs(diff)}`;
      })()
    }));

    res.json({ grants: grantsWithDDay, isRealTime: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("실시간 공고 검색 오류:", msg);
    res.status(500).json({ 
      error: "AI 공고 검색 중 오류가 발생했습니다.",
      details: msg
    });
  }
});

// ─────────────────────────────────────────────
// 컨설팅 신청 API (TODO: 실제 이메일 발송 연동)
// ─────────────────────────────────────────────
app.post("/api/consulting", async (req, res) => {
  const { companyName, name, phone, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: "이름과 연락처는 필수입니다." });
  }
  // TODO: 실제 이메일 발송 (nodemailer 등) 또는 CRM 연동
  console.log("컨설팅 신청:", { companyName, name, phone, message, time: new Date().toISOString() });
  res.json({ success: true, message: "상담 신청이 접수되었습니다." });
});

// ─────────────────────────────────────────────
// Vite 미들웨어 & SPA 서빙
// ─────────────────────────────────────────────
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(distPath);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ RD-CONNECT 서버 실행 중: http://localhost:${PORT}`);
  });
}

startServer();
