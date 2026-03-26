export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      
      <h1 className="text-2xl font-bold">Welcome to Golf Charity</h1>

      <a href="/auth/login" className="text-blue-500 text-lg">
        Login
      </a>

      <a href="/auth/signup" className="text-blue-500 text-lg">
        Signup
      </a>

    </div>
  );
}