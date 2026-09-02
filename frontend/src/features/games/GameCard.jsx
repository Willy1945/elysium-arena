import { Joystick, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_STYLE = {
  PS5: '#00439c',
  PS4: '#7c8794',
  PC: '#16a34a',
};

export default function GameCard({ game, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/admin/games/${game.id}`)}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-inset shadow-md group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:-translate-y-1.5 group-hover:ring-2 group-hover:ring-white/20 transition-all duration-300 ease-out">
        {game.cover_image ? (
          <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Joystick size={40} className="text-text-secondary opacity-30" />
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(game); }}
            title="Edit"
            className="p-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-accent transition"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(game); }}
            title="Hapus"
            className="p-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-status-occupied transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="pt-2.5 px-0.5">
        <h3 className="text-text-primary font-semibold text-sm leading-snug line-clamp-1">{game.name}</h3>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {game.platforms?.map((p) => (
            <span
              key={p}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: PLATFORM_STYLE[p] || '#666', color: '#fff' }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}