
import { GameMetadata, LatestGame } from './types';

export const RETRO_GAMES: GameMetadata[] = Array.from({ length: 30 }, (_, i) => {
  const games = [
    { title: 'Tetris', category: 'Puzzle', icon: '🧩' },
    { title: 'Arkanoid', category: 'Arcade', icon: '🧱' },
    { title: 'Pinball', category: 'Simulation', icon: '⚽' },
    { title: 'Snake', category: 'Classic', icon: '🐍' },
    { title: 'Pac-Man', category: 'Maze', icon: '🍕' },
    { title: 'Space Invaders', category: 'Shooter', icon: '👾' },
    { title: 'Pong', category: 'Sports', icon: '🏓' },
    { title: 'Asteroids', category: 'Space', icon: '☄️' },
    { title: 'Donkey Kong', category: 'Platformer', icon: '🦍' },
    { title: 'Minesweeper', category: 'Logic', icon: '💣' },
    { title: 'Galaga', category: 'Shooter', icon: '🚀' },
    { title: 'Frogger', category: 'Action', icon: '🐸' },
    { title: 'Breakout', category: 'Arcade', icon: '🔨' },
    { title: 'Dig Dug', category: 'Classic', icon: '🚜' },
    { title: 'Q*bert', category: 'Puzzle', icon: '💠' },
    { title: 'Pitfall', category: 'Adventure', icon: '🐊' },
    { title: 'Centipede', category: 'Shooter', icon: '🐛' },
    { title: 'Joust', category: 'Action', icon: '🦅' },
    { title: 'Defender', category: 'Shooter', icon: '🛸' },
    { title: 'Paperboy', category: 'Action', icon: '🚲' },
    { title: 'Zaxxon', category: 'Isometric', icon: '🛰️' },
    { title: 'Tapper', category: 'Simulation', icon: '🍺' },
    { title: 'Rampage', category: 'Action', icon: '🦖' },
    { title: 'Excitebike', category: 'Racing', icon: '🏍️' },
    { title: 'Kung-Fu', category: 'Fighting', icon: '🥋' },
    { title: 'Tetris 2', category: 'Puzzle', icon: '⬜' },
    { title: 'Sokoban', category: 'Logic', icon: '📦' },
    { title: 'Boulder Dash', category: 'Action', icon: '💎' },
    { title: 'Super Mario', category: 'Platformer', icon: '🍄' },
    { title: 'Contra', category: 'Shooter', icon: '🔫' },
  ];
  const g = games[i] || { title: `Classic ${i + 1}`, category: 'Retro', icon: '🎮' };
  return {
    id: `game-${i}`,
    title: g.title,
    category: g.category,
    description: `A legendary ${g.category.toLowerCase()} experience from the golden era of gaming.`,
    icon: g.icon,
  };
});

export const LATEST_GAMES_2025: LatestGame[] = [
  {
    id: 1,
    title: "Neon Odyssey 2025",
    releaseDate: "Jan 2025",
    image: "https://picsum.photos/seed/neon/800/450",
    description: "A cyberpunk visual masterpiece pushing the limits of current-gen hardware."
  },
  {
    id: 2,
    title: "Aetheria Rising",
    releaseDate: "Feb 2025",
    image: "https://picsum.photos/seed/aether/800/450",
    description: "The next evolution in open-world RPG storytelling."
  },
  {
    id: 3,
    title: "Velocity Prime",
    releaseDate: "Mar 2025",
    image: "https://picsum.photos/seed/velocity/800/450",
    description: "Hyper-realistic racing with dynamic weather and real-time raytracing."
  },
  {
    id: 4,
    title: "Stellar Horizon",
    releaseDate: "April 2025",
    image: "https://picsum.photos/seed/stellar/800/450",
    description: "Explore uncharted galaxies in this massive multiplayer space sim."
  }
];
