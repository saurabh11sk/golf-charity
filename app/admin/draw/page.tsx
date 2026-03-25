'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DrawPage() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const generateDraw = () => {
    let nums = [];
    for (let i = 0; i < 5; i++) {
      nums.push(Math.floor(Math.random() * 45) + 1);
    }
    setNumbers(nums);
  };

  const saveDraw = async () => {
    setLoading(true);

    await supabase.from('draws').insert([
      {
        draw_month: new Date().toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        }),
        numbers,
        status: 'published',
      },
    ]);

    setLoading(false);
    alert('Draw saved!');
  };

  return (
    <div className="p-10">
      <h1>Draw System</h1>

      <button onClick={generateDraw} className="bg-black text-white p-2">
        Generate Draw
      </button>

      <div className="mt-4">
        {numbers.length > 0 && <p>Numbers: {numbers.join(', ')}</p>}
      </div>

      <button
        onClick={saveDraw}
        className="mt-4 bg-green-500 text-white p-2"
        disabled={loading}
      >
        Save Draw
      </button>
    </div>
  );
}