import React from 'react';

export function Shimmer({ className }) {
  return <div className={`animate-shimmer rounded-xl ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Shimmer className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Shimmer className="h-4 w-2/3" />
          <Shimmer className="h-3 w-1/3" />
        </div>
      </div>
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-5/6" />
      <Shimmer className="h-3 w-4/6" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-5 space-y-3">
      <Shimmer className="w-9 h-9 rounded-xl" />
      <Shimmer className="h-8 w-16" />
      <Shimmer className="h-3 w-24" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[#E8E8E8] shadow-sm p-8 text-center space-y-4">
      <Shimmer className="w-20 h-20 rounded-full mx-auto" />
      <Shimmer className="h-5 w-32 mx-auto" />
      <Shimmer className="h-3 w-48 mx-auto" />
      <div className="flex justify-center gap-6 pt-4 border-t border-[#E8E8E8]">
        <div className="space-y-2">
          <Shimmer className="h-6 w-8 mx-auto" />
          <Shimmer className="h-3 w-12 mx-auto" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-6 w-8 mx-auto" />
          <Shimmer className="h-3 w-12 mx-auto" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-6 w-8 mx-auto" />
          <Shimmer className="h-3 w-12 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
