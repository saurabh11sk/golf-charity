"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch winners
  const fetchWinners = async () => {
    const { data } = await supabase.from("winners").select("*");
    setWinners(data || []);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  // ✅ Admin check
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

  // ❌ Block non-admin
  if (profile && profile.role !== "admin") {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  // ✅ Update status with feedback
  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);

    await supabase.from("winners").update({ status }).eq("id", id);

    setMessage(`Winner ${status.toUpperCase()} ✅`);

    await fetchWinners();
    setLoadingId(null);

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Winner Verification</h1>

      {/* ✅ Feedback message */}
      {message && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {message}
        </div>
      )}

      {winners.map((w) => (
        <div
            key={w.id}
            className={`p-4 mb-4 rounded shadow ${
                w.status === "approved"
                ? "bg-green-100 border border-green-400 text-green-900"
                : w.status === "rejected"
                ? "bg-red-100 border border-red-400 text-red-900"
                : "bg-white text-black border"
            }`}
            >
                    
          <p><strong>User:</strong> {w.user_id}</p>
          <p><strong>Score:</strong> {w.score}</p>

          {w.proof_image && (
            <img
              src={w.proof_image}
              alt="proof"
              className="w-40 mb-2"
            />
          )}

          <p>
            <strong>Status:</strong>{" "}
            <span className="font-bold uppercase">{w.status}</span>
            </p>

          <button
            onClick={() => updateStatus(w.id, "approved")}
            className="bg-green-500 text-white px-3 py-1 mr-2"
            disabled={loadingId === w.id}
          >
            {loadingId === w.id ? "Processing..." : "Approve"}
          </button>

          <button
            onClick={() => updateStatus(w.id, "rejected")}
            className="bg-red-500 text-white px-3 py-1"
            disabled={loadingId === w.id}
          >
            {loadingId === w.id ? "Processing..." : "Reject"}
          </button>
        </div>
      ))}
    </div>
  );
}