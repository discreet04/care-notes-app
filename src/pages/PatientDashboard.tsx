import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Clock, AlertTriangle, HelpCircle, Heart, Thermometer, Activity, User, Camera, Edit, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LanguageToggle from "@/components/LanguageToggle";
import AIChat from "@/components/AIChat";
import elderlyYoga from "@/assets/elderly-yoga.jpg";
import ayurvedicHerbs from "@/assets/ayurvedic-herbs.jpg";
import familyProfile from "@/assets/family-profile.jpg";
import healthSymbols from "@/assets/health-symbols.jpg";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState([
    { id: 1, name: "Blood Pressure", value: "120/80", status: "normal", icon: Heart, color: "text-success" },
    { id: 2, name: "Temperature", value: "98.6°F", status: "normal", icon: Thermometer, color: "text-primary" },
    { id: 3, name: "Heart Rate", value: "72 BPM", status: "normal", icon: Activity, color: "text-success" }
  ]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    instructions: ""
  });

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
    
    setMedications([...medications, newMedication]);
    setMedicationForm({ name: "", dosage: "", frequency: "", time: "", instructions: "" });
    setShowMedicationForm(false);
    
    toast({
      title: "Medication Added",
      description: `${medicationForm.name} has been added to your list`
    });
  };

  const requestCaretakerHelp = () => {
    toast({
      title: t('needHelp'), 
      description: t('callCaretaker')
    });
  };

  const renderHomeContent = () => (
    <div className="space-y-4">
      {/* Welcome Header with Indian Theme */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{t('greeting')}</h2>
              <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>
            <div className="text-4xl">🙏</div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Medication Button */}
      <Button
        className="w-full h-14 text-lg font-semibold bg-medication-primary text-medication-primary-foreground hover:bg-medication-primary/90 rounded-lg"
        onClick={() => setShowMedicationForm(!showMedicationForm)}
      >
        <Plus className="h-6 w-6 mr-3" />
        {t('addNewMedication')}
      </Button>

      {/* Add Medication Form */}
      {showMedicationForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t('addNewMedicationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t('medicationName')}</Label>
              <Input
                id="name"
                placeholder={t('medicationNamePlaceholder')}
                value={medicationForm.name}
                onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="dosage">{t('dosage')}</Label>
              <Input
                id="dosage"
                placeholder={t('dosagePlaceholder')}
                value={medicationForm.dosage}
                onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="frequency">{t('frequency')}</Label>
              <Input
                id="frequency"
                placeholder={t('frequencyPlaceholder')}
                value={medicationForm.frequency}
                onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="time">{t('reminderTime')}</Label>
              <Input
                id="time"
                type="time"
                value={medicationForm.time}
                onChange={(e) => setMedicationForm({ ...medicationForm, time: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="instructions">{t('instructions')}</Label>
              <Textarea
                id="instructions"
                placeholder={t('instructionsPlaceholder')}
                value={medicationForm.instructions}
                onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddMedication} className="btn-elderly bg-primary">
                {t('addMedication')}
              </Button>
              <Button variant="outline" onClick={() => setShowMedicationForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Medications */}
      <Card className="bg-secondary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">{t('todaysMedications')}</CardTitle>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg">💊</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-lg text-muted-foreground">{t('noMedicationsYet')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border rounded-lg p-4 bg-card shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💊</span>
                        <h3 className="font-bold text-lg">{med.name}</h3>
                      </div>
                      <p className="text-muted-foreground font-medium">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-2 p-2 bg-warning/10 rounded-md">
                          <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                          <span className="text-sm text-warning">{med.instructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{med.time || "No time set"}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        ✓ {t('taken')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ask Caretaker Help */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 cursor-pointer border-primary/20" onClick={requestCaretakerHelp}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{t('needHelp')}</p>
                <p className="text-sm text-muted-foreground">{t('callCaretaker')}</p>
              </div>
            </div>
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Add Medication Form */}
      {showMedicationForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add New Medication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Medication Name</Label>
              <Input
                id="name"
                placeholder="e.g., Combiflam, Aspirin"
                value={medicationForm.name}
                onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 500 mg, 1 tablet"
                value={medicationForm.dosage}
                onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                placeholder="e.g., Once Daily, Twice Daily"
                value={medicationForm.frequency}
                onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="time">Reminder Time</Label>
              <Input
                id="time"
                type="time"
                value={medicationForm.time}
                onChange={(e) => setMedicationForm({ ...medicationForm, time: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Take with food"
                value={medicationForm.instructions}
                onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })}
                className="elderly-focus"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddMedication} className="btn-elderly bg-primary">
                Add Medication
              </Button>
              <Button variant="outline" onClick={() => setShowMedicationForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Medications */}
      <Card className="bg-secondary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">आज की दवाएं (Today's Medicines)</CardTitle>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg">💊</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-lg text-muted-foreground">कोई दवा नहीं मिली</p>
              <p className="text-sm text-muted-foreground">No medications added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border rounded-lg p-4 bg-card shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💊</span>
                        <h3 className="font-bold text-lg">{med.name}</h3>
                      </div>
                      <p className="text-muted-foreground font-medium">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-2 p-2 bg-warning/10 rounded-md">
                          <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                          <span className="text-sm text-warning">{med.instructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{med.time || "No time set"}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        ✓ Taken
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ask Caretaker Help */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/20 cursor-pointer border-primary/20" onClick={requestCaretakerHelp}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{t('needHelp')}</p>
                <p className="text-sm text-muted-foreground">{t('callCaretaker')}</p>
              </div>
            </div>
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeContent();
      case "symptoms":
        return (
          <div className="space-y-4">
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
                  <Activity className="h-5 w-5 text-primary" />
                  {t('todaysVitals')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {symptoms.map((symptom) => {
                    const Icon = symptom.icon;
                    return (
                      <div key={symptom.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
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
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm">🌿 <strong>{t('turmericMilk')}</strong></p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm">🧘 <strong>{t('pranayama')}</strong></p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm">☕ <strong>{t('tulsiTea')}</strong></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Thermometer className="h-5 w-5" />
                <span className="text-sm">{t('recordTemperature')}</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Heart className="h-5 w-5" />
                <span className="text-sm">{t('logBP')}</span>
              </Button>
            </div>
          </div>
        );
      case "ai-helper":
        return <AIChat />;
      case "profile":
        return (
          <div className="space-y-4">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-32 rounded-t-lg overflow-hidden">
                  <img 
                    src={familyProfile} 
                    alt="Family Profile" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 -mt-8 relative">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 border-4 border-background">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Raj Kumar Sharma</h2>
                  <p className="text-muted-foreground">Age: 68 • Patient ID: #12345</p>
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
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('phone')}</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('address')}</p>
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
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-2xl font-bold text-success">7</p>
                    <p className="text-sm text-muted-foreground">Days Med Compliant</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-primary">5</p>
                    <p className="text-sm text-muted-foreground">Active Medications</p>
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
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Sunita Sharma (Daughter)</p>
                      <p className="text-sm text-muted-foreground">Primary Caretaker</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-secondary-foreground font-medium">A</span>
                    </div>
                    <div>
                      <p className="font-medium">Dr. Amit Patel</p>
                      <p className="text-sm text-muted-foreground">Family Doctor</p>
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
      case "panic":
        return (
          <div className="space-y-4">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-xl text-destructive">Emergency Panic Button</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-destructive text-destructive-foreground btn-elderly">
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
    <div className="min-h-screen bg-background pb-20">
      {/* Simple Header */}
      <header className="bg-card border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">
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