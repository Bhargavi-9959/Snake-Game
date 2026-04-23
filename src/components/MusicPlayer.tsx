import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Disc, ListMusic } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../types';

export const NeuralPlaylist: React.FC<{
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
}> = ({ currentTrackIndex, onSelectTrack }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Neural Playlist</h2>
      <div className="space-y-4">
        {DUMMY_TRACKS.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => onSelectTrack(idx)}
            className={`w-full p-3 rounded text-left flex items-center gap-3 transition-all ${
              idx === currentTrackIndex 
                ? 'neon-border bg-white/5' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-10 h-10 bg-cyan-900/50 flex items-center justify-center ${idx === currentTrackIndex ? 'animate-pulse' : ''}`}>
               {idx === currentTrackIndex ? (
                 <div className="flex items-center gap-0.5">
                    <div className="w-1 h-3 bg-cyan-400 animate-[bounce_1s_infinite]" />
                    <div className="w-1 h-5 bg-cyan-400 animate-[bounce_1.2s_infinite]" />
                    <div className="w-1 h-2 bg-cyan-400 animate-[bounce_0.8s_infinite]" />
                 </div>
               ) : (
                 <span className="text-xs opacity-40">{(idx + 1).toString().padStart(2, '0')}</span>
               )}
            </div>
            <div className="overflow-hidden">
              <p className={`text-sm font-bold truncate ${idx === currentTrackIndex ? 'neon-text-cyan' : ''}`}>
                {track.title}
              </p>
              <p className="text-[10px] opacity-40 uppercase tracking-tighter truncate">
                {track.artist} / {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const MusicControls: React.FC<{
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
}> = ({ currentTrack, isPlaying, currentTime, duration, onToggle, onNext, onPrev, onSeek }) => {
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-24 glass-panel border-t border-white/10 flex items-center px-8 gap-12 mt-auto relative z-20">
      <div className="w-1/4 flex items-center gap-4">
        <div className="w-12 h-12 glass-panel flex items-center justify-center overflow-hidden">
           <motion.img 
             key={currentTrack.id}
             src={currentTrack.coverUrl} 
             className="w-full h-full object-cover opacity-60" 
             referrerPolicy="no-referrer"
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold whitespace-nowrap neon-text-cyan">{currentTrack.title}</p>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-10">
          <button onClick={onPrev} className="text-[#00f2ff]/60 hover:text-[#00f2ff] transition-all transform hover:scale-110 active:scale-95">
            <SkipBack size={24} className="neon-glow-icon" />
          </button>
          <button
            onClick={onToggle}
            className="w-14 h-14 rounded-full border border-[#00f2ff]/50 flex items-center justify-center hover:bg-[#00f2ff]/10 hover:neon-border transition-all transform active:scale-90"
          >
            {isPlaying ? <Pause size={28} className="neon-text-cyan fill-current neon-glow-icon" /> : <Play size={28} className="neon-text-cyan fill-current ml-1 neon-glow-icon" />}
          </button>
          <button onClick={onNext} className="text-[#00f2ff]/60 hover:text-[#00f2ff] transition-all transform hover:scale-110 active:scale-95">
            <SkipForward size={24} className="neon-glow-icon" />
          </button>
        </div>
        <div className="w-full max-w-md flex flex-col gap-1">
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute h-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
              transition={{ ease: "linear" }}
            />
            <input 
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono opacity-30 tracking-[0.2em]">
             <span>{formatTime(currentTime)}</span>
             <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="w-1/4 flex justify-end items-center gap-4 text-[10px] font-bold opacity-40 tracking-widest">
        <span>VOL</span>
        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white w-2/3"></div>
        </div>
      </div>
    </footer>
  );
};

export const MusicPlayer: React.FC = () => {
  // This is now a "headless" state manager if needed, but App.tsx will drive the UI.
  // Actually, I'll keep the logic in a hook or just in App.tsx.
  return null;
};

