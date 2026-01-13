// File: src/components/gemini/gemini-ai-screen.tsx
'use client';

import React from 'react';
import { Globe, SendHorizontal, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function GeminiAiScreen() {
  const suggestedPrompts = [
    'Have a reminder for connected secretary product page creation with odd chain.',
    'How can hero AI suggestions I vepe..',
    'How can kerietewer fl AI suggestions?',
  ];

  const geminiGradientStyle = {
    background: 'linear-gradient(to right, #3495f0, #5695ed, #7596e8, #9a98f1, #a799f3, #b298eb, #c596dc, #cc94d7, #ce82a2, #d4959c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#101D39] to-[#0D1526]">
      <main className="flex-grow flex flex-col pt-16 pb-24 px-4 overflow-y-auto">
        {/* Gemini Logo */}
        <div className="flex flex-col items-center justify-center pt-8 pb-10 text-center">
          <div className="relative">
            <h1 className="text-7xl font-bold tracking-tight" style={geminiGradientStyle}>
              Gemini AI
            </h1>
            <Sparkles style={{color: '#9c94e9'}} className="w-6 h-6 absolute -top-2.5 left-1/2 -translate-x-[calc(50%+20px)]" />
            <div className="absolute inset-0 -bottom-4 bg-[radial-gradient(ellipse_at_80%_60%,_var(--tw-gradient-stops))] from-pink-500/30 via-purple-500/10 to-transparent rounded-full blur-2xl" />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 rounded-2xl rounded-br-none px-4 py-3 max-w-sm text-white">
              <p>Hecre. Gencterre!!</p>
            </div>
          </div>

          {/* AI Message */}
          <div className="flex justify-start items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0 mt-1">
              <Globe className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="bg-card rounded-2xl rounded-bl-none px-4 py-3 max-w-sm text-white/90">
              <p>
                Have a reminder for connectd secretary producty pagine creato
                with odd cheine.
              </p>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="flex flex-col items-start gap-2 pt-4">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                className="bg-card/70 border border-white/10 text-white/80 rounded-lg px-4 py-2 text-sm text-left w-full max-w-sm hover:bg-card transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow" />
      </main>

      {/* Message Input */}
      <footer className="fixed bottom-20 left-0 right-0 px-4 py-2 bg-gradient-to-t from-[#0D1526] to-transparent">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            className="w-full bg-card border-none rounded-full pl-4 pr-12 h-12 text-white placeholder:text-muted-foreground"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9"
          >
            <SendHorizontal className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
