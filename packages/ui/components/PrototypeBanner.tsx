import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function PrototypeBanner() {
  return (
    <div
      role="alert"
      className="w-full bg-amber-500 text-slate-950 font-medium text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-2 border-b border-amber-600 shadow-sm sticky top-0 z-50"
    >
      <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" aria-hidden="true" />
      <span>
        <strong>Student prototype.</strong> Not the real GoodHand store. Do not enter real personal or payment details.
      </span>
    </div>
  );
}
