import React from 'react';
import { Mail } from 'lucide-react';

export const MailboxEmptyState: React.FC = () => {
  return (
    <div className="bg-[#161b22] rounded-lg border border-white/10 h-full flex items-center justify-center">
      <div className="text-center text-slate-500 max-w-md">
        <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-slate-400 mb-2">Wybierz wiadomość</h3>
        <p className="text-sm text-slate-500">
          Kliknij na wiadomość po lewej stronie, aby zobaczyć jej szczegóły
        </p>
      </div>
    </div>
  );
};
