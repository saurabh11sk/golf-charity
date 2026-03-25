'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CharityPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
    fetchCharities();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const fetchCharities = async () => {
    const { data } = await supabase.from('charities').select('*');
    setCharities(data || []);
  };

  const selectCharity = async (charityId: string) => {
    if (!user) return;

    await supabase.from('user_charity').insert([
      {
        user_id: user.id,
        charity_id: charityId,
        contribution_percent: 10,
      },
    ]);

    alert('Charity selected!');
  };

  return (
    <div className="p-10">
      <h1>Select Charity</h1>

      {charities.map((c) => (
        <div key={c.id} className="border p-3 mt-2">
          <h2>{c.name}</h2>
          <p>{c.description}</p>

          <button
            onClick={() => selectCharity(c.id)}
            className="mt-2 bg-black text-white p-2"
          >
            Select
          </button>
        </div>
      ))}
    </div>
  );
}