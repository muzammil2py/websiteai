
import React, { useState } from 'react';
import { ViewState, GameMetadata } from './types';
import { RETRO_GAMES, LATEST_GAMES_2025 } from './constants';
import { fetchGameInfo } from './services/geminiService';
import Tetris from './components/Games/Tetris';
import Arkanoid from './components/Games/Arkanoid';
import Snake from './components/Games/Snake';
import Pinball from './components/Games/Pinball';
import SpaceShooter from './components/Games/SpaceShooter';
import SimplePlatformer from './components/Games/SimplePlatformer';
import MazeGame from './components/Games/MazeGame';
import Pong from './components/Games/Pong';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('library');
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleLearnMore = async (game: GameMetadata) => {
    setSelectedGame(game);
    setView('learn');
    setIsLoadingAi(true);
    setAiContent(null);
    const info = await fetchGameInfo(game.title);
    setAiContent(info);
    setIsLoadingAi(false);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    // Special custom logic first
    if (selectedGame.title === 'Tetris' || selectedGame.title === 'Tetris 2') return <Tetris />;
    if (selectedGame.title === 'Arkanoid' || selectedGame.title === 'Breakout') return <Arkanoid />;
    if (selectedGame.title === 'Snake') return <Snake />;
    if (selectedGame.title === 'Pinball') return <Pinball />;
    if (selectedGame.title === 'Pong') return <Pong title="PONG" />;

    // Generic Engines based on category
    switch (selectedGame.category) {
      case 'Shooter':
      case 'Space':
        return <SpaceShooter game={selectedGame} />;
      case 'Platformer':
      case 'Adventure':
      case 'Fighting':
      case 'Action':
        return <SimplePlatformer game={selectedGame} />;
      case 'Maze':
      case 'Puzzle':
      case 'Logic':
        return <MazeGame game={selectedGame} />;
      case 'Sports':
      case 'Racing':
      case 'Simulation':
        return <Pong title={selectedGame.title} />;
      default:
        return <MazeGame game={selectedGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-green-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-green-400 text-blue-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('library')}>
            <span className="text-3xl group-hover:rotate-12 transition-transform">🕹️</span>
            <h1 className="text-2xl font-pixel tracking-tighter">RetroVault 2025</h1>
          </div>
          <nav className="flex gap-4 md:gap-6 font-bold text-[10px] md:text-sm uppercase tracking-widest">
            <button 
              onClick={() => setView('library')} 
              className={`hover:text-white transition-colors py-1 border-b-2 ${view === 'library' || view === 'game' ? 'border-white text-white' : 'border-transparent text-blue-900'}`}
            >
              Library
            </button>
            <button 
              onClick={() => setView('gallery')} 
              className={`hover:text-white transition-colors py-1 border-b-2 ${view === 'gallery' ? 'border-white text-white' : 'border-transparent text-blue-900'}`}
            >
              2025 New
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {view === 'library' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-2">Retro Classics</h2>
                <p className="text-gray-600 font-medium">Every single one of our 30 titles is now fully playable.</p>
              </div>
              <div className="px-5 py-2 bg-green-100 border-2 border-green-300 rounded-full text-green-800 text-[10px] font-pixel self-start md:self-auto">
                {RETRO_GAMES.length} PLAYABLE GAMES
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {RETRO_GAMES.map((game) => (
                <div 
                  key={game.id}
                  className="group relative bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-green-400 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    {game.icon}
                  </div>
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <span className="text-4xl md:text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{game.icon}</span>
                    <span className="text-[9px] font-pixel bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 mb-2 relative z-10">{game.title}</h3>
                  <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed relative z-10">{game.description}</p>
                  <div className="flex gap-4 relative z-10">
                    <button 
                      onClick={() => { setSelectedGame(game); setView('game'); }}
                      className="flex-1 bg-green-500 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_rgb(22,163,74)] active:shadow-none active:translate-y-1 transition-all text-sm"
                    >
                      PLAY NOW
                    </button>
                    <button 
                      onClick={() => handleLearnMore(game)}
                      className="flex-1 bg-blue-900 text-white font-black py-3 rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all text-sm"
                    >
                      HISTORY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'game' && (
          <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setView('library')}
              className="mb-6 md:mb-8 flex items-center gap-2 text-blue-900 font-bold hover:translate-x-[-8px] transition-transform"
            >
              <span className="bg-green-100 p-2 rounded-full">←</span> Back to Vault
            </button>
            <div className="bg-white p-4 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl border-4 border-gray-100 flex flex-col items-center">
              {renderGame()}
            </div>
          </div>
        )}

        {view === 'learn' && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-right-8 duration-300">
            <button 
              onClick={() => setView('library')}
              className="mb-8 flex items-center gap-2 text-blue-900 font-bold hover:translate-x-[-8px] transition-transform"
            >
               <span className="bg-green-100 p-2 rounded-full">←</span> Back to Vault
            </button>
            <div className="bg-green-50 p-6 md:p-10 rounded-3xl md:rounded-[3rem] border-4 border-green-200 shadow-xl">
              <div className="flex items-center gap-6 mb-8 border-b-2 border-green-200 pb-6">
                <span className="text-5xl md:text-6xl drop-shadow-lg">{selectedGame?.icon}</span>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-blue-900 leading-tight">{selectedGame?.title}</h2>
                  <p className="text-green-700 font-bold mt-1 md:mt-2 uppercase tracking-widest text-[10px]">Gaming Encyclopedia</p>
                </div>
              </div>
              {isLoadingAi ? (
                <div className="space-y-6">
                  <div className="h-4 bg-green-200 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-green-200 rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-green-200 rounded-full w-1/2 animate-pulse"></div>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-lg prose-blue max-w-none text-blue-900 leading-relaxed font-medium">
                  {aiContent}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-14">
              <h2 className="text-3xl md:text-5xl font-black text-blue-900 mb-4 tracking-tight">The 2025 Collection</h2>
              <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl">A preview of how we're reimagining these icons.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {LATEST_GAMES_2025.map(game => (
                <div key={game.id} className="group overflow-hidden rounded-3xl border-4 border-gray-100 bg-white shadow-xl">
                  <div className="relative overflow-hidden h-48 md:h-72">
                    <img 
                      src={game.image} 
                      alt={game.title} 
                      className="w-full h-full object-cover transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 bg-green-400 text-blue-900 font-pixel text-[8px] px-3 py-2 rounded-lg">
                      {game.releaseDate}
                    </div>
                  </div>
                  <div className="p-6 md:p-10">
                    <h3 className="text-2xl md:text-3xl font-black text-blue-900 mb-3">{game.title}</h3>
                    <p className="text-gray-500 mb-6 text-sm md:text-lg leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <button className="text-blue-900 font-black text-xs uppercase tracking-wider flex items-center gap-3">
                        Pre-order Info <span className="text-green-500">→</span>
                      </button>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 md:py-16 px-4 mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="font-pixel text-lg mb-6 text-green-400 tracking-tighter">RetroVault</h4>
            <p className="text-blue-200 text-sm md:text-lg leading-relaxed max-w-md">
              Preserving and celebrating digital history for the generations to come.
            </p>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 uppercase tracking-widest text-blue-100 text-sm">Vault Access</h4>
            <ul className="space-y-3 text-blue-300 font-bold text-sm">
              <li><button onClick={() => setView('library')} className="hover:text-green-400 transition-colors text-left">Full Catalog</button></li>
              <li><button onClick={() => setView('gallery')} className="hover:text-green-400 transition-colors text-left">2025 Roadmap</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 uppercase tracking-widest text-blue-100 text-sm">Social</h4>
            <div className="flex gap-3 mb-8">
              {['𝕏', '📸', '💬'].map(icon => (
                <div key={icon} className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-green-500 hover:text-blue-900 transition-all text-sm">
                  {icon}
                </div>
              ))}
            </div>
            <p className="text-blue-400 text-[10px] font-medium uppercase tracking-tighter">© 2025 RetroVault Global.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
