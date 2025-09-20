import {
  Home,
  Activity,
  MessageCircle,
  User,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useLanguage();

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "symptoms", icon: Activity, label: "Symptoms" },
    { id: "ai-helper", icon: MessageCircle, label: "AI Helper" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "panic", icon: AlertTriangle, label: "Panic" },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-100 shadow-lg p-2"
      style={{
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <nav className="flex justify-around items-center h-full">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => onTabChange(item.id)}
                  className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
                    activeTab === item.id ? "bg-primary/10 text-primary" : "text-gray-500"
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t(item.id)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default BottomNavigation;
