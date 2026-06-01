import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { mockUser } from '@/mocks/gameRounds';
import { X, Eye, EyeOff } from 'lucide-react';

export const LoginModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUserStore();
  const { showToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    await new Promise(r => setTimeout(r, 1500));

    login(mockUser);
    showToast('Welcome back, QuickPlayer!', 'success');
    setIsLoading(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-qp-primary rounded-lg text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
      >
        Login
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-qp-card border border-qp-border rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b border-qp-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-qp-text">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-qp-muted hover:text-qp-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Phone Number"
            prefix="+"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="254712345678"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-qp-muted"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {isRegister && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            {isRegister ? 'Create Account' : 'Login'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-qp-primary hover:underline"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

          <div className="pt-2 border-t border-qp-border">
            <p className="text-xs text-qp-muted text-center">
              By continuing, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
