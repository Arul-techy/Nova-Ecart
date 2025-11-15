'use client';

import React from 'react';

interface GlassCardProps {
  icon?: string;
  title: string;
  description: string;
  imageSrc?: string;
  price?: string;
  badge?: string;
  onClick?: () => void;
}

export default function GlassCard({
  icon = '📦',
  title,
  description,
  imageSrc,
  price,
  badge,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 h-full"
    >
      {/* Background Image */}
      {imageSrc && (
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Glass Effect Container */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-white/40 transition-all duration-300" />

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          {badge}
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col justify-between">
        {/* Icon */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            {title}
          </h3>
          <p className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          {price && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {price}
            </span>
          )}
          <span className="text-blue-400 group-hover:text-purple-400 transition-colors duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
