import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { mockUser } from '@/mocks/gameRounds';
import { X, Eye, EyeOff, Phone, Mail } from 'lucide-react';

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUserStore();
  const { showToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    login(mockUser);
    showToast('Welcome to QuickPesa!', 'success');
    setIsLoading(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-brand-green rounded-lg text-sm font-semibold text-white hover:bg-brand-greenDark transition-colors">
        Login
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Method toggle */}
          <div className="flex bg-dark-900 rounded-lg p-1">
            <button type="button" onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${loginMethod === 'phone' ? 'bg-dark-700 text-white' : 'text-gray-500'}`}>
              <Phone className="w-3.5 h-3.5" /> Phone
            </button>
            <button type="button" onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${loginMethod === 'email' ? 'bg-dark-700 text-white' : 'text-gray-500'}`}>
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
          </div>

          {/* Phone/Email input - FIXED */}
          {loginMethod === 'phone' ? (
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm z-10">+</span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="254712345678"
                  className="w-full bg-dark-800 border border-dark-border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]"
                required
              />
            </div>
          )}

          {/* Password - FIXED */}
          <div className="relative">
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter password"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm password"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]"
                required
              />
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
            {isRegister ? 'Create Account' : 'Login'}
          </Button>

          <div className="text-center">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-brand-green hover:underline">
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

          <div className="pt-2 border-t border-dark-border">
            <p className="text-[11px] text-gray-500 text-center">By continuing, you agree to our Terms and Privacy Policy</p>
          </div>
        </form>
      </div>
    </div>
  );
};
