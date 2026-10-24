import { Joystick, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_BADGE_STYLE = {
  PS5: 'bg-blue-50 text-blue-800 border-zinc-950',
  PS4: 'bg-slate-100 text-slate-800 border-zinc-950',
  PC: 'bg-emerald-50 text-emerald-800 border-zinc-950',
};

export default function GameCard({ game, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      className="group cursor-pointer bg-white border border-zinc-950 rounded-2xl overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#18181b] shadow-[2px_2px_0px_0px_#18181b] transition-all flex flex-col"
      onClick={() => navigate(`/admin/games/${game.id}`)}
    >
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
        {game.cover_image ? (
          <img
            src={resolveImageUrl(game.cover_image)}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <Joystick size={40} className="text-zinc-400" />
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(game); }}
            title="Edit Game"
            className="p-1.5 rounded-xl bg-white text-zinc-950 border border-zinc-950 hover:bg-zinc-100 shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(game); }}
            title="Hapus Game"
            className="p-1.5 rounded-xl bg-rose-50 text-rose-700 border border-zinc-950 hover:bg-rose-100 shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2 bg-white">
        <h3 className="text-zinc-950 font-bold text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-cust-red transition">
          {game.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {game.platforms?.map((p) => (
            <span
              key={p}
              className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-md border shadow-[1px_1px_0px_0px_#18181b] ${
                PLATFORM_BADGE_STYLE[p] || 'bg-zinc-100 text-zinc-800 border-zinc-950'
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
