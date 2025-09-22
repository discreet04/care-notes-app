import { Button } from "@/components/ui/button";
import { X, UserPlus, LogOut, RotateCcw, Users, Heart, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSpeech } from "@/contexts/SpeechContext";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: "patient" | "caretaker";
  onAddCaretaker?: () => void;
}

const Sidebar = ({ isOpen, onClose, currentRole, onAddCaretaker }: SidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSpeechEnabled, toggleSpeech, speak } = useSpeech();

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

  const handleMenuItemClick = (value: string) => {
    if (value === 'caretaker' && onAddCaretaker) {
      onAddCaretaker();
    }
    onClose();
  };

  const patientMenuItems = [
    { icon: UserPlus, label: "Add Caretaker", value: "caretaker", speech: "Add a new caretaker to help you." }
  ];

  const caretakerMenuItems = [
    { icon: Users, label: "My Patients", value: "patients", speech: "View your list of patients." },
    { icon: Heart, label: "Patient Invitations", value: "invitations", speech: "View pending invitations from patients." }
  ];

  const menuItems = currentRole === "patient" ? patientMenuItems : caretakerMenuItems;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full w-80 bg-card border-r z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-primary" onMouseEnter={() => speak("Care Connect Application")}>CareConnect</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="elderly-focus">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 border-b">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">Current Role</p>
              <p className="font-semibold text-primary capitalize">{currentRole}</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Menu</h3>
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className="w-full justify-start text-left elderly-focus hover:bg-secondary"
                onClick={() => handleMenuItemClick(item.value)}
                onMouseEnter={() => speak(item.speech)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2">
            <div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary"
              onMouseEnter={() => speak("Toggle text to speech narration.")}
            >
              <Label htmlFor="speech-toggle" className="flex items-center gap-3 cursor-pointer">
                <Volume2 className="h-5 w-5" />
                Accessibility Voice
              </Label>
              <Switch
                id="speech-toggle"
                checked={isSpeechEnabled}
                onCheckedChange={toggleSpeech}
              />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start elderly-focus"
              onClick={handleChangeRole}
              onMouseEnter={() => speak(`Change role to ${currentRole === "patient" ? "Caretaker" : "Patient"}`)}
            >
              <RotateCcw className="h-5 w-5 mr-3" />
              Change to {currentRole === "patient" ? "Caretaker" : "Patient"}
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start elderly-focus"
              onClick={handleSignOut}
              onMouseEnter={() => speak("Sign out of your account.")}
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
