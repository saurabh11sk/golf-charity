'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResultPage() {
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [draw, setDraw] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    setUser(data.user);

    // Get scores
    const { data: scoreData } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', data.user.id)
      .order('played_at', { ascending: false })
      .limit(5);

    const userScores = scoreData?.map((s) => s.score) || [];
    setScores(userScores);

    // Get latest draw
    const { data: drawData } = await supabase
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (drawData && drawData.length > 0) {
      const drawNumbers = drawData[0].numbers;
      setDraw(drawNumbers);

      // Match logic
      const matchCount = userScores.filter((s) =>
        drawNumbers.includes(s)
      ).length;

      setMatches(matchCount);

      // ✅ Save winner (only if >= 3)
      if (matchCount >= 3) {
        await supabase.from('winners').insert([
          {
            user_id: data.user.id,
            draw_id: drawData[0].id,
            match_count: matchCount,
            prize_amount: 0,
            status: 'pending',
          },
        ]);
      }
    }
  };

  return (
    <div className="p-10">
      <h1>Results</h1>

      <p>Your Scores: {scores.join(', ')}</p>
      <p>Draw Numbers: {draw.join(', ')}</p>

      <h2 className="mt-4">Matches: {matches}</h2>

      {matches >= 3 && <p>🎉 You are a winner!</p>}
    </div>
  );
}