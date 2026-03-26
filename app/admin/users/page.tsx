// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [profile, setProfile] = useState<any>(null);
//   const updateRole = async (id: string, role: string) => {
//       await supabase
//         .from("profiles")
//         .update({ role })
//         .eq("id", id);

//       location.reload();
//     };

//   useEffect(() => {
//     const fetchData = async () => {
//       // ✅ get current user
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       // ✅ check admin
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();

//       setProfile(profileData);

//       // ✅ fetch users
//       const { data } = await supabase
//         .from("profiles")
//         .select("*")
//         .order("created_at", { ascending: false });

//       setUsers(data || []);
//     };

//     fetchData();
//   }, []);

//   if (profile && profile.role !== "admin") {
//     return <div className="p-6 text-red-500">Access Denied</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">All Users</h1>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Email</th>
//             <th className="p-2 border">Role</th>
//             <th className="p-2 border">Created At</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user: any) => (
//             <tr key={user.id}>
//               <td className="p-2 border">{user.name}</td>
//               <td className="p-2 border">{user.email}</td>
//               <td className="p-2 border">{user.role}</td>
//               <td className="p-2 border">
//                 {new Date(user.created_at).toLocaleDateString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // ✅ Update role
  const updateRole = async (id: string, role: string) => {
    await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);

    location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // ✅ check admin
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // ✅ fetch users
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setUsers(data || []);
    };

    fetchData();
  }, []);

  // ❌ block non-admin
  if (profile && profile.role !== "admin") {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2 border g-gray-200 text-black">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                {new Date(user.created_at).toLocaleDateString()}
              </td>

              {/* ✅ ACTION BUTTON */}
              <td className="p-2 border">
                {user.role === "admin" ? (
                  <button
                    onClick={() => updateRole(user.id, "user")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove Admin
                  </button>
                ) : (
                  <button
                    onClick={() => updateRole(user.id, "admin")}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Make Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}