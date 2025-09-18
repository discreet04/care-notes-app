import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Heart, UserPlus } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">How will you be using CareConnect?</p>
        </div>

        <div className="grid gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
            onClick={() => navigate("/patient")}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I am a Patient</CardTitle>
              <CardDescription className="text-lg">
                Track my medications, log symptoms, and connect with my caretaker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-elderly bg-primary">
                Continue as Patient
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
            onClick={() => navigate("/caretaker")}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I am a Caretaker</CardTitle>
              <CardDescription className="text-lg">
                Monitor patients, manage medications, and provide remote care support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-elderly bg-primary">
                Continue as Caretaker
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50 opacity-50"
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription className="text-lg">
                Additional roles will be available in future updates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;