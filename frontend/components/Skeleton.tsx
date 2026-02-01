import React from 'react';

export const SkeletonLine: React.FC<{ width?: string; className?: string }> = ({ width = 'w-full', className = '' }) => (
  <div className={`h-4 bg-slate-200 rounded-full animate-pulse ${width} ${className}`} />
);

export const SkeletonCircle: React.FC<{ size?: string; className?: string }> = ({ size = 'w-10 h-10', className = '' }) => (
  <div className={`rounded-full bg-slate-200 animate-pulse ${size} ${className}`} />
);

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="flex-1 h-12 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

interface SkeletonCardProps {
  count?: number;
  columns?: number;
}

export const SkeletonCards: React.FC<SkeletonCardProps> = ({ count = 4, columns = 2 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-slate-100 p-6 rounded-xl space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-2/3" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ height?: string }> = ({ height = 'h-96' }) => (
  <div className={`${height} bg-slate-100 rounded-xl animate-pulse`} />
);

interface SkeletonProfileProps {
  showAvatar?: boolean;
}

export const SkeletonProfile: React.FC<SkeletonProfileProps> = ({ showAvatar = true }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      {showAvatar && <SkeletonCircle size="w-16 h-16" />}
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-2/3" />
        <SkeletonLine width="w-1/2" />
      </div>
    </div>
  </div>
);

export const SkeletonListItem: React.FC = () => (
  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
    <SkeletonCircle size="w-10 h-10" />
    <div className="flex-1 space-y-2">
      <SkeletonLine width="w-3/4" />
      <SkeletonLine width="w-1/2" />
    </div>
  </div>
);
