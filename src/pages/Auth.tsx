import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_EMAIL = 'mohammedmubashirali658@gmail.com';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset' | 'signup'>('login');
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryType = url.searchParams.get('type');
    const hashType = hashParams.get('type');
    const accessToken = hashParams.get('access_token') || url.searchParams.get('access_token');
    
    if (queryType === 'recovery' || hashType === 'recovery' || accessToken) {
      setMode('reset');
      setIsRecoverySession(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        setIsRecoverySession(true);
      } else if (event === 'SIGNED_IN' && session && !isRecoverySession) {
        if (session.user.email === ADMIN_EMAIL) {
          navigate('/admin');
        }
      }
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email === ADMIN_EMAIL && mode !== 'reset' && !isRecoverySession) {
        navigate('/admin');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate, mode, isRecoverySession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Access denied. Only admin can login.');
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: 'Welcome back, Admin!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Access denied. Only admin email can be registered.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) throw error;
      
      toast({ 
        title: 'Admin account created!', 
        description: 'You can now login with your credentials.' 
      });
      setMode('login');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Access denied. Only admin can reset password.');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      toast({ 
        title: 'Reset link sent!', 
        description: 'Check your email for the password reset link.' 
      });
      setMode('login');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      toast({ title: 'Password updated!', description: 'You can now login with your new password.' });
      setMode('login');
      setNewPassword('');
      setIsRecoverySession(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        
        <div className="glass-card p-8">
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            {mode === 'login' && 'Admin Login'}
            {mode === 'signup' && 'Create Admin Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'reset' && 'Set New Password'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {mode === 'login' && 'Sign in to manage your portfolio'}
            {mode === 'signup' && 'Create your admin account'}
            {mode === 'forgot' && 'Enter your email to receive a reset link'}
            {mode === 'reset' && 'Enter your new password'}
          </p>

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/30"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full btn-hero-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="w-full text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3 h-3" /> Create Admin Account
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/30"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full btn-hero-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to login
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/30"
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-hero-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to login
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full btn-hero-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
