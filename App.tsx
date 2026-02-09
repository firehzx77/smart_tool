
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ResultDisplay from './components/ResultDisplay';
import { CoachingSession, CoachResponse } from './types';
import { getCoachingResponse } from './coachService';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [background, setBackground] = useState('');
  const [originalQuestion, setOriginalQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 引导提示状态
  const [showBgTip, setShowBgTip] = useState(false);
  const [showQnTip, setShowQnTip] = useState(false);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('smart_coach_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('smart_coach_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!background.trim() || !originalQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentSession(null);
    setShowBgTip(false);
    setShowQnTip(false);

    try {
      const response = await getCoachingResponse(background, originalQuestion);
      
      const newSession: CoachingSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        background,
        originalQuestion,
        response
      };

      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
    } catch (err: any) {
      setError(err.message || "在为您提供建议时发生了错误，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setCurrentSession(null);
    setBackground('');
    setOriginalQuestion('');
    setError(null);
    setShowBgTip(false);
    setShowQnTip(false);
  };

  const handleSelectSession = (session: CoachingSession) => {
    setCurrentSession(session);
    setBackground(session.background);
    setOriginalQuestion(session.originalQuestion);
    setError(null);
  };

  const SuggestionBox = ({ title, tips, onClose }: { title: string, tips: string[], onClose: () => void }) => (
    <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859 1.515-1.191 2.273-2.596 2.273-4.141C14.75 5.913 12.625 4 10 4S5.25 5.913 5.25 9c0 1.545.758 2.95 2.273 4.141.269.213.462.519.477.859h4z" />
          </svg>
          {title}
        </h4>
        <button type="button" onClick={onClose} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className="text-xs text-indigo-700 leading-relaxed flex gap-2">
            <span className="shrink-0">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        sessions={sessions} 
        onSelectSession={handleSelectSession} 
        onNewSession={handleNewSession}
        currentSessionId={currentSession?.id}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-2">
             <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="font-bold">SMART 教练</span>
          </div>
          <div className="hidden md:block">
            <h2 className="text-slate-800 font-medium">
              {currentSession ? "会话详情" : "优化您的问题"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Input Form */}
            {!currentSession && (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                <div className="space-y-2 relative">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">背景信息</label>
                    <p className="text-xs text-slate-400">请详细描述您的问题背景、现状或目标。</p>
                  </div>
                  
                  <textarea
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="例如：我们是一家中型 SaaS 公司，最近发现用户留存率下降了 20%..."
                    className="w-full min-h-[140px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                    required
                  />
                  
                  <div className="flex justify-between items-center mt-1 px-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] ${background.length < 30 ? 'text-amber-500 font-medium' : 'text-slate-400'}`}>
                        {background.length < 30 ? '内容较简略' : '内容充足'} ({background.length} 字符)
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowBgTip(!showBgTip)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 py-0.5 px-1.5 bg-indigo-50 rounded border border-indigo-100 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        优化建议
                      </button>
                    </div>
                  </div>

                  {showBgTip && (
                    <SuggestionBox 
                      title="如何写好背景？"
                      tips={[
                        "提供具体的数值（如：留存率下降 20% vs 留存率不高）",
                        "描述目前的‘痛点’和希望达到的‘理想状态’",
                        "提及已尝试过的方案及其效果",
                        "说明受众群体或相关利益方的核心诉求"
                      ]}
                      onClose={() => setShowBgTip(false)}
                    />
                  )}
                </div>

                <div className="space-y-2 relative">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">核心问题</label>
                    <p className="text-xs text-slate-400">您当前最想弄清楚或解决的具体问题是什么？</p>
                  </div>

                  <input
                    type="text"
                    value={originalQuestion}
                    onChange={(e) => setOriginalQuestion(e.target.value)}
                    placeholder="例如：如何提高我们的用户留存率？"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    required
                  />

                  <div className="flex justify-between items-center mt-1 px-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] ${originalQuestion.length > 50 ? 'text-amber-500 font-medium' : 'text-slate-400'}`}>
                        {originalQuestion.length > 50 ? '问题较长' : '字数适中'} ({originalQuestion.length} / 100)
                      </span>
                      <button 
                        type="button"
                        onClick={() => setShowQnTip(!showQnTip)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 py-0.5 px-1.5 bg-indigo-50 rounded border border-indigo-100 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        优化建议
                      </button>
                    </div>
                  </div>

                  {showQnTip && (
                    <SuggestionBox 
                      title="如何精炼核心问题？"
                      tips={[
                        "避免‘是否’类的封闭问题，使用‘如何’、‘什么’开头的开放式提问",
                        "每次只关注一个核心目标，避免问题过于庞杂",
                        "确保问题中包含明确的主体（谁）和动作（做什么）",
                        "尽量排除隐含的假设或结论"
                      ]}
                      onClose={() => setShowQnTip(false)}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      教练正在深度思考中...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      生成 SMART 问题清单
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Loading State Skeleton */}
            {isLoading && !currentSession && (
              <div className="space-y-6">
                <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Display */}
            {currentSession && <ResultDisplay data={currentSession.response} />}

            {/* Empty State Instructions */}
            {!currentSession && !isLoading && !error && (
              <div className="text-center py-12 px-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">欢迎使用 SMART 问题设计教练</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  输入您的背景和核心问题。我将为您提供系统性的建议，并转化为高质量、可执行的问题清单。
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">第一步：背景</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">提供足够的细节，以便 AI 理解您的具体约束和现状。</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">第二步：目标</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">告诉我想解决的具体痛点或想要达成的目标。</p>
                  </div>
                   <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">第三步：优化</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">回顾 SMART 问题，以获得更深刻的洞察和下一步行动指南。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
