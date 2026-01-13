
import React, { useState, useCallback } from 'react';
import { AppState, AssessmentResult } from './types';
import { analyzeBehavioralData } from './services/geminiService';
import { 
  Compass, 
  BrainCircuit, 
  ChevronRight, 
  Activity, 
  Target, 
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { 
  EmotionPieChart, 
  SentimentTrendChart, 
  StressIndicator 
} from './components/Charts';
import { EthicsNotice } from './components/EthicsNotice';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>(AppState.LANDING);
  const [inputText, setInputText] = useState('');
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartDemo = () => setView(AppState.INPUT);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please provide some text for analysis.");
      return;
    }
    if (!consent) {
      setError("You must consent to the analysis to proceed.");
      return;
    }

    setView(AppState.LOADING);
    setError(null);

    try {
      const analysis = await analyzeBehavioralData(inputText);
      setResult(analysis);
      setView(AppState.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please try again later.");
      setView(AppState.INPUT);
    }
  };

  const Landing = () => (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-200">
          <BrainCircuit className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        MindPath <span className="text-indigo-600">AI</span>
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Unlock your true potential. We use ethical AI to translate your behavioral patterns 
        into personalized career roadmaps and well-being insights.
      </p>
      <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
        {[
          { icon: Activity, title: "Behavioral Well-being", desc: "Understand your stress indices and emotional resilience through your writing style." },
          { icon: Compass, title: "Career Navigation", desc: "Discover high-alignment career domains based on your interests and personality markers." },
          { icon: Lock, title: "Privacy First", desc: "Consent-based, anonymized analysis with a strict non-medical classification policy." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <item.icon className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={handleStartDemo}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-indigo-200 transition-all flex items-center mx-auto"
      >
        Try Demo Now <ChevronRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );

  const InputView = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => setView(AppState.LANDING)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
      </button>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Behavioral Assessment</h2>
        <p className="text-slate-500 mb-8">Paste your social media posts, blog snippets, or journal entries to begin analysis.</p>
        
        <textarea
          className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none text-slate-700"
          placeholder="I spent the whole day working on my new app today. I'm feeling a bit overwhelmed but the progress is exciting..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        {error && (
          <div className="mt-4 flex items-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <label className="flex items-start cursor-pointer group">
            <input 
              type="checkbox" 
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" 
            />
            <span className="ml-3 text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">
              I consent to the anonymized analysis of this text for behavioral insights and career guidance purposes. 
              I understand this system does not provide medical or psychological diagnosis.
            </span>
          </label>
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50"
            disabled={!consent || !inputText.trim()}
          >
            Run Behavioral Engine
          </button>
        </div>
      </div>

      <EthicsNotice />
    </div>
  );

  const DashboardView = () => {
    if (!result) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Analysis Dashboard</h1>
            <p className="text-slate-500">Comprehensive behavioral and career outlook</p>
          </div>
          <button 
            onClick={() => setView(AppState.INPUT)}
            className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Start New Assessment
          </button>
        </div>

        {/* Top Stats Row */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StressIndicator value={result.stressIndex} />
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
             <div className="text-5xl font-bold text-indigo-600 mb-2">{result.engagementScore}%</div>
             <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Engagement</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
             <div className="text-5xl font-bold text-teal-500 mb-2">{result.emotionalResilience}%</div>
             <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Resilience</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-3">Interest Clusters</div>
             <div className="flex flex-wrap gap-2">
               {result.interestClusters.map((c, i) => (
                 <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                   {c}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <MessageSquare className="mr-2 text-indigo-500" /> Emotional Distribution
            </h3>
            <EmotionPieChart data={result.emotions} />
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Activity className="mr-2 text-indigo-500" /> Sentiment Trend Analysis
            </h3>
            <SentimentTrendChart data={result.trends} />
          </div>
        </div>

        {/* Career Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
            <Target className="mr-3 text-indigo-600" /> Career Guidance & Roadmaps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {result.careerGuidance.map((career, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="bg-indigo-600 p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-indigo-100">Recommended Domain</span>
                    <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">{career.matchScore}% Match</span>
                  </div>
                  <h4 className="text-2xl font-bold">{career.domain}</h4>
                </div>
                <div className="p-6 flex-grow">
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed italic">"{career.reason}"</p>
                  
                  <div className="mb-6">
                    <h5 className="font-bold text-slate-900 text-sm uppercase mb-3 border-b pb-2">Key Skills Needed</h5>
                    <div className="flex flex-wrap gap-2">
                      {career.keySkills.map((skill, si) => (
                        <span key={si} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 text-sm uppercase mb-3 border-b pb-2">Learning Roadmap</h5>
                    <ul className="space-y-3">
                      {career.roadmap.map((step, ri) => (
                        <li key={ri} className="flex items-start text-xs text-slate-600">
                          <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 font-bold">
                            {ri + 1}
                          </div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Section */}
        <div className="bg-slate-900 text-white p-10 rounded-3xl mb-12 shadow-xl shadow-slate-200">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <BrainCircuit className="mr-3 text-indigo-400" /> Explainable AI Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-300 mb-8 leading-relaxed">
                {result.explainability.summary}
              </p>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Algorithm Confidence Markers</p>
                <div className="space-y-4">
                  {result.explainability.featureImportance.map((feat, fi) => (
                    <div key={fi}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{feat.feature}</span>
                        <span>{feat.weight}% influence</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full" style={{ width: `${feat.weight}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center border-l border-white/10 pl-12 hidden md:flex">
              <div className="p-8 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <h4 className="font-bold text-xl mb-4 text-indigo-300">Hackathon Focus</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  MindPath AI prioritizes transparency. Every recommendation is traced back to text feature importance, 
                  ensuring users understand "the why" behind their roadmap. This build utilizes semantic analysis and 
                  contextual embedding to prevent biased classifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingView = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-ping opacity-25" />
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin absolute top-6 left-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-2">Analyzing Behavioral Patterns</h2>
      <p className="text-slate-500 animate-pulse">Running semantic clustering and sentiment models...</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(AppState.LANDING)}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">MindPath</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Ethics</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <button 
              onClick={handleStartDemo}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-all"
            >
              Demo
            </button>
          </div>
        </div>
      </nav>

      <main>
        {view === AppState.LANDING && <Landing />}
        {view === AppState.INPUT && <InputView />}
        {view === AppState.LOADING && <LoadingView />}
        {view === AppState.DASHBOARD && <DashboardView />}
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900">MindPath AI</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 MindPath AI. Empowering career growth through behavioral intelligence.
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-xs text-slate-400 font-medium">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Ethical AI Charter</a>
            <a href="#" className="hover:text-slate-600">Contact Mentors</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
