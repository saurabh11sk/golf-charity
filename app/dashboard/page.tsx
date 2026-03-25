// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { useRouter } from 'next/navigation';

// export default function Dashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const handleLogout = async () => {
//   await supabase.auth.signOut();
//   router.push('/auth/login');   
// };

//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();

//       if (!data.user) {
//         router.push('/auth/login');
//       } else {
//         setUser(data.user);
//       }
//     };

//     getUser();
//   }, []);

//   return (
//     <div className="p-10">
//       <h1>Dashboard</h1>
//       {user && <p>Welcome: {user.email}</p>}
//       <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2">
//         Logout
//       </button>
//       <a href="/dashboard/scores" className="block mt-4 text-blue-500">
//         Go to Scores
//         </a>
//         <a href="/admin/draw" className="block mt-2 text-blue-500">
//         Admin Draw Panel
//         </a>
//         <a href="/dashboard/charity" className="block mt-2 text-blue-500">
//         Select Charity
//         </a>
//         <a href="/dashboard/result" className="block mt-2 text-blue-500">
//         View Results
//         </a>
//     </div>

    
//   );
// }

'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Logout
      </button>

      <div className="grid grid-cols-2 gap-4">
        <a href="/dashboard/scores" className="bg-white p-4 rounded shadow hover:bg-gray-50">
          📊 Scores
        </a>

        <a href="/admin/draw" className="bg-white p-4 rounded shadow hover:bg-gray-50">
          🎯 Draw Panel
        </a>

        <a href="/dashboard/charity" className="bg-white p-4 rounded shadow hover:bg-gray-50">
          ❤️ Charity
        </a>

        <a href="/dashboard/result" className="bg-white p-4 rounded shadow hover:bg-gray-50">
          🏆 Results
        </a>
      </div>
    </div>
  );
}