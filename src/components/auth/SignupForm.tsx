'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { signupWithEmail } from '@/lib/firebase/auth';
import { createUserProfile } from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import PasswordChecklist from './PasswordChecklist';

export default function SignupForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { if (user) router.replace('/dashboard'); }, [user, router]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });
  const password = watch('password', '');

  const onSubmit = async (data: SignupInput) => {
    try {
      const cred = await signupWithEmail(data.email, data.password, data.name);
      await createUserProfile(cred.user.uid, { uid: cred.user.uid, name: data.name, email: data.email, photoURL: '', preferredLanguage: 'English', userType: 'Other' });
      toast.success('Account created! Welcome to NyaySaathi 🎉');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes('email-already-in-use')
        ? 'An account with this email already exists.' : 'Signup failed. Please try again.';
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
        <label style={labelStyle}>Full Name</label>
        <div style={{ position: 'relative' }}>
          <User size={15} style={iconStyle} />
          <input {...register('name')} type="text" placeholder="Arjun Mehta" style={inputStyle} />
        </div>
        {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
      </div>

      <div>
        <label style={labelStyle}>Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={15} style={iconStyle} />
          <input {...register('email')} type="email" placeholder="arjun@startup.in" style={inputStyle} />
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
        <PasswordChecklist password={password} />
      </div>

      <div>
        <label style={labelStyle}>Confirm Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={15} style={iconStyle} />
          <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '2.75rem' }} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.85rem', fontSize: '0.95rem', borderRadius: 10, marginTop: '0.25rem', opacity: isSubmitting ? 0.6 : 1 }}>
        {isSubmitting ? 'Creating account...' : 'Create Account →'}
      </button>
    </form>
  );
}
