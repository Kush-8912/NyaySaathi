'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { loginWithEmail } from '@/lib/firebase/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginWithEmail(data.email, data.password);
      toast.success('Welcome back! Great to see you again.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes('invalid-credential')
        ? 'Invalid email or password.' : 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1.5px solid var(--border-default)',
    borderRadius: 10, color: 'var(--text-primary)', padding: '0.8rem 1rem 0.8rem 2.75rem',
    fontSize: '0.95rem', fontFamily: "'Outfit', sans-serif", outline: 'none',
  };
  const iconStyle: React.CSSProperties = { position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' as const };
  const errorStyle: React.CSSProperties = { color: '#F87171', fontSize: '0.78rem', marginTop: '0.3rem' };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={15} style={iconStyle} />
          <input {...register('email')} type="email" placeholder="aap@company.in" style={inputStyle} />
        </div>
        {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={15} style={iconStyle} />
          <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.75rem' }} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--saffron-light)', fontWeight: 600 }}>Forgot password?</Link>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.85rem', fontSize: '0.95rem', borderRadius: 10, marginTop: '0.25rem', opacity: isSubmitting ? 0.6 : 1 }}>
        {isSubmitting ? 'Signing in...' : 'Sign In →'}
      </button>
    </form>
  );
}
