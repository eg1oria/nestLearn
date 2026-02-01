'use client'

import { useAuth } from "@/contexts/AuthContext";

export default function UserPage() {
  const { user } = useAuth();
  return (
    <div className="">
      <p>{user?.name}</p>
      <p>{user?.id}</p>
      <p>{user?.email}</p>
    </div>
  );
}
