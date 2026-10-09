import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Lock, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Send, 
  Sparkles, 
  CheckCheck,
  Info
} from 'lucide-react';
import { DriverInfo } from '../types';

interface MaskedCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'call' | 'text';
  driver: DriverInfo;
}

interface ChatMessage {
  id: string;
  sender: 'rider' | 'driver';
  text: string;
  time: string;
}

export const MaskedCommunicationModal: React.FC<MaskedCommunicationModalProps> = ({
  isOpen,
  onClose,
  type,
  driver,
}) => {
  const [activeTab, setActiveTab] = useState<'call' | 'text'>(type);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  
  // Chat state
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Good afternoon! I am en route in the Mercedes EQE (LD73 VLO). Traffic on Piccadilly is clear.',
      time: '15:22',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeTab === 'call' && isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      const connectTimeout = setTimeout(() => {
        setCallStatus('connected');
      }, 1500);

      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimeout);
        clearInterval(timer);
      };
    }
  }, [activeTab, isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'rider',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate smart driver reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Perfect, I see the entrance now. Hazard lights are blinking.",
        "Understood! Pulling up right by the curb in 45 seconds.",
        "Noted! The boot is open for your luggage whenever you're ready.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'driver',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header with Number Masking Explainer */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wide text-blue-200 uppercase">
                  Twilio Masked Proxy Bridge
                </span>
                <h3 className="text-sm font-bold text-white">Encrypted Direct Telephony</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Privacy Demonstration Telemetry Cards */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Your Real Phone</span>
              <span className="text-[11px] font-mono text-slate-100 font-semibold">+44 7891 ***342</span>
              <span className="text-[9px] text-emerald-400 block font-medium">100% Hidden</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40 relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-blue-500 text-[8px] font-bold uppercase">
                Proxy Hub
              </div>
              <span className="text-[10px] text-blue-200 block">Virtual Bridge</span>
              <span className="text-[11px] font-mono text-white font-bold">{driver.phoneMasked}</span>
              <span className="text-[9px] text-blue-300 block">AES-256 Session</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-300 block">Driver Real Phone</span>
              <span className="text-[11px] font-mono text-slate-100 font-semibold">{driver.realPhoneMasked}</span>
              <span className="text-[9px] text-emerald-400 block font-medium">100% Hidden</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'call'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Encrypted Voice Call</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Secure In-App Chat</span>
          </button>
        </div>

        {/* VOICE CALL TAB CONTENT */}
        {activeTab === 'call' && (
          <div className="p-6 flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-slate-50/50 to-white min-h-[380px]">
            {/* Driver Avatar with Audio Pulse Ring */}
            <div className="relative mb-4">
              {callStatus === 'connected' && (
                <div className="absolute inset-0 -m-3 rounded-full border-2 border-blue-400/60 animate-ping" />
              )}
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-white"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white shadow-md">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <h4 className="text-lg font-bold text-slate-900">{driver.name}</h4>
            <p className="text-xs text-slate-500 font-medium">
              {driver.carModel} · {driver.plateNumber}
            </p>

            {/* Call Status & Timer */}
            <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
              <div className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>
                {callStatus === 'connecting'
                  ? 'Establishing secure bridge...'
                  : `Active Call · ${formatTimer(callDuration)}`}
              </span>
            </div>

            {/* Audio Waveform Animation (Simulated VoIP packets) */}
            {callStatus === 'connected' && (
              <div className="flex items-center gap-1.5 my-6 h-8">
                {[12, 28, 16, 32, 24, 14, 26, 18, 30, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-blue-600 rounded-full transition-all duration-300 animate-pulse"
                    style={{
                      height: `${isMuted ? 4 : h}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex items-center gap-5 mt-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isMuted ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle Mute"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-red-600/30 transition-transform"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isSpeaker ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle Speaker"
              >
                {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-6 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Call recording disabled for GDPR compliance
            </p>
          </div>
        )}

        {/* IN-APP TEXT CHAT TAB CONTENT */}
        {activeTab === 'text' && (
          <div className="flex flex-col flex-1 min-h-[380px] bg-slate-50/50">
            {/* Quick Suggestions Strip */}
            <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Quick:</span>
              <button
                onClick={() => handleSendMessage("I am waiting by the main lobby doors.")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
              >
                At main lobby
              </button>
              <button
                onClick={() => handleSendMessage("I have 2 large suitcases.")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
              >
                Have 2 suitcases
              </button>
              <button
                onClick={() => handleSendMessage("Coming down the elevator now!")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-[11px] whitespace-nowrap transition-colors"
              >
                In elevator
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-center my-1">
                <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100">
                  Proxy Bridge Connected · No phone numbers visible
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'rider' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'rider'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'rider' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-100 w-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Composer */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message to your driver..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
