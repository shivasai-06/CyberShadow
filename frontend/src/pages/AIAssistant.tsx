import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Send, ShieldAlert, Cpu, CheckCircle2, XCircle, MessageSquare, Plus, Trash2, Clock, Lock, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { aiApi } from '../services/aiApi';
import type { AssistantMessage } from '../types/ai';
import { useCyberShadow } from '../contexts/CyberShadowContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../contexts/AuthContext';
import { aiConversationsApi, type AIConversation } from '../services/aiConversations';

export function AIAssistant() {
  const { user } = useAuth();
  const { 
    history, 
    securityControls, 
    settings, 
    learningProfile, 
    securityLearningImpacts,
    remediations,
    effectivenessComparisons 
  } = useCyberShadow();
  const dashboardData = useDashboardData();
  
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadConversations = async () => {
    setConversationsLoading(true);
    try {
      const data = await aiConversationsApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setTimeout(() => {
        setConversations([]);
        setCurrentConversationId(null);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectConversation = async (id: string) => {
    if (id === currentConversationId) return;
    
    setLoading(true);
    try {
      const conv = await aiConversationsApi.getConversation(id);
      if (conv) {
        setCurrentConversationId(id);
        setMessages(conv.messages);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load conversation history.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setError(null);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await aiConversationsApi.deleteConversation(id);
      if (currentConversationId === id) {
        handleNewConversation();
      }
      loadConversations();
    } catch (err) {
      console.error(err);
      setError("Failed to delete conversation.");
    }
  };

  const hasSimulations = history.length > 0;
  const hasFindings = dashboardData.metrics.totalFindings > 0;
  const hasRemediations = remediations.length > 0;

  const getAssistantContext = () => {
    return {
      digitalTwin: {
        controls: securityControls,
        settings: settings
      },
      latestSimulation: hasSimulations ? history[0] : null,
      recentHistory: history.slice(0, 5),
      securityPosture: {
        trend: dashboardData.securityStatus.trend,
        coverage: dashboardData.securityStatus.coveragePercent,
        metrics: dashboardData.metrics
      },
      remediations: {
        open: remediations.filter(r => r.status === 'OPEN'),
        inProgress: remediations.filter(r => r.status === 'IN_PROGRESS'),
        validated: effectivenessComparisons
      },
      learning: {
        profile: learningProfile,
        impacts: securityLearningImpacts
      }
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    
    const userMsgContent = inputValue.trim();
    const userMessage: AssistantMessage = {
      role: 'user',
      content: userMsgContent,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);
    setError(null);
    
    let activeConvId = currentConversationId;
    
    try {
      if (user && !activeConvId) {
        // Create conversation first if authenticated
        const title = userMsgContent.length > 40 ? userMsgContent.substring(0, 40) + '...' : userMsgContent;
        const newConv = await aiConversationsApi.createConversation(title);
        if (newConv) {
          activeConvId = newConv.id;
          setCurrentConversationId(newConv.id);
          setConversations([newConv, ...conversations]);
        }
      }
      
      if (user && activeConvId) {
        await aiConversationsApi.addMessage(activeConvId, userMessage);
      }
      
      const response = await aiApi.sendMessage({
        messages: newMessages.slice(-20), // Send last 20 messages to keep context bounded
        context: getAssistantContext(),
      });
      
      if (response.success && response.message) {
        setMessages(prev => [...prev, response.message!]);
        if (user && activeConvId) {
          await aiConversationsApi.addMessage(activeConvId, response.message!);
        }
      } else {
        setError(response.error || 'AI Assistant is temporarily unavailable. Your CyberShadow simulation data remains available.');
      }
    } catch {
      setError('AI Assistant is temporarily unavailable. Your CyberShadow simulation data remains available.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide mb-1 flex items-center gap-3">
            <Brain className="text-purple-400" />
            AI SECURITY ASSISTANT
          </h1>
          <p className="text-slate-400 text-sm">Ask about your simulations or explore general topics.</p>
        </div>
        
        {/* Context Indicator */}
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-lg p-3 hidden md:block text-xs">
          <div className="font-bold text-slate-400 uppercase tracking-widest mb-2 text-[10px]">Security Context</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              {hasSimulations ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-600" />}
              <span className={hasSimulations ? "text-slate-300" : "text-slate-500"}>Latest Simulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasFindings ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-600" />}
              <span className={hasFindings ? "text-slate-300" : "text-slate-500"}>Security Findings</span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasRemediations ? <CheckCircle2 size={12} className="text-emerald-500" /> : <XCircle size={12} className="text-slate-600" />}
              <span className={hasRemediations ? "text-slate-300" : "text-slate-500"}>Remediation Data</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden hidden md:flex">
          <div className="p-4 border-b border-slate-800/80">
            <Button 
              onClick={handleNewConversation}
              className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border-purple-500/30"
            >
              <Plus size={16} className="mr-2" /> NEW CHAT
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {!user ? (
              <div className="p-4 text-center">
                <Lock size={24} className="mx-auto mb-2 text-slate-500" />
                <p className="text-xs text-slate-400 mb-3">Sign in to save and access your conversation history.</p>
                <Link to="/login" className="inline-block px-4 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded text-xs transition-colors">
                  Sign In
                </Link>
              </div>
            ) : conversationsLoading ? (
              <div className="p-4 text-center text-xs text-slate-400">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center">
                <MessageSquare size={24} className="mx-auto mb-2 text-slate-600" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Saved Conversations</p>
                <p className="text-[10px] text-slate-400 mt-2">Start chatting to automatically save your history.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map(conv => (
                  <div 
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`group cursor-pointer rounded p-3 text-sm flex items-start justify-between gap-2 transition-colors ${
                      currentConversationId === conv.id 
                        ? 'bg-purple-500/20 border border-purple-500/30 text-purple-200' 
                        : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate mb-1">{conv.title}</div>
                      <div className="text-[10px] flex items-center gap-1 opacity-60">
                        <Clock size={10} />
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0b1120] border border-slate-800/80 rounded-lg overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 max-w-lg mx-auto">
                <Cpu size={48} className="text-purple-500/50 mb-6" />
                <h2 className="text-lg font-bold text-slate-300 uppercase tracking-widest mb-4">AI SECURITY ASSISTANT</h2>
                <p className="text-sm mb-2 leading-relaxed">
                  Ask about your simulated attacks, security findings, or any general topics.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-8">
                  <Zap size={10} className="text-purple-400" />
                  <span>Powered by Gemini Flash</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                  {hasSimulations ? [
                    "Explain my latest simulation.",
                    "Why did the attack succeed?",
                    "Which weakness should I fix first?",
                    "What defense would have helped?",
                    "What should I practice next?"
                  ].map((suggestion, i) => (
                    <button 
                      key={i}
                      className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-slate-800 transition-colors text-xs text-slate-300"
                      onClick={() => setInputValue(suggestion)}
                    >
                      "{suggestion}"
                    </button>
                  )) : [
                    "What can CyberShadow analyze?",
                    "Explain how simulation works.",
                    "What security controls can I test?",
                    "How do I start a simulation?"
                  ].map((suggestion, i) => (
                    <button 
                      key={i}
                      className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-purple-500/50 hover:bg-slate-800 transition-colors text-xs text-slate-300"
                      onClick={() => setInputValue(suggestion)}
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-4 ${
                      msg.role === 'user' 
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100' 
                        : 'bg-slate-900/80 border border-slate-800 text-slate-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === 'assistant' && <Brain size={14} className="text-purple-400" />}
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                          {msg.role === 'user' ? 'You' : 'CyberShadow AI'}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg p-4 bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <Brain size={16} className="text-purple-400 animate-pulse" />
                        <span className="text-xs text-purple-400/80 font-bold uppercase tracking-widest animate-pulse">
                          CYBERSHADOW AI IS ANALYZING...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg p-4 bg-red-950/20 border border-red-900/30">
                      <div className="flex items-center gap-2 text-red-400">
                        <ShieldAlert size={16} />
                        <span className="text-xs font-bold">{error}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800/80">
            <div className="flex gap-4">
              <textarea
                className="flex-1 bg-[#060a14] border border-slate-800 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500/50 resize-none min-h-[50px] max-h-[150px]"
                placeholder="Ask about anything, or explore your CyberShadow simulation..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={2}
                aria-label="Message CyberShadow AI"
              />
              <Button 
                onClick={handleSend} 
                disabled={!inputValue.trim() || loading}
                className="px-6 h-[50px] bg-purple-600 hover:bg-purple-500 text-white border-transparent"
              >
                <Send size={18} className="mr-2" /> SEND
              </Button>
            </div>
            <div className="mt-2 text-[10px] flex items-center justify-center gap-2 text-slate-500">
              <ShieldAlert size={10} />
              Simulation and general analysis.
              <span className="text-slate-600">·</span>
              <Zap size={9} className="text-purple-400/60" />
              <span className="text-slate-500/80">Gemini Flash</span>
              {!user && (
                <span className="text-amber-500 ml-2">
                  (<Link to="/login" className="underline hover:text-amber-400">Sign in</Link> to save history)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
