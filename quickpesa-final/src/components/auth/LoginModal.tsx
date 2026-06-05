import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { loginUser, registerUser } from '@/services/api';
import { X, Eye, EyeOff, Phone } from 'lucide-react';

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('254');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUserStore();
  const { showToast } = useUIStore();

  const handleSubmit = async () => {
    if (!phone || !password) { showToast('Phone and password required', 'error'); return; }
    if (isRegister && !username) { showToast('Username required', 'error'); return; }
    if (isRegister && password !== confirmPassword) { showToast('Passwords do not match', 'error'); return; }

    setIsLoading(true);
    try {
      let token: string;
      let user: any;

      if (isRegister) {
        const res = await registerUser({ phone, username, password });
        token = res.data.token;
        user = res.data.user;
        showToast(`Welcome to QuickPesa, ${user.username}!`, 'success');
      } else {
        const res = await loginUser({ phone, password });
        token = res.data.token;
        user = res.data.user;
        showToast(`Welcome back, ${user.username}!`, 'success');
      }

      login(user, token);
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
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

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="254712345678"
                className="w-full bg-dark-800 border border-dark-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="e.g. Wanjiku254"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]" />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-dark-800 border border-dark-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green min-h-[48px]" />
            </div>
          )}

          <Button variant="primary" size="lg" fullWidth loading={isLoading} onClick={handleSubmit}>
            {isRegister ? 'Create Account' : 'Login'}
          </Button>

          <div className="text-center">
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-brand-green hover:underline">
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center pt-2 border-t border-dark-border">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
