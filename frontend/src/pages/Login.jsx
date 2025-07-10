import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUserStore } from '../store/userStore';

// UI组件
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithDemo } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('登录成功');
      navigate('/');
    } catch (error) {
      toast.error('登录失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithDemo();
      toast.success('演示账户登录成功');
      navigate('/');
    } catch (error) {
      toast.error('演示登录失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 检测部署平台
  const detectDeployPlatform = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('vercel.app')) {
      return 'Vercel';
    } else if (hostname.includes('pages.dev')) {
      return 'Cloudflare Pages';
    } else if (hostname.includes('web.app') || hostname.includes('firebaseapp.com')) {
      return 'Firebase';
    }
    return null;
  };

  const deployPlatform = detectDeployPlatform();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {deployPlatform && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-200">
              {deployPlatform}部署版本
            </span>
          </div>
        )}
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">SubScribe</CardTitle>
            <CardDescription className="text-center">
              登录您的订阅管理账户
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  电子邮箱
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    密码
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    忘记密码?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800">或</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              使用演示账户登录
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 w-full">
              还没有账户?{' '}
              <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                注册
              </a>
            </p>
          </CardFooter>
        </Card>
        
        {deployPlatform && (
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>当前通过{deployPlatform}一键部署</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a 
                href="https://github.com/RY-zzcn/SubScribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                GitHub
              </a>
              <a 
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRY-zzcn%2FSubScribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                部署到Vercel
              </a>
              <a 
                href="https://deploy.workers.cloudflare.com/?url=https://github.com/RY-zzcn/SubScribe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                部署到Cloudflare
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 