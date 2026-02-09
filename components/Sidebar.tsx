
import React from 'react';
import { CoachingSession } from '../types';

interface SidebarProps {
  sessions: CoachingSession[];
  onSelectSession: (session: CoachingSession) => void;
  onNewSession: () => void;
  currentSessionId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, onSelectSession, onNewSession, currentSessionId }) => {
  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          SMART 教练
        </h1>
        <button
          onClick={onNewSession}
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建会话
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">历史记录</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400 px-2 italic">暂无历史记录</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all group ${
                currentSessionId === session.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-sm font-medium line-clamp-1">{session.originalQuestion}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(session.timestamp).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 text-center">由 Gemini 3 Pro 驱动</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
