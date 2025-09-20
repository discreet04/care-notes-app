import {
  Home,
  Pill,
  Activity,
  User,
  AlertTriangle,
  Bot
} from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useLanguage();
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
        <Button
          variant="ghost"
          onClick={() => onTabChange("home")}
          className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            activeTab === "home" ? "bg-primary/10 text-primary" : "text-gray-500"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Home</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("wellness")}
          className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            activeTab === "wellness" ? "bg-primary/10 text-primary" : "text-gray-500"
          }`}
        >
          <Activity className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Wellness</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("ai-helper")}
          className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            activeTab === "ai-helper" ? "bg-primary/10 text-primary" : "text-gray-500"
          }`}
        >
          <Bot className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">AI Helper</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("profile")}
          className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            activeTab === "profile" ? "bg-primary/10 text-primary" : "text-gray-500"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Profile</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onTabChange("panic")}
          className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            activeTab === "panic" ? "bg-destructive/10 text-destructive" : "text-gray-500"
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
          <span className="text-xs font-medium mt-1">Panic</span>
        </Button>
      </nav>
    </div>
  );
};

export default BottomNavigation;
