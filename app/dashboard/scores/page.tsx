'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Scores() {
  const [score, setScore] = useState('');
  const [scores, setScores] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return;
    }

    setUser(data.user);

    if (data.user) {
      fetchScores(data.user.id);
    }
  };

  const fetchScores = async (userId: string) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setScores(data || []);
  };

  const addScore = async () => {
    if (!user) {
      alert("User not loaded");
      return;
    }

    const newScore = parseInt(score);

    if (isNaN(newScore)) {
      alert("Enter valid number");
      return;
    }

    if (newScore < 1 || newScore > 45) {
      alert('Score must be between 1–45');
      return;
    }

    // Insert score
    const { error } = await supabase.from('scores').insert([
      {
        user_id: user.id,
        score: newScore,
        played_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    // Fetch latest scores
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Keep only last 5
    if (data && data.length > 5) {
      const idsToDelete = data.slice(5).map((s) => s.id);

      await supabase
        .from('scores')
        .delete()
        .in('id', idsToDelete);
    }

    setScore('');
    fetchScores(user.id);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Scores</h1>

      <div className="mt-4">
        <input
          className="border p-2"
          placeholder="Enter score (1-45)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <button
          onClick={addScore}
          className="ml-2 bg-black text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Scores</h2>

        {scores.length === 0 ? (
          <p className="mt-2 text-gray-500">No scores yet</p>
        ) : (
          scores.map((s) => (
            <p key={s.id} className="mt-1">
              {s.score} — {new Date(s.played_at).toLocaleDateString()}
            </p>
          ))
        )}
      </div>
    </div>
  );
}