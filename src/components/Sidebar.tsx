import { Button } from "@/components/ui/button";
import { X, Home, Activity, MessageCircle, UserPlus, LogOut, RotateCcw, Users, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: "patient" | "caretaker";
}

const Sidebar = ({ isOpen, onClose, currentRole }: SidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out"
    });
    navigate("/");
    onClose();
  };

  const handleChangeRole = () => {
    const newRole = currentRole === "patient" ? "caretaker" : "patient";
    navigate(`/${newRole}`);
    onClose();
    toast({
      title: "Role Changed",
      description: `Switched to ${newRole} view`
    });
  };

  const patientMenuItems = [
    { icon: Home, label: "Home & Medications", value: "medications" },
    { icon: Activity, label: "Symptoms", value: "symptoms" },
    { icon: MessageCircle, label: "AI Assistant", value: "assistant" },
    { icon: UserPlus, label: "Add Caretaker", value: "caretaker" }
  ];

  const caretakerMenuItems = [
    { icon: Users, label: "My Patients", value: "patients" },
    { icon: Heart, label: "Patient Invitations", value: "invitations" }
  ];

  const menuItems = currentRole === "patient" ? patientMenuItems : caretakerMenuItems;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-card border-r z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-primary">CareConnect</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="elderly-focus"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Role Badge */}
          <div className="p-4 border-b">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Current Role</p>
              <p className="font-semibold text-primary capitalize">{currentRole}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Menu
            </h3>
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className="w-full justify-start text-left elderly-focus hover:bg-secondary"
                onClick={() => {
                  // Handle navigation within the dashboard
                  onClose();
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start elderly-focus"
              onClick={handleChangeRole}
            >
              <RotateCcw className="h-5 w-5 mr-3" />
              Change to {currentRole === "patient" ? "Caretaker" : "Patient"}
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start elderly-focus"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;