'use client';

import React, { useState } from 'react';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface GlassFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  submitButtonText?: string;
  onSubmit: (data: Record<string, string>) => void;
  socialLogin?: boolean;
}

export default function GlassForm({
  title,
  description,
  fields,
  submitButtonText = 'Submit',
  onSubmit,
  socialLogin = false,
}: GlassFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      {/* Form Container */}
      <div className="w-full max-w-md relative">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl" />

        {/* Content */}
        <div className="relative p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            {description && (
              <p className="text-gray-200 text-sm">{description}</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.name} className="relative">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    rows={4}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      focused === field.name ? 'border-blue-400/50 bg-white/20' : 'border-white/20'
                    }`}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-md border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                      focused === field.name ? 'border-blue-400/50 bg-white/20' : 'border-white/20'
                    }`}
                  />
                )}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 mt-8"
            >
              {submitButtonText}
            </button>
          </form>

          {/* Social Login */}
          {socialLogin && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white font-semibold">
                  Google
                </button>
                <button className="py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 text-white font-semibold">
                  GitHub
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
