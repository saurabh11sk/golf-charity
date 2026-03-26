"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    checkAdmin();
  }, []);

  if (profile && profile.role !== "admin") {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <a href="/admin/users" className="bg-white p-5 rounded shadow text-center hover:bg-gray-200">
          👥 Manage Users
        </a>

        <a href="/admin/charities" className="bg-white p-5 rounded shadow text-center hover:bg-gray-200">
          ❤️ Manage Charities
        </a>

        <a href="/admin/winners" className="bg-white p-5 rounded shadow text-center hover:bg-gray-200">
          🏆 Verify Winners
        </a>

        <a href="/admin/draw" className="bg-white p-5 rounded shadow text-center hover:bg-gray-200">
          🎯 Draw Panel
        </a>
        <a href="/admin/subscriptions" className="bg-white p-5 rounded shadow text-center hover:bg-gray-200">
        ⭐ Manage Subscriptions
        </a>
      </div>
    </div>
  );
}