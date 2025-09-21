import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Clock, AlertTriangle, HelpCircle, Heart, Thermometer, Activity, User, Camera, Edit, Phone, MapPin, Pill, Check, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LanguageToggle from "@/components/LanguageToggle";
import EnhancedAIChat from "@/components/AIChat";
import ProgressCircle from "@/components/ui/progress-circle";
import { calculateTimeUntilDose, getMedicationStatus } from "@/utils/medicationTimer";
import elderlyYoga from "@/assets/elderly-yoga.jpg";
import ayurvedicHerbs from "@/assets/ayurvedic-herbs.jpg";
import familyProfile from "@/assets/family-profile.jpg";
import healthSymbols from "@/assets/health-symbols.jpg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LOCAL_STORAGE_KEYS = {
  SYMPTOMS: "loggedSymptoms_v1",
  MEDICATIONS: "medications_v1"
};

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
  const { toast } = useToast();
  const { t } = useLanguage();

  // Generic symptom options
  const genericSymptoms = ["Fatigue", "Headache", "Nausea", "Cough", "Dizziness", "Sore Throat", "Shortness of Breath", "Chest Pain", "Back Pain", "Insomnia"];

  // persisted state
  const [loggedSymptoms, setLoggedSymptoms] = useState<any[]>([]);
  const [newSymptom, setNewSymptom] = useState({ name: "", severity: "mild", notes: "" });

  // medication form state
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    instructions: ""
  });

  // Load persisted data on mount
  useEffect(() => {
    // Load logged symptoms
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.SYMPTOMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLoggedSymptoms(parsed);
      }
    } catch (e) {
      // invalid JSON or other issue - ignore and continue with empty state
      console.warn("Failed to load loggedSymptoms from localStorage:", e);
    }

    // Load medications
    try {
      const rawMed = localStorage.getItem(LOCAL_STORAGE_KEYS.MEDICATIONS);
      if (rawMed) {
        const parsedMed = JSON.parse(rawMed);
        if (Array.isArray(parsedMed)) setMedications(parsedMed);
      }
    } catch (e) {
      console.warn("Failed to load medications from localStorage:", e);
    }
  }, []);

  // Save loggedSymptoms whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SYMPTOMS, JSON.stringify(loggedSymptoms));
    } catch (e) {
      console.warn("Failed to save loggedSymptoms to localStorage:", e);
    }
  }, [loggedSymptoms]);

  // Save medications whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    } catch (e) {
      console.warn("Failed to save medications to localStorage:", e);
    }
  }, [medications]);

  // Keep timers updating every minute (for medication timers)
  useEffect(() => {
    const interval = setInterval(() => {
      setMedications(prev => [...prev]); // triggers re-render if timers are shown
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Medication handlers
  const handleAddMedication = () => {
    if (!medicationForm.name || !medicationForm.dosage || !medicationForm.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newMedication = {
      id: Date.now(),
      ...medicationForm
    };
    
    setMedications(prev => [newMedication, ...prev]);
    setMedicationForm({ name: "", dosage: "", frequency: "", time: "", instructions: "" });
    setShowMedicationForm(false);
    
    toast({
      title: "Medication Added",
      description: `${medicationForm.name} has been added to your list`
    });
  };

  const removeMedication = (id: number) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const requestCaretakerHelp = () => {
    toast({
      title: t('needHelp'), 
      description: t('callCaretaker')
    });
  };

  // Symptom handlers
  const addSymptom = () => {
    if (!newSymptom.name || newSymptom.name.trim() === "") {
      toast({
        title: "Choose a symptom",
        description: "Please select or type a symptom to add.",
        variant: "destructive"
      });
      return;
    }

    const entry = {
      id: Date.now(),
      name: newSymptom.name.trim(),
      severity: newSymptom.severity,
      notes: newSymptom.notes?.trim() || "",
      time: new Date().toISOString()
    };

    setLoggedSymptoms(prev => [entry, ...prev]);
    setNewSymptom({ name: "", severity: "mild", notes: "" });

    toast({
      title: "Symptom logged",
      description: `${entry.name} — ${entry.severity.charAt(0).toUpperCase() + entry.severity.slice(1)}`
    });
  };

  const removeLoggedSymptom = (id: number) => {
    setLoggedSymptoms(prev => prev.filter(s => s.id !== id));
  };

  // Renderers
  const renderHomeContent = () => (
    <div className="space-y-6 pb-[80px]">
      {/* Add New Medication Form */}
      {showMedicationForm && (
        <Card className="border-2 border-teal-200 bg-teal-50">
          <CardHeader>
            <CardTitle className="text-lg text-teal-700">{t('addNewMedicationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium">{t('medicationName')}</Label>
              <Input
                id="name"
                placeholder={t('medicationNamePlaceholder')}
                value={medicationForm.name}
                onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                className="elderly-focus text-base p-3 rounded-xl border-2"
              />
            </div>
            <div>
              <Label htmlFor="dosage" className="text-base font-medium">{t('dosage')}</Label>
              <Input
                id="dosage"
                placeholder={t('dosagePlaceholder')}
                value={medicationForm.dosage}
                onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                className="elderly-focus text-base p-3 rounded-xl border-2"
              />
            </div>
            <div>
              <Label htmlFor="frequency" className="text-base font-medium">{t('frequency')}</Label>
              <Input
                id="frequency"
                placeholder={t('frequencyPlaceholder')}
                value={medicationForm.frequency}
                onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                className="elderly-focus text-base p-3 rounded-xl border-2"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-base font-medium">{t('reminderTime')}</Label>
              <Input
                id="time"
                type="time"
                value={medicationForm.time}
                onChange={(e) => setMedicationForm({ ...medicationForm, time: e.target.value })}
                className="elderly-focus text-base p-3 rounded-xl border-2"
              />
            </div>
            <div>
              <Label htmlFor="instructions" className="text-base font-medium">{t('instructions')}</Label>
              <Textarea
                id="instructions"
                placeholder={t('instructionsPlaceholder')}
                value={medicationForm.instructions}
                onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })}
                className="elderly-focus text-base p-3 rounded-xl border-2 min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleAddMedication} 
                className="bg-teal-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-teal-700"
              >
                {t('addMedication')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMedicationForm(false)}
                className="px-8 py-3 rounded-xl text-base border-2"
              >
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Medications List - Priority Section */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-50 border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-teal-700 flex items-center gap-3">
              <Pill className="h-6 w-6" />
              {t('todaysMedications')}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowMedicationForm(!showMedicationForm)}
                    className="bg-teal-600 text-white hover:bg-teal-700 rounded-full px-4 py-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{t('addNewMedication')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('addNewMedication')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-teal-700" />
              </div>
              <p className="text-lg text-muted-foreground mb-2">{t('noMedicationsYet')}</p>
              <p className="text-sm text-muted-foreground">Add your first medication to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                          <Pill className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{med.name}</h3>
                      </div>
                      <p className="text-muted-foreground font-medium text-base">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-3 p-3 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                          <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="text-sm text-orange-600 font-medium">{med.instructions}</span>
                        </div>
                      )}
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
                      <div className="flex gap-2 justify-end items-center">
                        <Button 
                          size="sm" 
                          className="bg-teal-600 text-white hover:bg-teal-700 rounded-full px-4"
                        >
                          ✓ {t('taken')}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeMedication(med.id)} className="text-red-600">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Welcome Header with modern design */}
      <div className="bg-gradient-to-br from-rose-200 to-blue-200 p-6 rounded-2xl text-gray-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('greeting')}</h1>
              <p className="text-gray-700 text-lg">{t('subtitle')}</p>
            </div>
            <div className="text-4xl">🙏</div>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 text-sm mb-3">It's time to Check Your</p>
            <p className="text-xl font-semibold">Blood Pressure</p>
            <p className="text-sm text-gray-600 mt-1">Yesterday's Reading: 140 mg/dl</p>
            <div className="flex gap-3 mt-4">
              <Button 
                variant="ghost" 
                className="text-gray-800 border border-gray-400 px-6 py-2 rounded-full hover:bg-gray-100"
                onClick={() => {
                  toast({
                    title: "Blood Pressure Check",
                    description: "Remember to check your blood pressure now!"
                  });
                }}
              >
                Remind me later
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
      </div>
      
      {/* Ask Caretaker Help */}
      <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200 cursor-pointer hover:shadow-lg transition-all" onClick={requestCaretakerHelp}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{t('needHelp')}</p>
                <p className="text-sm text-muted-foreground">{t('callCaretaker')}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-yellow-500">
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSymptomsContent = () => (
    <div className="space-y-4 pb-[80px]">
      {/* Header Image */}
      <div className="relative h-32 rounded-lg overflow-hidden">
        <img 
          src={elderlyYoga} 
          alt="Wellness and Health" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 text-white">
          <h2 className="text-lg font-bold">{t('dailyWellnessTracker')}</h2>
          <p className="text-sm">{t('subtitle')}</p>
        </div>
      </div>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            {t('todaysVitals')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {symptoms.map((symptom) => {
              const Icon = symptom.icon;
              return (
                <div key={symptom.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${symptom.color}`} />
                    <div>
                      <h4 className="font-medium">{symptom.name}</h4>
                      <p className="text-2xl font-bold">{symptom.value}</p>
                    </div>
                  </div>
                  <Badge variant={symptom.status === "normal" ? "default" : "destructive"}>
                    {t(symptom.status)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Log Symptom Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-teal-600" />
            Log Symptom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Select common symptom or custom */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium">Choose common symptom</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {genericSymptoms.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewSymptom({ ...newSymptom, name: s })}
                    className={`text-left p-3 rounded-lg border ${
                      newSymptom.name === s ? "border-teal-600 bg-teal-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="font-medium">{s}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Or type a custom symptom</Label>
              <Input
                placeholder="e.g. Sharp pain in left knee"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                className="mt-2 rounded-lg p-3"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Severity</Label>
              <div className="flex gap-2 mt-2">
                {["mild", "moderate", "severe"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setNewSymptom({ ...newSymptom, severity: level })}
                    className={`flex-1 p-3 rounded-lg border font-medium ${
                      newSymptom.severity === level
                        ? level === "mild"
                          ? "bg-green-50 border-green-400"
                          : level === "moderate"
                          ? "bg-yellow-50 border-yellow-400"
                          : "bg-red-50 border-red-400"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Notes (optional)</Label>
              <Textarea
                placeholder="Anything else to note..."
                value={newSymptom.notes}
                onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                className="mt-2 rounded-lg p-3 min-h-[80px]"
              />
            </div>

            <div className="pt-1">
              <Button className="w-full bg-teal-600 text-white rounded-xl py-3" onClick={addSymptom}>
                <Plus className="h-4 w-4 mr-2 inline" /> Add Symptom
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logged Symptoms */}
      {loggedSymptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Logged Symptoms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {loggedSymptoms.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-base">{s.name}</div>
                        <div className="text-xs text-gray-500">{new Date(s.time).toLocaleString()}</div>
                      </div>
                      <div className="ml-3">
                        <Badge
                          className={`px-3 py-1 text-sm ${
                            s.severity === "mild"
                              ? "bg-green-100 text-green-700"
                              : s.severity === "moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {s.severity.charAt(0).toUpperCase() + s.severity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    {s.notes && <p className="mt-2 text-sm text-gray-700">{s.notes}</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeLoggedSymptom(s.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Delete symptom"
                    >
                      <Trash className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Remedies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('ayurvedicTips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-24 rounded-lg overflow-hidden mb-4">
            <img 
              src={ayurvedicHerbs} 
              alt="Ayurvedic Herbs" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <p className="text-sm">🌿 <strong>{t('turmericMilk')}</strong></p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <p className="text-sm">🧘 <strong>{t('pranayama')}</strong></p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <p className="text-sm">☕ <strong>{t('tulsiTea')}</strong></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col gap-1">
          <Thermometer className="h-5 w-5" />
          <span className="text-sm">Log Temperature</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1">
          <Heart className="h-5 w-5" />
          <span className="text-sm">{t('logBP')}</span>
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeContent();
      case "symptoms":
        return renderSymptomsContent();
      case "ai-helper":
        return <EnhancedAIChat />;
      case "profile":
        return (
          <div className="space-y-4 pb-[80px]">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-32 rounded-t-lg overflow-hidden">
                  <img 
                    src={familyProfile} 
                    alt="Family Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 -mt-8 relative">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 border-4 border-gray-200">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Raj Kumar Sharma</h2>
                  <p className="text-gray-500">Age: 68 • Patient ID: #12345</p>
                  <Button size="sm" className="mt-3">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('editProfile')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('personalInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('phone')}</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('address')}</p>
                      <p className="font-medium">123 Gandhi Nagar, Delhi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-20 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={healthSymbols} 
                    alt="Health Symbols" 
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">7</p>
                    <p className="text-sm text-gray-500">Days Med Compliant</p>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">5</p>
                    <p className="text-sm text-gray-500">Active Medications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">परिवार संपर्क (Family Contacts)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Sunita Sharma (Daughter)</p>
                      <p className="text-sm text-gray-500">Primary Caretaker</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-800 font-medium">A</span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. Amit Patel</p>
                      <p className="text-sm text-gray-500">Family Doctor</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Camera className="h-5 w-5" />
                <span className="text-sm">Change Photo</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Emergency Info</span>
              </Button>
            </div>
          </div>
        );
      case "ai-helper":
        return <EnhancedAIChat />;
      case "panic":
        return (
          <div className="space-y-4">
            <Card className="border-red-400">
              <CardHeader>
                <CardTitle className="text-xl text-red-500">Emergency Panic Button</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-400 text-white btn-elderly">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Emergency Help
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-[80px]">
      {/* Simple Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">
          {t(activeTab === "home" ? "home" : 
             activeTab === "symptoms" ? "symptoms" : 
             activeTab === "ai-helper" ? "aiHelper" :
             activeTab === "profile" ? "profile" : "panic")}
        </h1>
        <LanguageToggle />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="patient" />

      <div className="p-4">
        {renderContent()}
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default PatientDashboard;
