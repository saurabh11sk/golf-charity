// 'use client';

// import { supabase } from '@/lib/supabaseClient';
// import { useRouter } from 'next/navigation';

// export default function Dashboard() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/auth/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-10 text-black">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white px-4 py-2 rounded mb-6"
//       >
//         Logout
//       </button>

//       <div className="grid grid-cols-2 gap-4">
//         <a href="/dashboard/scores" className="bg-white text-black p-4 rounded shadow hover:bg-gray-200">
//           📊 Scores
//         </a>

//         <a href="/admin/draw" className="bg-white text-black p-4 rounded shadow hover:bg-gray-200">
//           🎯 Draw Panel
//         </a>

//         <a href="/dashboard/charity" className="bg-white text-black p-4 rounded shadow hover:bg-gray-200">
//           ❤️ Charity
//         </a>

//         <a href="/dashboard/result" className="bg-white text-black p-4 rounded shadow hover:bg-gray-200">
//           🏆 Results
//         </a>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function DashboardPage() {
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<any>(null);
//   const [scores, setScores] = useState<any[]>([]);
//   const [winnings, setWinnings] = useState<any[]>([]);
//         const handleLogout = async () => {
//         await supabase.auth.signOut();
//         window.location.href = "/auth/login";
//       };

//   useEffect(() => {
//     const getData = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       setUser(user);

//       // ✅ Fetch profile
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();

//       setProfile(profileData);

//       // ✅ Fetch scores
//       const { data: scoresData } = await supabase
//         .from("scores")
//         .select("*")
//         .eq("user_id", user.id);

//       setScores(scoresData || []);

//       // ✅ Fetch winnings
//       const { data: winData } = await supabase
//         .from("winners")
//         .select("*")
//         .eq("user_id", user.id);

//       setWinnings(winData || []);


//     };

//     getData();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white px-4 py-2 mb-4"
//       >
//         Logout
//       </button>

//       <div className="mb-4">
//         <p><strong>Email:</strong> {user?.email}</p>
//         <p><strong>Subscription:</strong> {profile?.subscription || "free"}</p>

//         <button
//           onClick={async () => {
//             if (!user) return;

//             await supabase
//               .from("profiles")
//               .update({ subscription: "premium" })
//               .eq("id", user.id);

//             location.reload();
//           }}
//           className="bg-green-500 text-white px-4 py-2 mt-2"
//         >
//           Upgrade to Premium
//         </button>
//       </div>

//       <div className="mb-4">
//         <h2 className="font-semibold">Participation</h2>
//         <p>Total Attempts: {scores.length}</p>
//       </div>

//       <div className="mb-4">
//         <h2 className="font-semibold">Winnings</h2>
//         <p>Total Wins: {winnings.length}</p>
//       </div>

//       <div className="mb-4">
//         <h2 className="font-semibold">Charity Contribution</h2>
//         <p>Default: 10%</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [winnings, setWinnings] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      // profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // scores
      const { data: scoresData } = await supabase
        .from("scores")
        .select("*")
        .eq("user_id", user.id);

      setScores(scoresData || []);

      // winnings
      const { data: winData } = await supabase
        .from("winners")
        .select("*")
        .eq("user_id", user.id);

      setWinnings(winData || []);
    };

    getData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      
      {/* 🔹 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* 🔹 USER INFO */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Email:</strong> {user?.email}</p>
        <p className="mt-2">
          <strong>Subscription:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-white ${
              profile?.subscription === "premium"
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          >
            {profile?.subscription || "free"}
          </span>
        </p>

        {profile?.subscription !== "premium" && (
          <button
            onClick={async () => {
              await supabase
                .from("profiles")
                .update({ subscription: "premium" })
                .eq("id", user.id);

              location.reload();
            }}
            className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
          >
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">🎯 Attempts</p>
          <h2 className="text-2xl font-bold">{scores.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">🏆 Wins</p>
          <h2 className="text-2xl font-bold">{winnings.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">❤️ Charity</p>
          <h2 className="text-2xl font-bold">10%</h2>
        </div>
      </div>

      {/* 🔹 NAVIGATION */}
      <div className="grid grid-cols-2 gap-4">

        <a href="/dashboard/scores" className="bg-white p-5 rounded shadow hover:bg-gray-200 text-center">
          📊 Scores
        </a>



        <a href="/dashboard/charity" className="bg-white p-5 rounded shadow hover:bg-gray-200 text-center">
          ❤️ Charity
        </a>

        <a href="/dashboard/result" className="bg-white p-5 rounded shadow hover:bg-gray-200 text-center">
          🏆 Results
        </a>

        {profile?.role === "admin" && (
          <div className="mt-8">
            
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              🔧 Admin Panel
            </h2>

            <div className="grid grid-cols-2 gap-4">
              
              <a
                href="/admin/users"
                className="bg-blue-100 p-5 rounded shadow hover:bg-blue-200 text-center"
              >
                👥 Manage Users
              </a>

              <a
                href="/admin/charities"
                className="bg-pink-100 p-5 rounded shadow hover:bg-pink-200 text-center"
              >
                ❤️ Manage Charities
              </a>

              <a
                href="/admin/winners"
                className="bg-green-100 p-5 rounded shadow hover:bg-green-200 text-center"
              >
                🏆 Verify Winners
              </a>

              <a
                href="/admin/draw"
                className="bg-yellow-100 p-5 rounded shadow hover:bg-yellow-200 text-center"
              >
                🎯 Draw Panel
              </a>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}