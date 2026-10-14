import { Joystick, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_BADGE_STYLE = {
  PS5: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  PS4: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
  PC: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
};

export default function GameCard({ game, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col"
      onClick={() => navigate(`/admin/games/${game.id}`)}
    >
      <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
        {game.cover_image ? (
          <img
            src={resolveImageUrl(game.cover_image)}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <Joystick size={40} className="text-zinc-700" />
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(game); }}
            title="Edit Game"
            className="p-1.5 rounded-xl bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700/60 hover:text-white hover:bg-zinc-800 transition"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(game); }}
            title="Hapus Game"
            className="p-1.5 rounded-xl bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-700/60 hover:text-rose-400 hover:border-rose-800/60 transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <h3 className="text-white font-semibold text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-cust-red transition">
          {game.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {game.platforms?.map((p) => (
            <span
              key={p}
              className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-md border ${
                PLATFORM_BADGE_STYLE[p] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}