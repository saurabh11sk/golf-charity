// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// export default function ResultPage() {
//   const [user, setUser] = useState<any>(null);
//   const [scores, setScores] = useState<number[]>([]);
//   const [draw, setDraw] = useState<number[]>([]);
//   const [matches, setMatches] = useState(0);

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     const { data } = await supabase.auth.getUser();
//     if (!data.user) return;

//     setUser(data.user);

//     // Get scores
//     const { data: scoreData } = await supabase
//       .from('scores')
//       .select('score')
//       .eq('user_id', data.user.id)
//       .order('played_at', { ascending: false })
//       .limit(5);

//     const userScores = scoreData?.map((s) => s.score) || [];
//     setScores(userScores);

//     // Get latest draw
//     const { data: drawData } = await supabase
//       .from('draws')
//       .select('*')
//       .order('created_at', { ascending: false })
//       .limit(1);

//     if (drawData && drawData.length > 0) {
//       const drawNumbers = drawData[0].numbers;
//       setDraw(drawNumbers);

//       // Match logic
//       const matchCount = userScores.filter((s) =>
//         drawNumbers.includes(s)
//       ).length;

//       setMatches(matchCount);

//       // ✅ Save winner (only if >= 3)
//       if (matchCount >= 3) {
//         await supabase.from('winners').insert([
//           {
//             user_id: data.user.id,
//             draw_id: drawData[0].id,
//             match_count: matchCount,
//             prize_amount: 0,
//             status: 'pending',
//           },
//         ]);
//       }
//     }
//   };

//   return (
//     <div className="p-10">
//       <h1>Results</h1>

//       <p>Your Scores: {scores.join(', ')}</p>
//       <p>Draw Numbers: {draw.join(', ')}</p>

//       <h2 className="mt-4">Matches: {matches}</h2>

//       {matches >= 3 && <p>🎉 You are a winner!</p>}
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResultPage() {
  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [draw, setDraw] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    setUser(data.user);

    // ✅ Get scores
    const { data: scoreData } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", data.user.id)
      .order("played_at", { ascending: false })
      .limit(5);

    const userScores = scoreData?.map((s) => s.score) || [];
    setScores(userScores);

    // ✅ Get latest draw
    const { data: drawData } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (!drawData || drawData.length === 0) return;

    const drawNumbers = drawData[0].numbers;
    setDraw(drawNumbers);

    // ✅ Match logic
    const matchCount = userScores.filter((s) =>
      drawNumbers.includes(s)
    ).length;

    setMatches(matchCount);

    // ✅ Check if already winner (avoid duplicates)
    const { data: existing } = await supabase
      .from("winners")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("draw_id", drawData[0].id)
      .maybeSingle();

    if (existing) {
      setWinnerId(existing.id);
      return;
    }

    // ✅ Insert winner if eligible
    if (matchCount >= 3) {
      const { data: newWinner } = await supabase
        .from("winners")
        .insert([
          {
            user_id: data.user.id,
            draw_id: drawData[0].id,
            match_count: matchCount,
            prize_amount: 0,
            status: "pending",
          },
        ])
        .select()
        .single();

      setWinnerId(newWinner?.id);
    }
  };

  // ✅ Upload proof
  const handleUpload = async (file: File) => {
    if (!winnerId) return;

    const filePath = `${Date.now()}-${file.name}`;

    // upload to storage
    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file);

    if (uploadError) {
      console.log("Upload error:", uploadError);
      return;
    }

    // get public URL
    const { data } = supabase.storage
      .from("proofs")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // save to DB
    await supabase
      .from("winners")
      .update({ proof_image: publicUrl })
      .eq("id", winnerId);

    alert("Proof uploaded!");
    location.reload();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Results</h1>

      <p><strong>Your Scores:</strong> {scores.join(", ")}</p>
      <p><strong>Draw Numbers:</strong> {draw.join(", ")}</p>

      <h2 className="mt-4 text-lg font-semibold">
        Matches: {matches}
      </h2>

      {matches >= 3 && (
        <div className="mt-4 p-4 bg-green-100 border rounded">
          <p className="text-green-700 font-bold">
            🎉 You are a winner!
          </p>

          {/* ✅ Upload proof */}
          <input
            type="file"
            className="mt-3"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
      )}
    </div>
  );
}