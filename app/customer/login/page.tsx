'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/customer/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to continue');
      }

      toast.success(mode === 'login' ? 'Login successful' : 'Account created');
      router.push('/customer/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to continue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-forest-950">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-forest-800 dark:text-white">
              Customer {mode === 'login' ? 'Login' : 'Registration'}
            </CardTitle>
            <CardDescription>View your booking and stay status</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <Label>Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                      <Input className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </>
              )}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                  <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                  <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white" disabled={isLoading}>
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
              </Button>
            </form>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="w-full mt-4 text-sm text-forest-600 hover:underline"
            >
              {mode === 'login' ? 'Create a customer account' : 'Already have an account? Login'}
            </button>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-forest-500 hover:underline">Back to home</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
