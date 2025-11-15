'use client';

import React from 'react';

interface DashboardPanelProps {
  title: string;
  value?: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  children?: React.ReactNode;
}

export default function GlassDashboardPanel({
  title,
  value,
  icon = '📊',
  trend,
  trendValue,
  children,
}: DashboardPanelProps) {
  const trendColor = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  }[trend || 'neutral'];

  const trendIcon = {
    up: '↗',
    down: '↘',
    neutral: '→',
  }[trend || 'neutral'];

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 h-full">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-white/40 transition-all duration-300" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 pointer-events-none" />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-3xl">{icon}</div>
          {trend && (
            <span className={`text-sm font-semibold ${trendColor}`}>
              {trendIcon} {trendValue}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-gray-300 text-sm font-medium mb-3 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>

        {/* Value or Children */}
        {value !== undefined ? (
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
              {value}
            </p>
          </div>
        ) : (
          <div className="text-white">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

interface GlassDashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  sidebarItems?: Array<{ label: string; icon: string; active?: boolean; onClick?: () => void }>;
}

export function GlassDashboardLayout({
  title,
  children,
  sidebarItems = [],
}: GlassDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        {sidebarItems.length > 0 && (
          <div className="w-64 hidden md:block border-r border-white/10">
            <div className="fixed w-64 h-screen pt-20 p-4 space-y-2">
              {sidebarItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                    item.active
                      ? 'bg-white/20 border border-white/30 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
