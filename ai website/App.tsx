
import React, { useState, useEffect } from 'react';
import { ViewState, GameMetadata } from './types';
import { RETRO_GAMES, LATEST_GAMES_2025 } from './constants';
import { fetchGameInfo } from './services/geminiService';
import Tetris from './components/Games/Tetris';
import Arkanoid from './components/Games/Arkanoid';
import Snake from './components/Games/Snake';

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
    if (selectedGame.title === 'Tetris') return <Tetris />;
    if (selectedGame.title === 'Arkanoid') return <Arkanoid />;
    if (selectedGame.title === 'Snake') return <Snake />;
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border-2 border-green-200">
        <span className="text-6xl mb-4">{selectedGame.icon}</span>
        <h2 className="text-2xl font-pixel text-blue-900 mb-4">{selectedGame.title}</h2>
        <p className="text-gray-500 italic mb-8">This game is currently being remastered. Check back soon!</p>
        <button 
          onClick={() => setView('library')}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition"
        >
          Back to Library
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-green-400 text-blue-900 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('library')}>
            <span className="text-3xl">🕹️</span>
            <h1 className="text-2xl font-pixel tracking-tighter">RetroVault 2025</h1>
          </div>
          <nav className="flex gap-6 font-bold text-sm uppercase">
            <button 
              onClick={() => setView('library')} 
              className={`hover:underline transition-all ${view === 'library' || view === 'game' ? 'text-white' : ''}`}
            >
              Library
            </button>
            <button 
              onClick={() => setView('gallery')} 
              className={`hover:underline transition-all ${view === 'gallery' ? 'text-white' : ''}`}
            >
              2025 New Arrivals
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {view === 'library' && (
          <div className="animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">Retro Classics</h2>
                <p className="text-gray-600">Explore our collection of 30 legendary titles.</p>
              </div>
              <div className="px-4 py-2 bg-green-100 border border-green-300 rounded-full text-green-800 text-sm font-bold">
                {RETRO_GAMES.length} Games Available
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {RETRO_GAMES.map((game) => (
                <div 
                  key={game.id}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{game.icon}</span>
                    <span className="text-[10px] font-pixel bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{game.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{game.description}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setSelectedGame(game); setView('game'); }}
                      className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl hover:bg-green-600 active:scale-95 transition"
                    >
                      Play
                    </button>
                    <button 
                      onClick={() => handleLearnMore(game)}
                      className="flex-1 bg-blue-900 text-white font-bold py-2 rounded-xl hover:bg-blue-800 active:scale-95 transition"
                    >
                      History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'game' && (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setView('library')}
              className="mb-6 flex items-center gap-2 text-blue-900 font-bold hover:translate-x-[-4px] transition-transform"
            >
              ← Back to Collection
            </button>
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
              {renderGame()}
            </div>
          </div>
        )}

        {view === 'learn' && (
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => setView('library')}
              className="mb-6 flex items-center gap-2 text-blue-900 font-bold hover:translate-x-[-4px] transition-transform"
            >
              ← Back to Collection
            </button>
            <div className="bg-green-50 p-8 rounded-3xl border border-green-200">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{selectedGame?.icon}</span>
                <h2 className="text-3xl font-bold text-blue-900">History of {selectedGame?.title}</h2>
              </div>
              {isLoadingAi ? (
                <div className="space-y-4">
                  <div className="h-4 bg-green-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-green-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-green-200 rounded w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="prose prose-blue max-w-none text-blue-800 leading-relaxed whitespace-pre-wrap">
                  {aiContent}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'gallery' && (
          <div>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Latest Arrivals 2025</h2>
              <p className="text-gray-600 text-lg">Glimpse into the future of gaming with these upcoming blockbusters.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {LATEST_GAMES_2025.map(game => (
                <div key={game.id} className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={game.image} 
                      alt={game.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-blue-900 font-bold text-xs">
                      {game.releaseDate}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">{game.title}</h3>
                    <p className="text-gray-500 mb-4">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <button className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View Trailer <span>→</span>
                      </button>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className="text-yellow-400">★</span>
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
      <footer className="bg-blue-900 text-white py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-pixel text-lg mb-6 text-green-400">RetroVault</h4>
            <p className="text-blue-200 leading-relaxed">Preserving the legacy of 8-bit and 16-bit history for the generations of 2025 and beyond.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-blue-200">
              <li><button onClick={() => setView('library')} className="hover:text-white transition">Full Catalog</button></li>
              <li><button onClick={() => setView('gallery')} className="hover:text-white transition">2025 Preview</button></li>
              <li><button className="hover:text-white transition">Privacy Policy</button></li>
              <li><button className="hover:text-white transition">Contact Arcade Master</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700">𝕏</div>
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700">📸</div>
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700">💬</div>
            </div>
            <p className="text-blue-300 text-sm">© 2025 RetroVault Inc. All pixels reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
