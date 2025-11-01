import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to JARVIS page by default
    router.push('/jarvis');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">JARVIS & VibeAI</h1>
        <p className="text-gray-400">Redirecting to JARVIS...</p>
      </div>
    </div>
  );
}
