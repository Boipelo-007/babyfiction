// This page redirects to the main app page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-xl text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
