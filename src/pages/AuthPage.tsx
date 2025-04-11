
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { registerUser } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Login form state
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerCredentials, setRegisterCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterCredentials({
      ...registerCredentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginCredentials.username, loginCredentials.password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    // Validate password match
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      setRegisterError("Passwords don't match");
      return;
    }

    try {
      await registerUser(
        registerCredentials.username,
        registerCredentials.email,
        registerCredentials.password
      );
      
      toast({
        title: "Registration Successful",
        description: "You can now log in with your credentials",
      });
      
      setActiveTab('login');
      setLoginCredentials({
        username: registerCredentials.username,
        password: ''
      });
    } catch (error) {
      setRegisterError("Registration failed. Username or email may already be in use.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-6 py-12 flex justify-center items-center">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username"
                        name="username"
                        placeholder="Enter your username" 
                        value={loginCredentials.username}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password"
                        name="password"
                        type="password" 
                        placeholder="Enter your password"
                        value={loginCredentials.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-anime-purple hover:bg-anime-purple/90"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    {registerError && (
                      <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                        {registerError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username"
                        name="username"
                        placeholder="Choose a username" 
                        value={registerCredentials.username}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email" 
                        placeholder="Enter your email"
                        value={registerCredentials.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password"
                        name="password"
                        type="password" 
                        placeholder="Create a password"
                        value={registerCredentials.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password" 
                        placeholder="Confirm your password"
                        value={registerCredentials.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-anime-purple hover:bg-anime-purple/90"
                    >
                      Register
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
