'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
        },
      ]);

    if (profileError) {
      console.log(profileError);
    }
  }

  alert('Signup successful!');
};

  return (
    <div className="p-10">
      <h1>Signup</h1>
      <input
        className="border p-2 block"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 block mt-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup} className="mt-4 bg-black text-white p-2">
        Signup
      </button>
      <p className="mt-4">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-500">
          Login
        </a>
      </p>

    </div>
  );
}