import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="elderly-focus flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          Change to Hindi
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              CareConnect
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Simple steps lead to compounding results
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help senior citizens manage medications and track symptoms with their caretakers
            </p>
          </div>

          {/* Hero Gallery Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <p className="text-sm text-muted-foreground">Caring caretakers helping seniors</p>
            </div>
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👵</span>
              </div>
              <p className="text-sm text-muted-foreground">Elderly care with dignity</p>
            </div>
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">❤️</span>
              </div>
              <p className="text-sm text-muted-foreground">Health monitoring made simple</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="btn-elderly bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl"
            onClick={() => navigate("/login")}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;