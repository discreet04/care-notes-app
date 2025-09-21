import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Clock, AlertTriangle, HelpCircle, Heart, Thermometer, Activity, User, Camera, Edit, Phone, MapPin, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LanguageToggle from "@/components/LanguageToggle";
import EnhancedAIChat from "@/components/AIChat";
import { calculateTimeUntilDose, getMedicationStatus } from "@/utils/medicationTimer";
import elderlyYoga from "@/assets/elderly-yoga.jpg";
import ayurvedicHerbs from "@/assets/ayurvedic-herbs.jpg";
import familyProfile from "@/assets/family-profile.jpg";
import healthSymbols from "@/assets/health-symbols.jpg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DAILY_TIPS = [
  "Drink at least 8 glasses of water today.",
  "Take a 15-minute walk after lunch.",
  "Include one serving of vegetables in every meal.",
  "Do 5 minutes of deep breathing exercises."
];

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState([
    { id: 1, name: "Blood Pressure", value: "120/80", status: "normal", icon: Heart, color: "text-green-600" },
    { id: 2, name: "Temperature", value: "98.6°F", status: "normal", icon: Thermometer, color: "text-blue-600" },
    { id: 3, name: "Heart Rate", value: "72 BPM", status: "normal", icon: Activity, color: "text-green-600" }
  ]);
  const [dailyTip, setDailyTip] = useState<string>("");

  const { toast } = useToast();
  const { t } = useLanguage();

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    instructions: ""
  });

  useEffect(() => {
    const tip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    setDailyTip(tip);
  }, []);

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMedications(prev => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddMedication = () => {
    if (!medicationForm.name || !medicationForm.dosage || !medicationForm.frequency) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const newMedication = {
      id: Date.now(),
      ...medicationForm,
      takenHistory: Array(7).fill(false)
    };
    
    setMedications([...medications, newMedication]);
    setMedicationForm({ name: "", dosage: "", frequency: "", time: "", instructions: "" });
    setShowMedicationForm(false);
    
    toast({ title: "Medication Added", description: `${medicationForm.name} has been added` });
  };

  const toggleMedicationTaken = (id: number) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        const todayTaken = med.takenHistory[0] || false;
        const updatedHistory = [!todayTaken, ...med.takenHistory.slice(1, 7)];
        return { ...med, takenHistory: updatedHistory };
      }
      return med;
    }));
  };

  const requestCaretakerHelp = () => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    toast({ title: t('needHelp'), description: t('callCaretaker') });
  };

  const renderHomeContent = () => (
    <div className="space-y-6 pb-[80px]">
      {/* Daily AI Health Tip */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">💡 Daily Health Tip</h3>
          <p className="text-sm">{dailyTip}</p>
        </CardContent>
      </Card>

      {/* Medication Form */}
      {showMedicationForm && (
        <Card className="border-2 border-teal-200 bg-teal-50">
          <CardHeader>
            <CardTitle className="text-lg text-teal-700">{t('addNewMedicationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium">{t('medicationName')}</Label>
              <Input id="name" placeholder={t('medicationNamePlaceholder')} value={medicationForm.name} onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })} className="elderly-focus text-base p-3 rounded-xl border-2" />
            </div>
            <div>
              <Label htmlFor="dosage" className="text-base font-medium">{t('dosage')}</Label>
              <Input id="dosage" placeholder={t('dosagePlaceholder')} value={medicationForm.dosage} onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })} className="elderly-focus text-base p-3 rounded-xl border-2" />
            </div>
            <div>
              <Label htmlFor="frequency" className="text-base font-medium">{t('frequency')}</Label>
              <Input id="frequency" placeholder={t('frequencyPlaceholder')} value={medicationForm.frequency} onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })} className="elderly-focus text-base p-3 rounded-xl border-2" />
            </div>
            <div>
              <Label htmlFor="time" className="text-base font-medium">{t('reminderTime')}</Label>
              <Input id="time" type="time" value={medicationForm.time} onChange={(e) => setMedicationForm({ ...medicationForm, time: e.target.value })} className="elderly-focus text-base p-3 rounded-xl border-2" />
            </div>
            <div>
              <Label htmlFor="instructions" className="text-base font-medium">{t('instructions')}</Label>
              <Textarea id="instructions" placeholder={t('instructionsPlaceholder')} value={medicationForm.instructions} onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })} className="elderly-focus text-base p-3 rounded-xl border-2 min-h-[100px]" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddMedication} className="bg-teal-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-teal-700">{t('addMedication')}</Button>
              <Button variant="outline" onClick={() => setShowMedicationForm(false)} className="px-8 py-3 rounded-xl text-base border-2">{t('cancel')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications List */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-50 border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-teal-700 flex items-center gap-3">
              <Pill className="h-6 w-6" /> {t('todaysMedications')}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setShowMedicationForm(!showMedicationForm)} className="bg-teal-600 text-white hover:bg-teal-700 rounded-full px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('addNewMedication')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{t('addNewMedication')}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="h-8 w-8 text-teal-700 mx-auto mb-2" />
              <p className="text-lg text-muted-foreground mb-2">{t('noMedicationsYet')}</p>
              <p className="text-sm text-muted-foreground">Add your first medication to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{med.name}</h3>
                      <p className="text-muted-foreground font-medium">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-2 p-2 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                          <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="text-sm text-orange-600 font-medium">{med.instructions}</span>
                        </div>
                      )}
                      {/* Weekly Compliance Tracker */}
                      <div className="flex items-center gap-1 mt-2">
                        {Array(7).fill(0).map((_, i) => (
                          <span key={i} className={`w-3 h-3 rounded-full ${med.takenHistory?.[i] ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-teal-700 mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{med.time || "No time set"}</span>
                      </div>
                      {med.time && (
                        <div className={`text-xs px-3 py-1 rounded-full mb-3 font-medium ${
                          getMedicationStatus(med.time) === 'urgent' ? 'bg-red-100 text-red-800' :
                          getMedicationStatus(med.time) === 'soon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {calculateTimeUntilDose(med.time)}
                        </div>
                      )}
                      {/* Taken Button Toggle */}
                      <Button size="sm" onClick={() => toggleMedicationTaken(med.id)}
                        className={`rounded-full px-4 ${med.takenHistory?.[0] ? 'bg-green-600 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                      >
                        {med.takenHistory?.[0] ? "Taken" : "Mark Taken"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panic Button */}
      <Button onClick={requestCaretakerHelp} className="w-full bg-red-500 text-white py-3 mt-4 rounded-xl flex items-center justify-center gap-2">
        <AlertTriangle className="h-6 w-6" /> Emergency Panic
      </Button>
    </div>
  );

  const renderContent = () => {
    switch(activeTab){
      case "home": return renderHomeContent();
      case "symptoms": return (
        <div className="space-y-4 pb-[80px]">
          {/* Add your original symptoms section here */}
        </div>
      );
      case "ai-helper": return <EnhancedAIChat />;
      case "profile": return (
        <div className="space-y-4 pb-[80px]">
          {/* Add your original profile section here */}
        </div>
      );
      case "panic": 
        requestCaretakerHelp();
        return <div className="text-center mt-6">Panic mode activated!</div>;
      default: return renderHomeContent();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-[80px]">
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="elderly-focus">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">{t(activeTab)}</h1>
        <LanguageToggle />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="patient" />

      <div className="p-4">{renderContent()}</div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default PatientDashboard;
