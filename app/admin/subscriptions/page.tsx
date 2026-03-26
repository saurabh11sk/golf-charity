"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SubscriptionsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // ✅ admin check
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // ✅ fetch users
      const { data } = await supabase.from("profiles").select("*");
      setUsers(data || []);
    };

    fetchData();
  }, []);

  // ❌ block non-admin
  if (profile && profile.role !== "admin") {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  // ✅ FINAL FUNCTION
  const updateSubscription = async (userId: string, plan: string) => {
    console.log("Updating:", userId, plan);

    // map for profile
    const profilePlan = plan === "free" ? "free" : "premium";

    // 1️⃣ update profile (dashboard)
    await supabase
      .from("profiles")
      .update({ subscription: profilePlan })
      .eq("id", userId);

    // 2️⃣ handle DB only if not free
    if (plan !== "free") {
      const endDate =
        plan === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      // check existing
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existing) {
        // ✅ update existing
        await supabase
          .from("subscriptions")
          .update({
            plan,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
          })
          .eq("user_id", userId);
      } else {
        // ✅ insert first time
        await supabase.from("subscriptions").insert([
          {
            user_id: userId,
            plan,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
          },
        ]);
      }
    }

    alert("Subscription updated!");
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Manage Subscriptions
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Current Plan</th>
            <th className="p-2 border">Change Plan</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.email}</td>

              <td className="p-2 border">
                {u.subscription || "free"}
              </td>

              <td className="p-2 border">
                <select
                  onChange={(e) =>
                    updateSubscription(u.id, e.target.value)
                  }
                  className="border px-2 py-1"
                  value={
                    u.subscription === "premium"
                      ? "monthly"
                      : "free"
                  }
                >
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}