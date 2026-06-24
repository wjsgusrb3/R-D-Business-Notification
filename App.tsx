import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Building2, Flame, Calendar, ArrowRight, SlidersHorizontal, 
  CheckCircle2, ChevronRight, Bell, LayoutDashboard, FileText, 
  Settings, PieChart, Info, Mail, Globe, Filter, Bookmark,
  Sparkles, X, Check, Share2, Trophy, HelpCircle, RefreshCw
} from 'lucide-react';

// 1. 가상의 R&D 지원사업 데이터 (백엔드 확장성 고려 및 상세설명 추가)
const MOCK_GRANTS = [
  { 
    id: 1, 
    title: '차세대 로봇 자율주행 부품 국산화 기술개발', 
    agency: 'IRIS (범부처통합)', 
    targets: '로봇, 인공지능, 제어, 자율주행', 
    deadline: '2026-07-15', 
    dDay: 'D-15', 
    budget: '최대 5억원', 
    type: 'R&D',
    description: '글로벌 시장 진출을 위해 자율주행 로봇의 핵심 구동 및 센싱 핵심 부품을 국산화하고, 통합 제어 모듈 소프트웨어를 설계 및 검증하는 국책 R&D 과제입니다.',
    eligibility: '창업 3년 이상의 로봇, 인공지능, 정밀 제어 관련 기술 개발 역량을 보유한 중소·중견기업 (단독 또는 산학연 컨소시엄 가능)',
    benefit: '연구개발비 국비 지원 (총 과제비의 75% 이내), 연구장비 임대 비용 지원 및 특허 출원 컨설팅 지원',
    steps: '서류 평가 (7월 말) ➔ 대면 검증 및 발표 평가 (8월 중순) ➔ 최종 선정 및 협약 체결 (9월 초)'
  },
  { 
    id: 2, 
    title: '2026년 스마트공장 제조혁신 고도화 지원사업', 
    agency: 'SMTECH', 
    targets: '제조업, 자동화, 공정개선, 스마트공장', 
    deadline: '2026-07-03', 
    dDay: 'D-3', 
    budget: '최대 2억원', 
    type: '시설보급',
    description: '국내 제조업의 생산성 및 품질 혁신을 위해 사물인터넷(IoT), 인공지능 기반 분석 솔루션 및 스마트공장 정밀 자동화 공정 설비 도입을 종합 패키지 형태로 지원합니다.',
    eligibility: '중소·중견 제조기업 (기존 기초 단계 스마트공장 구축 완료 기업 또는 신규 스마트 자동화 공정 도입 희망 기업)',
    benefit: '솔루션 및 연동 장비 구축비 최대 2억원 매칭 지원 (자부담 비율 50% 완화)',
    steps: '현장 실사 (7월 초) ➔ 사업계획서 검토 및 중기부 심의 (7월 중순) ➔ 구축 착수 (8월)'
  },
  { 
    id: 3, 
    title: '2026년도 민군융합 핵심소재 자립화 사업', 
    agency: 'KEIT', 
    targets: '소재, 부품, 제조업, 국방', 
    deadline: '2026-07-20', 
    dDay: 'D-20', 
    budget: '최대 10억원', 
    type: 'R&D',
    description: '국방 우주항공 및 지상 전술 부품에 활용되는 차세대 국방 핵심 나노 탄소 소재를 민간 주도로 독자 개발하고 국내 서플라이 체인을 자립화하기 위한 대규모 기술개발 과제입니다.',
    eligibility: '부설연구소를 보유하고 관련 국산 소재 양산 또는 기초 원천 기술 특허를 보유한 매출액 50억 이상의 법인 기업',
    benefit: '연간 최대 5억원, 최장 2년간 R&D 정부 출연금 지원 및 국방 전문 연계 실증 시험 비용 면제',
    steps: '사전 자격 심사 ➔ 기술성 서류 평가 ➔ 현장 양산성 실사 ➔ 군 적용성 평가 ➔ 최종 매칭 및 과제 수행'
  },
  { 
    id: 4, 
    title: '글로벌 강소기업 수출 마케팅 바우처 지원', 
    agency: 'KOTRA', 
    targets: '수출, 마케팅, 해외진출, 전시회', 
    deadline: '2026-07-07', 
    dDay: 'D-7', 
    budget: '최대 5천만원', 
    type: '수출지원',
    description: '우수한 독자 기술을 보유하고 있으나 해외 유통망 및 전시 참가를 위한 자금이 부족한 수출 유망 강소기업을 대상으로 글로벌 온·오프라인 해외 진출 마케팅 전용 바우처를 제공합니다.',
    eligibility: '전년도 직수출 실적 10만불 이상 또는 금년 수출 확정 실적 보유 수출 유망 제조/서비스 중소기업',
    benefit: '수출 바우처 5,000만원 발급 (바우처 내에서 해외 전시회 참관, 바이어 발굴, 번역, 영문 홍보 제작 자유 선택)',
    steps: '수출 실적 및 글로벌 역량 서면 평가 ➔ 해외 진출 계획서 비대면 피칭 (7월 중) ➔ 바우처 교부 (8월)'
  },
  { 
    id: 5, 
    title: '인공지능 기반 정밀측정 시스템 고도화', 
    agency: 'IITP', 
    targets: '인공지능, 소프트웨어, 정밀측정', 
    deadline: '2026-07-30', 
    dDay: 'D-30', 
    budget: '최대 4억원', 
    type: 'R&D',
    description: '초정밀 반도체 및 미세 정밀 측정 장비 제조 시 발생하는 수집 데이터를 인공지능 머신러닝 엔진을 통해 보정하고 오차율을 서브 미크론 단위로 실시간 제어하는 원천 SW 과제입니다.',
    eligibility: '인공지능 SW 알고리즘 설계 역량을 가진 소프트웨어 벤처기업 또는 산학연 협동 연구기관',
    benefit: '연구원 인건비 지원, 고성능 AI 개발 인프라 클라우드 컴퓨팅 이용료 지원, 해외 기술교류회 파견비',
    steps: '온라인 서류 신청 ➔ 코딩 및 SW 성능 검증 평가 ➔ 연구 책임자 온라인 발표 ➔ 협약 체결 및 연구 개시'
  },
];

// 2. AI 매칭 점수 계산 로직
const calculateMatch = (userStr: string, grant: any) => {
  const userKw = userStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  const targetKw = grant.targets.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
  const matches = userKw.filter(uk => targetKw.some(tk => tk.includes(uk) || uk.includes(tk)));
  
  let baseScore = (grant.id * 7) % 15; 
  let score = matches.length === 0 ? 30 + baseScore : matches.length === 1 ? 75 + baseScore : 90 + (baseScore % 10);
  
  let reason = matches.length > 0 
    ? `AI 분석 결과, 우리 회사 핵심 기술인 '${matches.join(', ')}' 분야와 90% 이상 일치합니다. 전략적 지원을 추천합니다.`
    : `기업 일반 요건은 충족하나, 세부 기술 분야(${grant.targets.split(',')[0]} 등)에 대한 검토가 필요합니다.`;
  
  // API에서 주는 score, reason이 있으면 그대로 씁니다.
  return { 
    score: grant.score || score, 
    reason: grant.reason || reason, 
    matches: matches.length > 0 ? matches : (grant.targets ? grant.targets.split(',').map((s: string) => s.trim()).slice(0, 2) : [])
  };
};

export default function App() {
  // 상태 관리
  const [companyName, setCompanyName] = useState('(주)테스트엔지니어링');
  const [keywords, setKeywords] = useState('로봇, 정밀측정, 인공지능, 제조업');
  const [grants, setGrants] = useState<any[]>(MOCK_GRANTS);
  const [isLoadingRealTime, setIsLoadingRealTime] = useState(false);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showHighMatchOnly, setShowHighMatchOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'all' | 'favorites'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrant, setSelectedGrant] = useState<any | null>(null);
  
  // 북마크 (관심공고) ID 목록
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([2, 4]); // 초기 2개 북마크 지정
  
  // 기업 정보 수정 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState(companyName);
  const [editKeywords, setEditKeywords] = useState(keywords);

  // 컨설팅 신청 모달 상태
  const [isConsultingModalOpen, setIsConsultingModalOpen] = useState(false);
  const [consultingSubmitted, setConsultingSubmitted] = useState(false);
  const [consultingName, setConsultingName] = useState('');
  const [consultingPhone, setConsultingPhone] = useState('');
  const [consultingText, setConsultingText] = useState('');

  // 뉴스레터 성공 상태
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // 실시간 AI 공고 검색 함수
  const fetchRealTimeGrants = async (currentCompany = companyName, currentKeywords = keywords) => {
    setIsLoadingRealTime(true);
    setApiError(null);
    try {
      const response = await fetch("/api/grants/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: currentCompany, keywords: currentKeywords })
      });
      
      if (!response.ok) {
        // GitHub Pages나 정적 호스팅의 경우 404 HTML을 반환할 수 있으므로, json 파싱 전에 컨텐트 타입을 확인합니다.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.error || "실시간 API 호출 실패");
        } else {
          throw new Error(`정적 웹 호스팅 환경(GitHub Pages)이 감지되었습니다. 실시간 AI API(/api/grants/search)를 호출할 수 없으므로 오프라인 최적화 매칭 엔진으로 안전하게 자동 전환되었습니다.`);
        }
      }
      
      const data = await response.json();
      if (data.grants && data.grants.length > 0) {
        setGrants(data.grants);
        setIsRealTimeActive(true);
      } else {
        throw new Error("올바른 공고 형식을 가져오지 못했습니다.");
      }
    } catch (err: any) {
      console.warn("실시간 로드 에러, 데모 모드로 안전하게 전향합니다:", err.message);
      setApiError(err.message);
      // Fallback: 로컬 mock 데이터에 현재 기술 키워드 매칭 점수를 즉석 계산하여 반영
      const processedMock = MOCK_GRANTS.map(g => ({
        ...g,
        ...calculateMatch(currentKeywords, g)
      }));
      setGrants(processedMock);
      setIsRealTimeActive(false);
    } finally {
      setIsLoadingRealTime(false);
    }
  };

  // 마운트 시 실시간 로드
  useEffect(() => {
    fetchRealTimeGrants();
  }, []);

  // 공고 상세 보기 매칭 데이터용 캐시
  const processedGrants = useMemo(() => {
    let results = grants.map(grant => ({ ...grant, ...calculateMatch(keywords, grant) }));
    
    // 탭 필터링
    if (activeTab === 'favorites') {
      results = results.filter(g => bookmarkedIds.includes(g.id));
    }
    
    // 검색 쿼리 필터링
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      results = results.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.agency.toLowerCase().includes(q) || 
        g.targets.toLowerCase().includes(q)
      );
    }

    // 정렬
    if (activeTab === 'match') {
      results.sort((a, b) => b.score - a.score);
    } else {
      results.sort((a, b) => b.id - a.id);
    }

    // 적합도 필터
    if (showHighMatchOnly) {
      results = results.filter(g => g.score >= 80);
    }

    return results;
  }, [grants, keywords, showHighMatchOnly, activeTab, bookmarkedIds, searchQuery]);

  // 전체 대비 높은 적합도 개수 계산
  const highMatchCount = useMemo(() => {
    return grants.map(grant => calculateMatch(keywords, grant)).filter(g => g.score >= 80).length;
  }, [grants, keywords]);

  // 북마크 토글 함수
  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(item => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // 기업 정보 적용
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyName(editCompanyName);
    setKeywords(editKeywords);
    setIsProfileModalOpen(false);
    fetchRealTimeGrants(editCompanyName, editKeywords);
  };  
  // 컨설팅 제출
  const handleConsultingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultingSubmitted(true);
    setTimeout(() => {
      setIsConsultingModalOpen(false);
      setConsultingSubmitted(false);
      setConsultingName('');
      setConsultingPhone('');
      setConsultingText('');
      alert('전문가 매칭 상담 신청이 정상적으로 접수되었습니다. 담당 전문가가 24시간 이내에 연락드리겠습니다.');
    }, 1500);
  };

  // 뉴스레터 구독 제출
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === '') return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
      alert(`구독이 성공적으로 완료되었습니다! 매주 월요일 맞춤 R&D 지원 정보를 ${newsletterEmail}로 보내드립니다.`);
    }, 1200);
  };

  return (
    <div id="home_container" className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. 상단 네비게이션 */}
      <header id="main_header" className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              id="logo_btn"
              onClick={() => { setActiveTab('match'); setSearchQuery(''); setShowHighMatchOnly(false); }} 
              className="flex items-center gap-2 cursor-pointer group transition-transform duration-200 active:scale-95"
            >
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <LayoutDashboard size={20} className="transform group-hover:rotate-6 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-blue-900 font-display">RD-CONNECT</span>
                <span className="text-[9px] text-blue-500/80 tracking-wider font-semibold uppercase -mt-1">R&D Match Hub</span>
              </div>
            </div>
            
            <nav id="navbar" className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <button 
                id="nav_match"
                onClick={() => setActiveTab('match')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'match' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-blue-600 hover:bg-slate-50'}`}
              >
                AI 맞춤추천
              </button>
              <button 
                id="nav_all"
                onClick={() => setActiveTab('all')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'all' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-blue-600 hover:bg-slate-50'}`}
              >
                전체 통합공고
              </button>
              <button 
                id="nav_favorites"
                onClick={() => setActiveTab('favorites')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'favorites' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-blue-600 hover:bg-slate-50'}`}
              >
                관심 공고 목록
              </button>
              <button 
                id="nav_consulting"
                onClick={() => setIsConsultingModalOpen(true)} 
                className="px-4 py-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200"
              >
                전문가 컨설팅
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              id="alert_btn"
              onClick={() => alert('최신 R&D 공고 알림: 3건의 신규 매칭 과제가 등록되었습니다.')}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
            
            {/* 기업 프로필 버튼 */}
            <div 
              id="profile_card_btn"
              onClick={() => {
                setEditCompanyName(companyName);
                setEditKeywords(keywords);
                setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-2.5 bg-slate-50 pl-2 pr-3.5 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 active:scale-95 group shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:bg-blue-700 transition-colors">
                {companyName.substring(1, 2) || 'T'}
              </div>
              <div className="flex flex-col text-left max-w-[130px] sm:max-w-xs">
                <span className="text-xs font-bold text-slate-700 truncate">{companyName}</span>
                <span className="text-[9px] text-blue-500 font-semibold flex items-center gap-0.5">
                  <Settings size={10} className="animate-spin-slow" /> 설정 변경
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* 상단 웰컴 히어로 및 요약 */}
        <section id="hero_section" className="mb-8 bg-linear-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-xs">
                  <Sparkles size={12} className="text-blue-400 animate-pulse" /> 
                  {isRealTimeActive ? "실시간 AI 실무 공고 연동 중" : "지능형 매칭 엔진 작동 중"}
                </span>
                
                <button
                  onClick={() => fetchRealTimeGrants(companyName, keywords)}
                  disabled={isLoadingRealTime}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-2.5 py-1 rounded-full border border-white/20 transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Gemini API를 통해 대한민국 실시간 R&D 지원사업을 검색 및 실시간 매칭 분석을 가져옵니다."
                >
                  <RefreshCw size={10} className={isLoadingRealTime ? "animate-spin" : ""} />
                  {isLoadingRealTime ? "실시간 공고 동기화 중..." : "실시간 AI 공고 탐색"}
                </button>

                {isRealTimeActive && (
                  <span className="bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    실시간 동기화 완료
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl md:text-3.5xl font-black font-display tracking-tight leading-tight">
                안녕하세요, <span className="text-blue-300 underline underline-offset-4 decoration-blue-400">{companyName}</span> 님!
              </h2>
              <p className="text-slate-300 text-sm md:text-base font-medium max-w-2xl">
                설정하신 핵심 기술 키워드 <span className="text-white font-bold underline bg-blue-950/40 px-1.5 py-0.5 rounded border border-white/10">"{keywords}"</span> 기반으로 실시간 R&D 공고 {grants.length}건을 심층 정밀 검증했습니다.
              </p>

              {apiError && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5 text-[11px] text-orange-300 flex items-center gap-1.5 max-w-xl">
                  <Info size={12} className="shrink-0" />
                  <span>Gemini API 키 미연결 상태로, 가상의 R&D 데이터를 키워드에 맞게 실시간 분석 시뮬레이션 중입니다. (비밀키 등록 시 완전 연동 가능)</span>
                </div>
              )}
            </div>
            
            <div className="md:col-span-4 flex justify-end">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-4 w-full md:max-w-xs backdrop-blur-md shadow-inner flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-blue-200 font-semibold mb-1">나의 AI 적합 최우선 과제</p>
                  <p className="text-2.5xl font-extrabold tracking-tight text-white">{highMatchCount}건</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl text-white shadow-lg shadow-blue-500/20">
                  <Trophy size={24} className="animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 왼쪽: 사이드 정보 및 설정 (4개 그리드) */}
          <aside id="aside_panel" className="lg:col-span-4 space-y-6">
            
            {/* 프로필 요약 카드 */}
            <section id="summary_card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-600" /> 기업 현황 대시보드
                </h3>
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-slate-400 hover:text-blue-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
                  title="기업 프로필 설정"
                >
                  <Settings size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div 
                  onClick={() => setActiveTab('match')}
                  className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${activeTab === 'match' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15' : 'bg-blue-50 text-blue-900 border border-blue-100 hover:bg-blue-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeTab === 'match' ? 'bg-white/20 text-white' : 'bg-blue-500 text-white'}`}>
                      <Flame size={18} />
                    </div>
                    <span className="text-sm font-bold">강력 추천 (80점 이상)</span>
                  </div>
                  <span className="text-2xl font-black">{highMatchCount}건</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setActiveTab('favorites')}
                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${activeTab === 'favorites' ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/10' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <p className="text-xs text-slate-500 mb-1 font-semibold">관심 공고 목록</p>
                    <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
                      <Bookmark size={16} className={bookmarkedIds.length > 0 ? "fill-orange-400 text-orange-400" : "text-slate-400"} />
                      {bookmarkedIds.length}건
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => setActiveTab('all')}
                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${activeTab === 'all' ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/10' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <p className="text-xs text-slate-500 mb-1 font-semibold">전체 지원사업</p>
                    <p className="text-xl font-extrabold text-slate-800">{grants.length}건</p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI 매칭 키워드 설정 */}
            <section id="matching_settings_card" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-200/80">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" /> 매칭 조건 필터 설정
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">우리 회사 매칭 키워드</label>
                    <button 
                      onClick={() => setKeywords('로봇, 인공지능, 자율주행, 정밀측정')}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      초기화
                    </button>
                  </div>
                  <textarea 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium min-h-[90px] text-sm"
                    placeholder="예: 로봇, 정밀측정, 인공지능, 공정개선..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                    * 기술 키워드를 콤마(,)로 분류하여 입력하면 AI 적합 매칭 모델 점수가 실시간으로 자동 재계산됩니다.
                  </p>
                </div>
                
                <div className="h-[1px] bg-slate-100"></div>
                
                {/* 적합도 필터 토글 */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800">초고적합 과제만 조회</span>
                    <span className="text-[10px] text-slate-500">AI 매칭 점수 80점 이상</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showHighMatchOnly} 
                      onChange={(e) => setShowHighMatchOnly(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* 전문가 매칭 배너 */}
            <section id="consulting_banner" className="bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 space-y-4">
                <span className="bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block">
                  R&D 기획 코칭
                </span>
                <div>
                  <p className="text-indigo-200 text-xs font-medium mb-1">R&D 정부지원사업계획서 작성이 어려우신가요?</p>
                  <h4 className="text-lg font-bold leading-snug">수자격 전문 기획 컨설턴트 1:1 맞춤형 매칭</h4>
                </div>
                
                <button 
                  onClick={() => setIsConsultingModalOpen(true)}
                  className="flex items-center gap-2 bg-white text-indigo-950 hover:bg-indigo-50 px-4 py-2.5 rounded-xl font-bold text-xs group-hover:gap-3.5 transition-all shadow-md active:scale-95"
                >
                  무료 상담 신청하기 <ArrowRight size={14} className="text-indigo-900" />
                </button>
              </div>
              <PieChart size={120} className="absolute -bottom-4 -right-4 text-indigo-800/25 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            </section>
          </aside>

          {/* 오른쪽: 공고 리스트 영역 (8개 그리드) */}
          <section id="grants_panel" className="lg:col-span-8 space-y-5">
            
            {/* 검색 및 필터 정보 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="사업명, 소관 부처, 또는 타겟 키워드로 검색..." 
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-2 text-sm transition-all focus:outline-hidden"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="text-xs text-slate-400 font-semibold mr-1">정렬:</span>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden">
                  <option>추천 매칭 점수순</option>
                  <option>공고 마감일 임박순</option>
                  <option>정부 지원 예산 높은순</option>
                </select>
              </div>
            </div>

            {/* 현재 보기 상태 요약 */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-800">
                  {activeTab === 'match' && '🤖 AI 추천 적합 사업'}
                  {activeTab === 'all' && '📋 전체 통합 R&D 사업'}
                  {activeTab === 'favorites' && '⭐️ 관심 공고 목록'}
                </h3>
                <span className="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full text-xs">
                  {processedGrants.length}건
                </span>
              </div>
              
              {showHighMatchOnly && (
                <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  80점 이상 필터 적용 중
                </span>
              )}
            </div>

            {/* 공고 카드 목록 */}
            <div className="space-y-4">
              {isLoadingRealTime ? (
                // 3개의 고품격 스켈레톤 카드를 로딩 상태로 출력
                [1, 2, 3].map((idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-2">
                          <div className="h-5 w-24 bg-slate-200 rounded"></div>
                          <div className="h-5 w-16 bg-slate-100 rounded"></div>
                          <div className="h-5 w-20 bg-slate-200 rounded"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                        <div className="h-4 w-5/6 bg-slate-150 rounded"></div>
                      </div>
                      <div className="h-14 w-14 bg-slate-200 rounded-xl"></div>
                    </div>
                    <div className="h-12 bg-slate-50 rounded-xl"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 w-32 bg-slate-150 rounded"></div>
                      <div className="h-5 w-24 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : processedGrants.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200/80 py-20 px-6 text-center shadow-xs">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={32} />
                  </div>
                  <h4 className="text-slate-700 font-bold text-base mb-1">해당 조건에 만족하는 R&D 사업이 없습니다</h4>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    {activeTab === 'favorites' 
                      ? '관심 있는 사업 공고에 북마크(★)를 추가하여 보관해 보세요.' 
                      : '키워드를 변경하시거나 검색 내용을 지워서 다른 과제 공고를 확인해 보세요.'}
                  </p>
                  
                  {(searchQuery || showHighMatchOnly) && (
                    <button 
                      onClick={() => { setSearchQuery(''); setShowHighMatchOnly(false); }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-all active:scale-95"
                    >
                      필터 및 검색 초기화
                    </button>
                  )}
                </div>
              ) : (
                processedGrants.map((grant) => (
                  <div 
                    key={grant.id} 
                    id={`grant_card_${grant.id}`}
                    onClick={() => setSelectedGrant(grant)}
                    className={`group bg-white rounded-2xl border transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden ${grant.score >= 80 ? 'border-blue-100 ring-4 ring-blue-500/5' : 'border-slate-200'}`}
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          
                          {/* 배지 및 부서 정보 */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border border-slate-200/50">
                              {grant.agency}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${grant.type === 'R&D' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                              {grant.type}
                            </span>
                            
                            {/* 최우선 매칭 배지 */}
                            {grant.score >= 85 && (
                              <span className="bg-linear-to-r from-rose-500 to-amber-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs shadow-rose-500/10">
                                <Flame size={11} className="animate-pulse" /> 강력 추천
                              </span>
                            )}
                          </div>
                          
                          {/* 제목 */}
                          <h4 className="text-base md:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                            {grant.title}
                          </h4>
                          
                          {/* 태그 및 부서 */}
                          <div className="flex flex-wrap items-center gap-1">
                            {grant.targets.split(',').map((tag, i) => (
                              <span key={i} className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>

                          {/* 메타 인포 */}
                          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                              <Calendar size={13} className="text-slate-400" />
                              <span className={grant.dDay.includes('-3') ? 'text-red-600 font-bold' : 'font-medium'}>
                                {grant.dDay} ({grant.deadline})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              {grant.budget}
                            </div>
                          </div>

                        </div>

                        {/* 매칭 점수 우측 정렬 */}
                        <div className="text-right shrink-0 flex flex-col items-end justify-between h-full min-h-[90px]">
                          
                          {/* 관심 북마크 토글 */}
                          <button 
                            onClick={(e) => toggleBookmark(grant.id, e)}
                            className="p-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-400 hover:text-orange-500 transition-all active:scale-90"
                            title="관심공고 보관"
                          >
                            <Bookmark 
                              size={18} 
                              className={bookmarkedIds.includes(grant.id) ? "fill-orange-400 text-orange-400" : "text-slate-400"} 
                            />
                          </button>
                          
                          <div className="mt-2 text-right">
                            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">AI 적합도</div>
                            <div className={`text-3.5xl font-black font-display tracking-tight leading-none ${grant.score >= 80 ? 'text-blue-600' : 'text-slate-400'}`}>
                              {grant.score}<span className="text-xs font-bold ml-0.5">점</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* AI 심층 분석 밴드 */}
                    <div className={`px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t ${grant.score >= 80 ? 'bg-blue-50/30 border-blue-100/50' : 'bg-slate-50/60 border-slate-100'}`}>
                      <div className="flex items-start gap-2.5 flex-1">
                        <div className="shrink-0 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-xs">
                          <span className="text-xs">🤖</span>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                          {grant.reason}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 justify-end shrink-0">
                        <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-all shadow-xs">
                          상세 보기 <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* 더 많은 공고 보기 더미 */}
            <button 
              onClick={() => alert('더 많은 R&D 과제를 조회하기 위해서 회원가입 및 전문 컨설팅 세션이 필요합니다. 1:1 상담 서비스를 이용해 주십시오.')}
              className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-2xl text-slate-400 hover:bg-white font-bold transition-all text-sm active:scale-[0.99]"
            >
              R&D 지원사업 전체 목록 추가 로드하기 (20+)
            </button>
          </section>

        </div>
      </main>

      {/* 3. 푸터 영역 */}
      <footer id="main_footer" className="mt-24 bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                <LayoutDashboard size={16} />
              </div>
              <span className="font-extrabold text-slate-800 tracking-tighter text-lg font-display">RD-CONNECT</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              대한민국의 우수 강소중소기업을 위한 지능형 R&D 정보 수집 플랫폼입니다. 실시간 정부 공고와 기업 핵심 역량 기술을 융합 연계하여 추천 서비스를 제공합니다.
            </p>
            <p className="text-[10px] text-slate-400">
              * 본 서비스는 AI 분석 알고리즘이 적용되어 있으므로 실제 공고 요강의 확인이 필수적입니다.
            </p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">주요 서비스</h5>
            <ul className="text-xs text-slate-500 space-y-2.5">
              <li onClick={() => setActiveTab('match')} className="hover:text-blue-600 cursor-pointer transition-colors">AI 실시간 추천 매칭</li>
              <li onClick={() => setActiveTab('all')} className="hover:text-blue-600 cursor-pointer transition-colors">범부처 통합 지원사업</li>
              <li onClick={() => setIsConsultingModalOpen(true)} className="hover:text-blue-600 cursor-pointer transition-colors">R&D 기획 서면 진단</li>
              <li onClick={() => setIsProfileModalOpen(true)} className="hover:text-blue-600 cursor-pointer transition-colors">기업 키워드 최적화</li>
            </ul>
          </div>
          
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">고객지원 & 문의</h5>
            <ul className="text-xs text-slate-500 space-y-2.5">
              <li className="flex items-center gap-2 hover:text-slate-700">
                <Mail size={13} className="text-slate-400" />
                <span>support@rdconnect.kr</span>
              </li>
              <li className="flex items-center gap-2 hover:text-slate-700">
                <Globe size={13} className="text-slate-400" />
                <span>고객센터: 1544-3000 (평일 9-18시)</span>
              </li>
              <li className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">서비스 이용약관</li>
              <li className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">개인정보처리방침</li>
            </ul>
          </div>
          
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">월간 R&D 리포트 구독</h5>
            <p className="text-xs text-slate-500 leading-normal">
              매주 선정 부처별 우수 R&D 핵심 과제 동향 및 트렌드 보고서를 무료로 발송해 드립니다.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="이메일 주소" 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                구독
              </button>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2026 RD-CONNECT Inc. All rights reserved.</p>
          <div className="flex gap-4">
             <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs">서비스 소개</span>
             <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs">파트너 기관</span>
             <span className="text-slate-300 hover:text-slate-500 cursor-pointer text-xs">인재 채용</span>
          </div>
        </div>
      </footer>


      {/* 4. 공고 상세 내용 팝업 모달 */}
      {selectedGrant && (
        <div id="grant_detail_modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 sticky top-0 bg-white z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    {selectedGrant.agency}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    {selectedGrant.type}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                  {selectedGrant.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedGrant(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 모달 바디 */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto text-left">
              
              {/* AI 리포트 분석 요약 */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                    🤖 AI 핵심 일치성 분석 레포트
                  </span>
                  <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-0.5">
                    <span className="text-[10px] font-bold text-slate-400">적합 점수</span>
                    <span className="text-sm font-black text-blue-600">{selectedGrant.score}점</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedGrant.reason}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 mr-1 self-center">우리 기술 연관어:</span>
                  {selectedGrant.matches && selectedGrant.matches.length > 0 ? (
                    selectedGrant.matches.map((kw, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">직접 연관되는 핵심 키워드가 매칭되지 않았습니다.</span>
                  )}
                </div>
              </div>

              {/* 기본 요약 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/30">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">지원 한도 및 총 예산</span>
                  <span className="text-sm font-extrabold text-slate-800">{selectedGrant.budget}</span>
                </div>
                
                <div className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/30">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">신청서 접수 기한</span>
                  <span className="text-sm font-extrabold text-red-600 flex items-center gap-1">
                    {selectedGrant.dDay} <span className="text-slate-500 text-xs">({selectedGrant.deadline})</span>
                  </span>
                </div>
              </div>

              {/* 상세 과제 개요 */}
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 border-l-4 border-blue-600 pl-2">지원 과제 개요</h5>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {selectedGrant.description}
                </p>
              </div>

              {/* 지원 자격 요건 */}
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 border-l-4 border-blue-600 pl-2">신청 및 가점 자격 요건</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedGrant.eligibility}
                </p>
              </div>

              {/* 정부 지원 혜택 */}
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 border-l-4 border-blue-600 pl-2">핵심 혜택 및 수혜 내역</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedGrant.benefit}
                </p>
              </div>

              {/* 평가 선정 일정 */}
              <div className="space-y-2">
                <h5 className="font-bold text-sm text-slate-800 border-l-4 border-blue-600 pl-2">향후 심사 일정 단계</h5>
                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed">
                  {selectedGrant.steps}
                </div>
              </div>

            </div>

            {/* 모달 푸터 */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3 justify-between sticky bottom-0 z-10 bg-white">
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    toggleBookmark(selectedGrant.id, e as any);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Bookmark 
                    size={14} 
                    className={bookmarkedIds.includes(selectedGrant.id) ? "fill-orange-400 text-orange-400" : "text-slate-400"} 
                  />
                  {bookmarkedIds.includes(selectedGrant.id) ? "관심공고 해제" : "관심공고 등록"}
                </button>
                
                <button 
                  onClick={() => alert(`해당 공고 링크가 복사되었습니다. (주변 동료에게 공유 가능)`)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors"
                  title="공유하기"
                >
                  <Share2 size={14} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    setSelectedGrant(null);
                    setIsConsultingModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 text-center"
                >
                  R&D 계획서 전문가 맞춤 컨설팅 신청
                </button>
                
                <button 
                  onClick={() => {
                    alert('공식 범정부 R&D 사이트 포털(IRIS/SMTECH)로 이동을 시뮬레이션합니다.');
                    setSelectedGrant(null);
                  }}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 text-center"
                >
                  공식 공고문 보기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* 5. 기업 정보 / 프로필 수정 모달 */}
      {isProfileModalOpen && (
        <div id="profile_edit_modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col animate-scale-up text-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Settings size={18} className="text-blue-600 animate-spin-slow" /> 기업 맞춤 매칭 프로필 설정
              </h3>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">회사 이름</label>
                <input 
                  type="text" 
                  required
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden transition-all text-slate-700"
                  placeholder="예: (주)테스트엔지니어링"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">회사 핵심 기술 키워드 (쉼표 구분)</label>
                <textarea 
                  required
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden transition-all text-slate-700 min-h-[100px]"
                  placeholder="로봇, 정밀측정, 인공지능, 제조업"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  회사 기술 키워드를 등록하면, AI 정합도 분석 점수가 이 핵심어들을 기반으로 실시간 최적화 계산됩니다.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/10"
                >
                  저장 및 AI 매칭 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 6. 전문가 컨설팅 상담 신청 모달 */}
      {isConsultingModalOpen && (
        <div id="consulting_modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col animate-scale-up text-left">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> R&D 과제 기획 전문가 1:1 신청
              </h3>
              <button 
                onClick={() => setIsConsultingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleConsultingSubmit} className="p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 leading-relaxed mb-1">
                🧑‍🏫 <strong>수강 혜택안내:</strong> 서류 및 사업계획서 대면 합격 이력을 갖춘 국가공인 연구 위원이 <strong>무료 서면 매칭 자문</strong> 1회를 무상 지원해 드립니다.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">신청 기업명</label>
                <input 
                  type="text" 
                  disabled
                  value={companyName}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">담당자 이름</label>
                <input 
                  type="text" 
                  required
                  value={consultingName}
                  onChange={(e) => setConsultingName(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden transition-all text-slate-700"
                  placeholder="예: 홍길동 팀장"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">연락처</label>
                <input 
                  type="tel" 
                  required
                  value={consultingPhone}
                  onChange={(e) => setConsultingPhone(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden transition-all text-slate-700"
                  placeholder="예: 010-1234-5678"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">관심 분야 및 애로사항 (선택)</label>
                <textarea 
                  value={consultingText}
                  onChange={(e) => setConsultingText(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden transition-all text-slate-700 min-h-[80px]"
                  placeholder="예: 7월 IRIS 로봇 국산화 과제 사업계획서 작성 및 공동기관 매칭이 필요합니다."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsConsultingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={consultingSubmitted}
                  className="px-5 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:bg-indigo-400"
                >
                  {consultingSubmitted ? '제출 중...' : '컨설팅 상담 무료 신청'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
