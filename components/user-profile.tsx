"use client";

import { useSupabase } from "@/components/supabase-provider";

function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function UserProfile() {
  const { session } = useSupabase();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
  const displayName = fullName || user.email || "Account";
  const initials = getInitials(fullName || user.email);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-xs font-semibold text-white">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
        {displayName}
      </span>
      <span className="text-sm font-semibold text-slate-700 sm:hidden">
        {displayName.length > 15 ? `${displayName.substring(0, 15)}...` : displayName}
      </span>
    </div>
  );
}

