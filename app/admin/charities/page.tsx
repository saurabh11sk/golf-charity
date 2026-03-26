"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [name, setName] = useState("");

  const fetchCharities = async () => {
    const { data } = await supabase.from("charities").select("*");
    setCharities(data || []);
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const addCharity = async () => {
    if (!name) return;

    await supabase.from("charities").insert([{ name }]);
    setName("");
    fetchCharities();
  };

  const deleteCharity = async (id: string) => {
    await supabase.from("charities").delete().eq("id", id);
    fetchCharities();
  };
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Charities</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Charity name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addCharity}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <ul>
        {charities.map((c) => (
          <li key={c.id} className="flex justify-between mb-2">
            <span>{c.name}</span>
            <button
              onClick={() => deleteCharity(c.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}