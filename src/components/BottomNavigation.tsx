import { Home, Activity, MessageCircle, User, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: "home", icon: Home, label: t("home"), color: "text-medication-primary" },
    { id: "symptoms", icon: Activity, label: t("symptoms"), color: "text-muted-foreground" },
    { id: "ai-helper", icon: MessageCircle, label: t("aiHelper"), color: "text-muted-foreground" },
    { id: "profile", icon: User, label: t("profile"), color: "text-muted-foreground" },
    { id: "panic", icon: AlertTriangle, label: t("panic"), color: "text-destructive" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-1">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-[64px] ${
                isActive ? 'bg-secondary' : 'hover:bg-secondary/50'
              }`}
            >
              <item.icon 
                className={`h-6 w-6 mb-1 ${
                  isActive ? item.color : 'text-muted-foreground'
                }`} 
              />
              <span className={`text-xs font-medium ${
                isActive ? item.color : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;