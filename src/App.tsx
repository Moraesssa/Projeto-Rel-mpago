import { useState, useEffect } from 'react';
import { Home, Share2, Menu, RotateCcw, Trophy, Delete, Check } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

// Types
type Problem = {
  num1: number;
  num2: number;
  answer: number;
};

type GameState = 'idle' | 'playing' | 'finished';

const generateProblem = (): Problem => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Character = ({ color, flip, isPulling }: { color: 'blue' | 'red', flip?: boolean, isPulling?: boolean }) => {
  const fill = color === 'blue' ? '#3b82f6' : '#ef4444';
  return (
    <motion.div 
      className={clsx("w-10 h-16 sm:w-16 sm:h-24 lg:w-24 lg:h-36 xl:w-28 xl:h-40 origin-bottom", flip && "scale-x-[-1]")}
      animate={isPulling ? { rotate: [-5, 5, -5], x: flip ? [5, -5, 5] : [-5, 5, -5] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
    >
      <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md">
        {/* Back Leg */}
        <rect x="35" y="90" width="12" height="50" rx="6" fill="#1f2937" transform="rotate(20 40 90)" />
        {/* Front Leg */}
        <rect x="55" y="90" width="12" height="50" rx="6" fill="#1f2937" transform="rotate(-20 60 90)" />
        
        {/* Body */}
        <path d="M 30 40 L 70 40 L 75 95 L 25 95 Z" fill={fill} stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Head */}
        <circle cx="50" cy="25" r="18" fill="#FFD1B3" stroke="#1f2937" strokeWidth="3" />
        
        {/* Arms pulling forward */}
        <rect x="40" y="45" width="45" height="12" rx="6" fill={fill} stroke="#1f2937" strokeWidth="3" transform="rotate(15 40 45)" />
        
        {/* Hands */}
        <circle cx="85" cy="57" r="8" fill="#FFD1B3" stroke="#1f2937" strokeWidth="2" />
      </svg>
    </motion.div>
  );
};

const TugOfWarVisual = ({ score1, score2, maxDiff }: { score1: number, score2: number, maxDiff: number }) => {
  const diff = Math.max(-maxDiff, Math.min(maxDiff, score1 - score2));
  const position = 50 - (diff / maxDiff) * 35; 

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Center Line */}
      <div className="absolute left-1/2 top-1/4 bottom-1/4 w-0.5 sm:w-1 border-l-2 sm:border-l-4 border-dashed border-gray-300 -translate-x-1/2" />
      
      {/* Rope */}
      <div className="absolute w-[200%] h-1 sm:h-2 lg:h-4 bg-[#8B4513] top-[65%] -translate-y-1/2 rounded-full shadow-inner" />
      
      {/* Marker (Red Flag) */}
      <motion.div 
        className="absolute top-[65%] -translate-y-1/2 w-1.5 sm:w-2 lg:w-4 h-6 sm:h-8 lg:h-16 bg-red-500 rounded-sm shadow-md z-10"
        animate={{ left: `${position}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        style={{ x: '-50%' }}
      />

      {/* Team 1 Characters (Left) */}
      <motion.div 
        className="absolute top-[65%] -translate-y-[70%] flex gap-1 sm:gap-2 lg:gap-4 z-20"
        animate={{ left: `calc(${position}% - 8%)` }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        style={{ x: '-100%' }}
      >
        <Character color="blue" isPulling={score1 > score2} />
        <Character color="blue" isPulling={score1 > score2} />
      </motion.div>

      {/* Team 2 Characters (Right) */}
      <motion.div 
        className="absolute top-[65%] -translate-y-[70%] flex gap-1 sm:gap-2 lg:gap-4 z-20"
        animate={{ left: `calc(${position}% + 8%)` }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
      >
        <Character color="red" flip isPulling={score2 > score1} />
        <Character color="red" flip isPulling={score2 > score1} />
      </motion.div>
    </div>
  );
};

const Keypad = ({ onKeyPress }: { onKeyPress: (key: string) => void }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', 'V'];
  
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
      {keys.map(key => {
        const isX = key === 'X';
        const isV = key === 'V';
        return (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className={clsx(
              "h-10 sm:h-14 lg:h-24 xl:h-28 text-lg sm:text-2xl lg:text-5xl xl:text-6xl font-bold rounded-lg sm:rounded-xl lg:rounded-3xl shadow-sm border-b-2 sm:border-b-4 lg:border-b-[6px] flex items-center justify-center transition-all",
              "active:border-b-0 active:translate-y-1 lg:active:translate-y-2 select-none touch-manipulation",
              isX ? "bg-red-500 text-white border-red-700 active:bg-red-600" :
              isV ? "bg-blue-500 text-white border-blue-700 active:bg-blue-600" :
              "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 active:bg-gray-100"
            )}
          >
            {isX ? <Delete className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-14 xl:h-14" /> : isV ? <Check className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16 stroke-[4]" /> : key}
          </button>
        );
      })}
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [time, setTime] = useState(0);
  
  const [team1Score, setTeam1Score] = useState(0);
  const [team1Problem, setTeam1Problem] = useState<Problem>(generateProblem());
  const [team1Input, setTeam1Input] = useState('');
  const [team1Error, setTeam1Error] = useState(false);
  const [team1Success, setTeam1Success] = useState(false);

  const [team2Score, setTeam2Score] = useState(0);
  const [team2Problem, setTeam2Problem] = useState<Problem>(generateProblem());
  const [team2Input, setTeam2Input] = useState('');
  const [team2Error, setTeam2Error] = useState(false);
  const [team2Success, setTeam2Success] = useState(false);

  const WIN_DIFFERENCE = 10;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (team1Score - team2Score >= WIN_DIFFERENCE || team2Score - team1Score >= WIN_DIFFERENCE) {
        setGameState('finished');
      }
    }
  }, [team1Score, team2Score, gameState]);

  const startGame = () => {
    setGameState('playing');
    setTime(0);
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam1Problem(generateProblem());
    setTeam2Problem(generateProblem());
    setTeam1Input('');
    setTeam2Input('');
    setTeam1Success(false);
    setTeam2Success(false);
  };

  const handleKeyPress = (team: 1 | 2, key: string) => {
    if (gameState !== 'playing') {
      if (gameState === 'idle') startGame();
      return;
    }

    const setInput = team === 1 ? setTeam1Input : setTeam2Input;
    const input = team === 1 ? team1Input : team2Input;
    const problem = team === 1 ? team1Problem : team2Problem;
    const setScore = team === 1 ? setTeam1Score : setTeam2Score;
    const setProblem = team === 1 ? setTeam1Problem : setTeam2Problem;
    const setError = team === 1 ? setTeam1Error : setTeam2Error;
    const setSuccess = team === 1 ? setTeam1Success : setTeam2Success;
    const isSuccess = team === 1 ? team1Success : team2Success;

    // Ignore input if currently showing success animation
    if (isSuccess) return;

    if (key === 'X') {
      setInput('');
    } else if (key === 'V') {
      if (!input) return; // Prevent empty submission

      if (parseInt(input) === problem.answer) {
        setScore(s => s + 1);
        setSuccess(true);
        // Pause briefly to show success before generating new problem
        setTimeout(() => {
          setSuccess(false);
          setProblem(generateProblem());
          setInput('');
        }, 500);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
        setInput('');
      }
    } else {
      if (input.length < 3) {
        setInput(input + key);
      }
    }
  };

  const winner = team1Score > team2Score ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-sans overflow-x-hidden touch-none select-none">
      {/* Main Content */}
      <main className="flex-1 flex flex-row justify-between p-2 sm:p-4 lg:p-6 relative overflow-hidden">
        
        {/* Scoreboard (Absolute Top Center) */}
        <div className="absolute top-2 sm:top-4 lg:top-6 left-1/2 -translate-x-1/2 flex items-center justify-between w-[90%] max-w-2xl bg-gray-200/90 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-2 sm:py-4 lg:py-6 rounded-full shadow-lg border border-gray-300/50 z-30">
          <div className="text-blue-600 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Team 1</span>
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black leading-none">{team1Score}</span>
          </div>
          <div className="text-2xl sm:text-4xl lg:text-6xl font-mono font-bold tracking-widest text-center text-gray-800">
            {formatTime(time)}
          </div>
          <div className="text-red-600 flex flex-col items-center">
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Team 2</span>
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black leading-none">{team2Score}</span>
          </div>
        </div>

        {/* Tug of War Animation (Absolute Full Screen) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <TugOfWarVisual score1={team1Score} score2={team2Score} maxDiff={WIN_DIFFERENCE} />
        </div>

        {/* Team 1 Panel */}
        <div className="w-[32%] flex flex-col bg-blue-50/40 backdrop-blur-[2px] rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-lg border-2 border-blue-200 overflow-hidden z-10 mt-20 sm:mt-24 lg:mt-32">
          <div className="bg-blue-500 p-2 sm:p-4 lg:p-6 text-center shrink-0">
            <h2 className="text-sm sm:text-xl lg:text-4xl font-bold text-white tracking-wide">Team 1</h2>
          </div>
          <div className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80px] sm:min-h-[150px] lg:min-h-[250px] relative z-20">
              <div className="text-2xl sm:text-4xl lg:text-7xl xl:text-[6rem] font-bold text-gray-800 mb-2 sm:mb-6 lg:mb-10 tracking-tighter whitespace-nowrap drop-shadow-sm">
                {team1Problem.num1} + {team1Problem.num2} = ?
              </div>
              <motion.div 
                animate={team1Error ? { x: [-10, 10, -10, 10, 0] } : team1Success ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={clsx(
                  "w-full h-10 sm:h-16 lg:h-28 xl:h-36 rounded-lg sm:rounded-xl lg:rounded-3xl flex items-center justify-center text-xl sm:text-3xl lg:text-6xl xl:text-[5rem] font-bold border-2 sm:border-4 transition-colors bg-white/90 backdrop-blur-sm shadow-sm",
                  team1Success ? "border-green-400 text-green-600" :
                  team1Input ? "border-blue-400 text-blue-900" : "border-transparent text-gray-400",
                  team1Error && "border-red-400 text-red-600"
                )}
              >
                {team1Input || "?"}
              </motion.div>
            </div>
            <div className="mt-auto pt-2 sm:pt-4 lg:pt-6 relative z-20">
              <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-2 sm:p-4 lg:p-6 shadow-inner border border-gray-200/50">
                <Keypad onKeyPress={(k) => handleKeyPress(1, k)} />
              </div>
            </div>
          </div>
        </div>

        {/* Team 2 Panel */}
        <div className="w-[32%] flex flex-col bg-red-50/40 backdrop-blur-[2px] rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-lg border-2 border-red-200 overflow-hidden z-10 mt-20 sm:mt-24 lg:mt-32">
          <div className="bg-red-500 p-2 sm:p-4 lg:p-6 text-center shrink-0">
            <h2 className="text-sm sm:text-xl lg:text-4xl font-bold text-white tracking-wide">Team 2</h2>
          </div>
          <div className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80px] sm:min-h-[150px] lg:min-h-[250px] relative z-20">
              <div className="text-2xl sm:text-4xl lg:text-7xl xl:text-[6rem] font-bold text-gray-800 mb-2 sm:mb-6 lg:mb-10 tracking-tighter whitespace-nowrap drop-shadow-sm">
                {team2Problem.num1} + {team2Problem.num2} = ?
              </div>
              <motion.div 
                animate={team2Error ? { x: [-10, 10, -10, 10, 0] } : team2Success ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={clsx(
                  "w-full h-10 sm:h-16 lg:h-28 xl:h-36 rounded-lg sm:rounded-xl lg:rounded-3xl flex items-center justify-center text-xl sm:text-3xl lg:text-6xl xl:text-[5rem] font-bold border-2 sm:border-4 transition-colors bg-white/90 backdrop-blur-sm shadow-sm",
                  team2Success ? "border-green-400 text-green-600" :
                  team2Input ? "border-red-400 text-red-900" : "border-transparent text-gray-400",
                  team2Error && "border-red-400 text-red-600"
                )}
              >
                {team2Input || "?"}
              </motion.div>
            </div>
            <div className="mt-auto pt-2 sm:pt-4 lg:pt-6 relative z-20">
              <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-2 sm:p-4 lg:p-6 shadow-inner border border-gray-200/50">
                <Keypad onKeyPress={(k) => handleKeyPress(2, k)} />
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Winner Overlay */}
      <AnimatePresence>
        {gameState === 'finished' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-12 flex flex-col items-center shadow-2xl w-full max-w-lg"
            >
              <Trophy className={clsx("w-16 h-16 sm:w-28 sm:h-28 mb-4 sm:mb-6", winner === 1 ? "text-blue-500" : "text-red-500")} />
              <h2 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-2">Team {winner}</h2>
              <p className="text-xl sm:text-2xl text-gray-500 mb-6 sm:mb-10">Winner!</p>
              
              <div className="flex gap-8 sm:gap-16 mb-8 sm:mb-12">
                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">Score</p>
                  <p className="text-3xl sm:text-5xl font-bold text-gray-800">{winner === 1 ? team1Score : team2Score}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">Time</p>
                  <p className="text-3xl sm:text-5xl font-bold text-gray-800">{formatTime(time)}</p>
                </div>
              </div>

              <button 
                onClick={startGame}
                className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-colors active:scale-95 shadow-lg"
              >
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />
                PLAY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Overlay */}
      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-12 flex flex-col items-center shadow-2xl w-full max-w-2xl"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">Ready to Play?</h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 text-center max-w-lg leading-relaxed">
                First team to pull the rope all the way to their side wins! Answer math problems correctly to pull.
              </p>
              <button 
                onClick={startGame}
                className="w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl sm:text-3xl lg:text-4xl font-bold transition-transform active:scale-95 shadow-xl shadow-green-500/30"
              >
                START GAME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
