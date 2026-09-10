import { useState, useEffect } from 'react';
import StarRating from '../../components/common/StarRating';
import RatingBar from '../../components/common/RatingBar';
import { publicService } from '../../api/publicService';

export default function DeviceRatingsPanel({ deviceId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    publicService.getDeviceRatings(deviceId).then(({ data }) => setData(data));
  }, [deviceId]);

  if (!data) return <p className="text-cust-text-secondary text-xs">Memuat ulasan...</p>;

  if (data.count === 0) {
    return <p className="text-cust-text-secondary text-xs">Belum ada ulasan untuk device ini.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <div className="text-center shrink-0">
          <p className="text-cust-text-primary font-black text-3xl leading-none">{data.average}</p>
          <div className="my-1.5"><StarRating value={data.average} size={12} /></div>
          <p className="text-cust-text-secondary text-[10px]">{data.count} ulasan</p>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((s) => (
            <RatingBar key={s} star={s} count={data.distribution[s] || 0} total={data.count} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
        {data.ratings.map((r) => (
          <div key={r.id} className="border-t border-cust-border pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cust-red/15 text-cust-red flex items-center justify-center text-[10px] font-bold shrink-0">
                  {r.user_name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-cust-text-primary text-xs font-bold">{r.user_name}</span>
              </div>
              <StarRating value={r.rating} size={11} />
            </div>
            {r.comment && <p className="text-cust-text-secondary text-xs leading-relaxed ml-8">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}