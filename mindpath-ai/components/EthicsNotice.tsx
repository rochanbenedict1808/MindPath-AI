
import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const EthicsNotice: React.FC = () => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <ShieldCheck className="h-6 w-6 text-blue-600" />
      </div>
      <div className="ml-4">
        <h3 className="text-blue-900 font-bold text-lg">Ethical AI & Privacy Disclaimer</h3>
        <div className="mt-2 text-blue-800 text-sm space-y-2">
          <p>
            • <strong>Non-Medical Disclaimer:</strong> This system is an AI analysis tool and does NOT provide medical, clinical, or psychological diagnoses. Insights are for informational purposes only.
          </p>
          <p>
            • <strong>Privacy & Consent:</strong> All analysis is based on text you voluntarily provide. Data is processed in-memory and not stored persistently unless explicitly saved by you.
          </p>
          <p>
            • <strong>Explainable AI:</strong> Recommendations are derived from sentiment patterns and interest clustering. Feature importance metrics are provided to explain algorithmic reasoning.
          </p>
        </div>
      </div>
    </div>
  </div>
);
