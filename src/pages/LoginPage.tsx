import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Music } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter username and password',
        variant: 'destructive'
      });
      return;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast({
        title: 'Invalid Username',
        description: 'Username can only contain letters, numbers, and underscores',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(username, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Logged in successfully'
      });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">Dhun</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your username to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
