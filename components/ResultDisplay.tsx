
import React from 'react';
import { CoachResponse } from '../types';

interface ResultDisplayProps {
  data: CoachResponse;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const { summary, smartQuestions, critique } = data;

  const DimensionCard = ({ title, questions, icon, color }: { title: string, questions: string[], icon: string, color: string }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className={`p-2 rounded-lg ${color} text-white font-bold`}>
          <i className="not-italic">{icon}</i>
        </span>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <ul className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="flex gap-3 text-slate-600 leading-relaxed">
            <span className="text-indigo-500 font-bold">•</span>
            {q}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary */}
      <section>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-sm">
          <h2 className="text-indigo-900 font-bold mb-2 flex items-center gap-2 uppercase tracking-wide text-sm">
            教练对背景的理解
          </h2>
          <p className="text-indigo-800 leading-relaxed">{summary}</p>
        </div>
      </section>

      {/* SMART Dimensions */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          SMART 问题清单
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DimensionCard 
            title="Specific (具体)" 
            questions={smartQuestions.specific} 
            icon="S" 
            color="bg-blue-500" 
          />
          <DimensionCard 
            title="Measurable (可衡量)" 
            questions={smartQuestions.measurable} 
            icon="M" 
            color="bg-emerald-500" 
          />
          <DimensionCard 
            title="Action-oriented (行动导向)" 
            questions={smartQuestions.actionOriented} 
            icon="A" 
            color="bg-orange-500" 
          />
          <DimensionCard 
            title="Relevant (相关性)" 
            questions={smartQuestions.relevant} 
            icon="R" 
            color="bg-purple-500" 
          />
          <DimensionCard 
            title="Time-bound (时效性)" 
            questions={smartQuestions.timeBound} 
            icon="T" 
            color="bg-rose-500" 
          />
        </div>
      </section>

      {/* Analysis Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          分析与改进建议
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Shortcomings */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              原始问题的不足之处
            </h3>
            <ul className="space-y-2">
              {critique.shortcomings.map((s, i) => (
                <li key={i} className="text-red-700 text-sm flex gap-2">
                  <span>-</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Question */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
            <h3 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              最关键的核心问题
            </h3>
            <p className="text-slate-800 font-semibold mb-2">{critique.criticalQuestion.question}</p>
            <p className="text-slate-600 text-sm leading-relaxed italic border-l-2 border-amber-300 pl-4">
              {critique.criticalQuestion.reasoning}
            </p>
          </div>

          {/* Negative Example */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6">
            <h3 className="text-slate-700 font-bold mb-3 flex items-center gap-2">
               <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              应当避免的问题反例
            </h3>
            <p className="text-slate-500 line-through mb-2">{critique.negativeExample.question}</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              <span className="font-semibold">避坑理由：</span> {critique.negativeExample.reasoning}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultDisplay;
