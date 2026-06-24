import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
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
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 실시간 AI 공고 검색 & 매칭 생성 API
app.post("/api/grants/search", async (req, res) => {
  try {
    const { keywords, companyName } = req.body;
    const queryKeywords = keywords || "로봇, 인공지능, 자율주행, 정밀측정, 제조업";
    const company = companyName || "(주)테스트엔지니어링";

    if (!aiClient) {
      return res.status(500).json({ 
        error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in Settings > Secrets." 
      });
    }

    // Google Search Grounding과 결합하여 실제 한국의 R&D 과제 공고 트렌드나 신규 과제를 생성
    const systemPrompt = `당신은 대한민국 R&D 지원사업 매칭 전문가이자 분석 AI 로봇입니다.
사용자 기업의 이름은 "${company}"이며, 회사의 핵심 기술 키워드는 "${queryKeywords}"입니다.
이 정보를 기반으로 사용자의 기업에 가장 잘 어울리고, 2026년 기준 실제로 신청 및 추진해볼 수 있는 구체적이고 현실적인 정부 R&D/시설/수출/사업화 지원사업 공고 5개를 가상 또는 실제 정부부처 공고 데이터 기반으로 생성하십시오.
검색 결과나 최신 R&D 공시 동향을 반영하되, 반드시 한국어로 친절하고 구체적으로 작성해 주십시오.

반드시 아래에 정의된 JSON 스키마 형식으로 응답을 반환하십시오. 절대 마크다운 블록(\`\`\`json)이나 다른 설명 없이 순수 JSON만 반환해야 합니다.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `사용자 키워드 "${queryKeywords}"에 대한 최고의 R&D 매칭 지원사업 5개를 구체적이고 상세하게 설계하여 JSON 배열로 반환하십시오.
각 지원사업은 반드시 다음 필드들을 포함해야 합니다:
- id (숫자 1부터 5까지 순서대로)
- title (사업명, 예: 차세대 기술개발 지원사업)
- agency (소관 기관/부처, 예: IRIS, 중소벤처기업부, KOTRA, SMTECH 등)
- targets (지원 핵심 분야들을 쉼표로 나열한 기술 태그 목록, 예: "인공지능, 제어, 로봇")
- deadline (접수 마감일, 2026년 7월 ~ 9월 중 임의의 날짜로 지정)
- dDay (마감일까지 남은 일수 형식, 예: "D-15", "D-3" 등)
- budget (지원 한도 예산액, 예: "최대 5억원", "최대 10억원")
- type ("R&D", "시설보급", "수출지원", "사업화" 중 하나)
- description (과제에 대한 2~3문장의 매우 구체적인 한글 요약 설명)
- eligibility (신청 대상 조건 및 필수 자격 요건 설명)
- benefit (정부출연금 한도 및 기업 자부담 비율, 기타 수혜 혜택 상세 설명)
- steps (서류평가부터 협약까지의 구체적인 전체 심사 단계 설명, 예: "서류 심사 ➔ 대면 피칭 ➔ 현장 실사 ➔ 협약")
- score (이 공고가 사용자 회사 핵심 키워드 "${queryKeywords}"와 가지는 AI 매칭 정합도 점수, 40에서 99 사이의 정수. 매칭이 매우 강한 2~3개 과제는 85점 이상으로 주십시오.)
- reason (사용자 기업의 핵심 역량 "${queryKeywords}"과 이 과제가 왜 연관성이 높고 어떻게 추진해야 하는지에 대한 정밀한 AI 분석 및 추천 사유 요약 - 친절하고 전문적인 존댓말 조언)
`,
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
            required: [
              "id", "title", "agency", "targets", "deadline", "dDay", 
              "budget", "type", "description", "eligibility", 
              "benefit", "steps", "score", "reason"
            ]
          }
        },
        tools: [{ googleSearch: {} }], // 실시간 구글 검색을 결합해 실제 공고에 근접한 정보 수집 지원
        toolConfig: { includeServerSideToolInvocations: true }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini API");
    }

    const grants = JSON.parse(text);
    res.json({ grants, isRealTime: true });
  } catch (error: any) {
    console.error("Error in real-time grants search:", error);
    res.status(500).json({ 
      error: "AI 매칭 공고 실시간 로드 중 오류가 발생했습니다.", 
      details: error.message 
    });
  }
});

// Vite Middleware & SPA serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
