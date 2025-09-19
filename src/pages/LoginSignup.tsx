import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginSignup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/role-selection`
        }
      });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Failed", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    setShowOtp(true);
    toast({
      title: "OTP Sent",
      description: "Check your phone for the verification code",
    });
  };

  const handleSignup = () => {
    // For now, redirect to role selection
    navigate("/role-selection");
  };

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    navigate("/role-selection");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Welcome to CareConnect</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter your mobile number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg elderly-focus"
                    maxLength={10}
                  />
                  <Button 
                    className="w-full mt-2 btn-elderly" 
                    onClick={handleSendOtp}
                    disabled={showOtp}
                  >
                    {showOtp ? "OTP Sent" : "Send OTP"}
                  </Button>
                </div>
                
                {showOtp && (
                  <div>
                    <Input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-lg elderly-focus"
                      maxLength={6}
                    />
                    <div className="flex items-center mt-2">
                      <input type="checkbox" id="captcha" className="mr-2" />
                      <label htmlFor="captcha" className="text-sm">I'm not a robot</label>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full btn-elderly bg-primary" 
                  onClick={handleSignup}
                  disabled={!showOtp || !otp}
                >
                  Create Account
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">or</div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full btn-elderly"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign up with Google"}
                  </Button>
                  <Button variant="outline" className="w-full btn-elderly">
                    Sign up with Email
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <Input
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg elderly-focus"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-lg elderly-focus"
                />
                <Button 
                  className="w-full btn-elderly bg-primary" 
                  onClick={handleLogin}
                >
                  Login
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">or</div>
                
                <Button 
                  variant="outline" 
                  className="w-full btn-elderly"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in with Google"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignup;