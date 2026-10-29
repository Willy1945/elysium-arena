import { useState, useEffect } from 'react';

export default function UserAvatar({
  src,
  name = '',
  className = 'w-8 h-8 rounded-md object-cover border border-zinc-200',
  fallbackClassName = 'w-8 h-8 rounded-md bg-cust-red flex items-center justify-center text-white font-bold text-xs',
  textClassName = '',
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name || 'User Avatar'}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${className} shrink-0`}
      />
    );
  }

  return (
    <div className={`${fallbackClassName} shrink-0 select-none`}>
      <span className={textClassName}>{initial}</span>
    </div>
  );
}
