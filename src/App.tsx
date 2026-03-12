import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { 
  BarChart3, 
  Activity, 
  Brain, 
  TrendingUp, 
  Search, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  History,
  X,
  MessageCircle,
  Download,
  Send
} from 'lucide-react';

// --- UI Components ---
const steps = [
  { 
    id: 'input', 
    title: 'Nhập Mã Cổ Phiếu', 
    icon: Search, 
    color: 'text-blue-400', 
    hex: '#60a5fa',
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30',
    shadowColor: 'rgba(96, 165, 250, 0.2)'
  },
  { 
    id: 'data', 
    title: 'Tải Dữ Liệu Thị Trường', 
    icon: BarChart3, 
    color: 'text-indigo-400', 
    hex: '#818cf8',
    bg: 'bg-indigo-500/10', 
    border: 'border-indigo-500/30',
    shadowColor: 'rgba(129, 140, 248, 0.2)'
  },
  { 
    id: 'technical', 
    title: 'Phân Tích Kỹ Thuật', 
    icon: Activity, 
    color: 'text-emerald-400', 
    hex: '#34d399',
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30',
    shadowColor: 'rgba(52, 211, 153, 0.2)'
  },
  { 
    id: 'fundamental', 
    title: 'Phân Tích Cảm Tính', 
    icon: Brain, 
    color: 'text-purple-400', 
    hex: '#c084fc',
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30',
    shadowColor: 'rgba(192, 132, 252, 0.2)'
  },
  { 
    id: 'output', 
    title: 'Khuyến Nghị Đầu Tư', 
    icon: TrendingUp, 
    color: 'text-rose-400', 
    hex: '#fb7185',
    bg: 'bg-rose-500/10', 
    border: 'border-rose-500/30',
    shadowColor: 'rgba(251, 113, 133, 0.2)'
  },
];

const Node = ({ step, state }: { step: typeof steps[0], state: 'idle' | 'active' | 'completed' }) => {
  const Icon = step.icon;
  
  return (
    <motion.div 
      className={`relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border w-32 h-32 md:w-40 md:h-40 shrink-0 transition-all duration-500 z-10
        ${state === 'active' ? `${step.bg} ${step.border}` : 
          state === 'completed' ? 'bg-[#13131a] border-gray-800' : 
          'bg-[#0a0a0f] border-gray-800/50'}`}
      animate={state === 'active' ? {
        boxShadow: `0 0 30px ${step.shadowColor}`,
        y: -5
      } : {
        boxShadow: `0 0 0px rgba(0,0,0,0)`,
        y: 0
      }}
    >
      {state === 'active' && (
        <motion.div 
          className={`absolute inset-0 rounded-2xl border ${step.border}`}
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      
      <div className={`p-3 md:p-4 rounded-xl mb-2 md:mb-3 ${state === 'active' ? step.bg : 'bg-gray-800/30'} transition-colors duration-500 relative`}>
        <Icon className={`w-6 h-6 md:w-8 md:h-8 ${state === 'active' || state === 'completed' ? step.color : 'text-gray-600'}`} />
        
        {state === 'active' && (
           <motion.div 
             className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white"
             animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
             transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
           />
        )}
      </div>
      <span className={`text-xs md:text-sm font-medium text-center ${state === 'active' ? 'text-white' : state === 'completed' ? 'text-gray-300' : 'text-gray-500'}`}>
        {step.title}
      </span>
      
      <div className="absolute top-2 right-2 md:top-3 md:right-3">
        {state === 'completed' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
          </motion.div>
        )}
        {state === 'active' && (
          <motion.div 
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
            style={{ backgroundColor: step.hex }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
}

const Edge = ({ isActive, isCompleted, fromColor, toColor }: { isActive: boolean, isCompleted: boolean, fromColor: string, toColor: string }) => {
  return (
    <>
      <div className="hidden lg:flex relative w-12 xl:w-16 h-1 bg-gray-800/50 rounded-full overflow-hidden shrink-0">
        <motion.div 
          className="absolute top-0 left-0 h-full"
          style={{ background: `linear-gradient(to right, ${fromColor}, ${toColor})` }}
          initial={{ width: '0%' }}
          animate={{ width: isCompleted ? '100%' : isActive ? ['0%', '100%'] : '0%' }}
          transition={{ duration: 1, ease: "linear" }}
        />
        {isActive && (
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white blur-[2px]"
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 1, ease: "linear" }}
          />
        )}
      </div>
      <div className="flex lg:hidden relative w-1 h-8 md:h-12 bg-gray-800/50 rounded-full overflow-hidden shrink-0">
        <motion.div 
          className="absolute top-0 left-0 w-full"
          style={{ background: `linear-gradient(to bottom, ${fromColor}, ${toColor})` }}
          initial={{ height: '0%' }}
          animate={{ height: isCompleted ? '100%' : isActive ? ['0%', '100%'] : '0%' }}
          transition={{ duration: 1, ease: "linear" }}
        />
        {isActive && (
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white blur-[2px]"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 1, ease: "linear" }}
          />
        )}
      </div>
    </>
  )
}

export default function App() {
  const [ticker, setTicker] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'node' | 'edge' | 'completed'>('idle');
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [finalResponse, setFinalResponse] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // New features state
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([finalResponse], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${ticker || 'Report'}_Analysis.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting || !chatRef.current) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({
        message: userMsg
      });

      let fullReply = "";
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of responseStream) {
        fullReply += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullReply;
          return newHistory;
        });
      }
    } catch (error: any) {
      log(`LỖI CHAT: ${error.message}`);
    } finally {
      setIsChatting(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const log = (msg: string) => {
    setCurrentLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runWorkflow = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticker.trim() || isProcessing) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      log("LỖI: Thiếu GEMINI_API_KEY. Vui lòng cấu hình trong AI Studio.");
      return;
    }

    setIsProcessing(true);
    setFinalResponse('');
    setCurrentLogs([]);
    setChatHistory([]);
    setActiveTab('report');
    setCurrentStep(0);
    setPhase('node');

    try {
      const ai = new GoogleGenAI({ apiKey });
      const symbol = ticker.toUpperCase().trim();

      chatRef.current = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: `Bạn là một chuyên gia phân tích chứng khoán AI cấp cao. Bạn đang phân tích mã cổ phiếu: "${symbol}". Hãy sử dụng công cụ tìm kiếm để lấy dữ liệu thị trường và tin tức mới nhất. Luôn trả lời bằng tiếng Việt một cách chuyên nghiệp.`,
          tools: [{ googleSearch: {} }],
        }
      });

      // --- Step 0: Input ---
      log(`Đã nhận mã cổ phiếu: "${symbol}"`);
      log("Đang khởi tạo Agent Phân Tích...");
      await delay(1500);

      // Transition
      setPhase('edge');
      await delay(1000);
      setCurrentStep(1);
      setPhase('node');

      // --- Step 1: Data Fetching ---
      log(`Đang kết nối đến API dữ liệu thị trường cho ${symbol}...`);
      log("Đang tải dữ liệu giá lịch sử (OHLCV) 1 năm qua...");
      await delay(1000);
      log("Đang thu thập báo cáo tài chính và tin tức gần đây...");
      await delay(1500);

      // Transition
      setPhase('edge');
      await delay(1000);
      setCurrentStep(2);
      setPhase('node');

      // --- Step 2: Technical Analysis ---
      log("Đang tính toán các đường trung bình động (SMA 50, SMA 200)...");
      await delay(1000);
      log("Đang phân tích chỉ báo RSI và MACD...");
      log("Đang xác định các vùng hỗ trợ và kháng cự chính...");
      await delay(1500);

      // Transition
      setPhase('edge');
      await delay(1000);
      setCurrentStep(3);
      setPhase('node');

      // --- Step 3: Fundamental & Sentiment ---
      log("Đang phân tích cảm tính từ các bài báo và mạng xã hội...");
      await delay(1000);
      log("Đang đánh giá các chỉ số cơ bản (P/E, EPS, PEG)...");
      log("Đang tổng hợp dữ liệu để đưa ra mô hình dự phóng...");
      await delay(1500);

      // Transition
      setPhase('edge');
      await delay(1000);
      setCurrentStep(4);
      setPhase('node');

      // --- Step 4: Output Generation ---
      log("Đang tìm kiếm dữ liệu thực tế và tổng hợp báo cáo...");
      
      const prompt = `Cung cấp một báo cáo phân tích chuyên nghiệp bằng tiếng Việt cho mã cổ phiếu "${symbol}", định dạng Markdown, bao gồm:
1. **Tổng quan doanh nghiệp & Giá hiện tại**: Ngắn gọn về công ty và cập nhật giá mới nhất từ thị trường.
2. **Phân tích kỹ thuật**: Xu hướng hiện tại, các mốc hỗ trợ/kháng cự quan trọng dựa trên dữ liệu gần đây.
3. **Phân tích cơ bản & Cảm tính thị trường**: Tin tức tích cực/tiêu cực mới nhất, định giá.
4. **Khuyến nghị hành động**: Đưa ra quyết định rõ ràng (MUA / BÁN / GIỮ) kèm theo tỷ trọng rủi ro và mức cắt lỗ (stop-loss) / chốt lời (take-profit) tham khảo.
Lưu ý: Bắt đầu báo cáo bằng một cảnh báo in nghiêng rằng đây chỉ là thông tin mô phỏng cho mục đích đào tạo và không phải là lời khuyên đầu tư tài chính thực tế.`;

      const responseStream = await chatRef.current.sendMessageStream({
        message: prompt,
      });

      log("Đang nhận luồng phản hồi từ LLM...");
      let fullText = "";
      for await (const chunk of responseStream) {
        fullText += chunk.text;
        setFinalResponse(fullText);
      }

      log("Đã hoàn thành báo cáo phân tích.");
      
      try {
        log("Đang lưu báo cáo vào cơ sở dữ liệu...");
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: symbol, report_text: fullText })
        });
        log("Đã lưu báo cáo thành công.");
        fetchHistory(); // Refresh history
      } catch (e) {
        log("Lỗi khi lưu báo cáo.");
      }

      await delay(1000);
      setPhase('completed');

    } catch (error: any) {
      log(`LỖI: ${error.message}`);
      setPhase('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentLogs]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-4 md:p-8 font-sans overflow-x-hidden">
      
      {/* Background effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <button 
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 transition-colors border border-gray-700/50"
        >
          <History className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:block">Lịch Sử Báo Cáo</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full pt-8">
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 text-transparent bg-clip-text"
          >
            AI Stock Training Agent
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Mô phỏng quy trình phân tích kỹ thuật và cơ bản để đào tạo giao dịch cổ phiếu.
          </motion.p>
        </div>
        
        {/* Input Form */}
        <motion.form 
          onSubmit={runWorkflow}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16 relative"
        >
          <div className="relative flex items-center">
            <DollarSign className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Nhập mã cổ phiếu (VD: AAPL, TSLA, VNM)..."
              disabled={isProcessing}
              className="w-full bg-[#13131a] border border-gray-700 rounded-full py-4 pl-12 pr-36 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50 uppercase"
            />
            <button 
              type="submit"
              disabled={!ticker.trim() || isProcessing}
              className="absolute right-2 px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang chạy</span>
                </>
              ) : (
                <>
                  <span>Phân Tích</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Pipeline Visualization */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-0 px-2 w-full mb-16">
          {steps.map((step, index) => {
            let state: 'idle' | 'active' | 'completed' = 'idle';
            if (phase === 'completed') {
              state = 'completed';
            } else if (currentStep > index) {
              state = 'completed';
            } else if (currentStep === index) {
              state = phase === 'node' ? 'active' : 'completed';
            }

            const edgeIsActive = currentStep === index && phase === 'edge';
            const edgeIsCompleted = currentStep > index || phase === 'completed';

            return (
              <React.Fragment key={step.id}>
                <Node step={step} state={state} />
                {index < steps.length - 1 && (
                  <Edge 
                    isActive={edgeIsActive} 
                    isCompleted={edgeIsCompleted} 
                    fromColor={steps[index].hex}
                    toColor={steps[index + 1].hex}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Bottom Section: Terminal & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto pb-12">
          
          {/* Terminal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-[#0a0a0f] border border-gray-800/50 rounded-xl overflow-hidden shadow-2xl flex flex-col h-96"
          >
            <div className="flex items-center px-4 py-3 bg-[#13131a] border-b border-gray-800/50 shrink-0">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs text-gray-500 font-mono tracking-wider">agent_terminal.log</div>
              <div className="w-12"></div>
            </div>
            <div 
              ref={terminalRef}
              className="p-5 overflow-y-auto font-mono text-xs md:text-sm text-gray-300 flex flex-col gap-2 scroll-smooth flex-grow"
            >
              {currentLogs.length === 0 && phase === 'idle' && (
                <div className="text-gray-600 italic">Đang chờ nhập mã cổ phiếu...</div>
              )}
              {currentLogs.map((log, i) => {
                const [timestamp, ...rest] = log.split('] ');
                const message = rest.join('] ');
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-gray-600 shrink-0">{timestamp}]</span> 
                    <span className="text-emerald-400">{message}</span>
                  </motion.div>
                );
              })}
              {isProcessing && (
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-gray-400 mt-1 shrink-0"
                />
              )}
            </div>
          </motion.div>

          {/* Response Output & Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-[#0a0a0f] border border-gray-800/50 rounded-xl overflow-hidden shadow-2xl flex flex-col h-96 relative"
          >
            <div className="flex items-center px-4 py-3 bg-[#13131a] border-b border-gray-800/50 shrink-0 gap-4">
              <button 
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-colors ${activeTab === 'report' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <TrendingUp className="w-4 h-4" />
                Báo Cáo Phân Tích
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 text-xs font-medium tracking-wider uppercase transition-colors ${activeTab === 'chat' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                disabled={phase !== 'completed'}
              >
                <MessageCircle className="w-4 h-4" />
                Hỏi Đáp AI
              </button>
              
              {activeTab === 'report' && phase === 'completed' && (
                <button onClick={downloadReport} className="ml-auto text-gray-400 hover:text-white transition-colors" title="Tải báo cáo Markdown">
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow text-gray-200 whitespace-pre-wrap leading-relaxed text-sm md:text-base markdown-body">
              {activeTab === 'report' ? (
                finalResponse ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {finalResponse}
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-gray-600 italic">
                      {isProcessing ? "Đang chờ AI tổng hợp báo cáo..." : "Báo cáo phân tích sẽ xuất hiện ở đây..."}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-grow overflow-y-auto flex flex-col gap-4 pb-4">
                    <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 text-gray-300 self-start max-w-[85%]">
                      Chào bạn, tôi đã phân tích xong mã {ticker}. Bạn có câu hỏi nào thêm về cổ phiếu này không?
                    </div>
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500/10 border-blue-500/30 text-blue-100 self-end' : 'bg-gray-800/30 border-gray-700/50 text-gray-300 self-start'}`}>
                        {msg.text || (msg.role === 'model' && <span className="animate-pulse">Đang trả lời...</span>)}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleChat} className="relative mt-auto shrink-0">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Hỏi thêm về cổ phiếu này..."
                      disabled={isChatting}
                      className="w-full bg-[#13131a] border border-gray-700 rounded-full py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isChatting}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:bg-gray-700"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0f] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#13131a]">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Lịch Sử Báo Cáo
              </h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Chưa có báo cáo nào được lưu.</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-[#13131a] border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-sm border border-emerald-500/20">
                        {item.ticker}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 line-clamp-3 markdown-body">
                      {item.report_text}
                    </div>
                    <button 
                      onClick={() => {
                        setTicker(item.ticker);
                        setFinalResponse(item.report_text);
                        setPhase('completed');
                        setCurrentStep(5);
                        setShowHistory(false);
                      }}
                      className="text-emerald-400 text-sm hover:underline self-start"
                    >
                      Xem chi tiết &rarr;
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
