import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Clock, AlertTriangle, HelpCircle, Heart, Thermometer, Activity, User, Camera, Edit, Phone, MapPin, Pill, Check } from "lucide-react";
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
  
  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMedications(prev => [...prev]); // Trigger re-render for timer updates
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-6">
      {/* Add New Medication Form */}
      {showMedicationForm && (
        <Card className="border-2 border-health-teal/20 bg-health-teal/5">
          <CardHeader>
            <CardTitle className="text-lg text-health-teal">{t('addNewMedicationTitle')}</CardTitle>
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
                className="bg-health-teal text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-health-teal/90"
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
      <Card className="bg-gradient-to-br from-health-teal/10 to-health-teal/5 border-health-teal/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-health-teal flex items-center gap-3">
              <Pill className="h-6 w-6" />
              {t('todaysMedications')}
            </CardTitle>
            <Button
              onClick={() => setShowMedicationForm(!showMedicationForm)}
              className="bg-health-teal text-white hover:bg-health-teal/90 rounded-full px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addNewMedication')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-health-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8 text-health-teal" />
              </div>
              <p className="text-lg text-muted-foreground mb-2">{t('noMedicationsYet')}</p>
              <p className="text-sm text-muted-foreground">Add your first medication to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="bg-white rounded-xl p-4 border border-health-teal/20 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-health-teal rounded-full flex items-center justify-center">
                          <Pill className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{med.name}</h3>
                      </div>
                      <p className="text-muted-foreground font-medium text-base">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-3 p-3 bg-warning/10 rounded-lg border-l-4 border-warning">
                          <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                          <span className="text-sm text-warning font-medium">{med.instructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center text-health-teal mb-2">
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
                      <Button 
                        size="sm" 
                        className="bg-health-teal text-white hover:bg-health-teal/90 rounded-full px-4"
                      >
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

      {/* Welcome Header with modern design */}
      <div className="bg-gradient-to-br from-health-coral to-primary p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('greeting')}</h1>
              <p className="text-white/90 text-lg">{t('subtitle')}</p>
            </div>
            <div className="text-4xl">🙏</div>
          </div>
          <div className="mt-6">
            <p className="text-white/80 text-sm mb-3">It's time to Check Your</p>
            <p className="text-xl font-semibold">Blood Pressure</p>
            <p className="text-sm text-white/70 mt-1">Yesterday's Reading: 140 mg/dl</p>
            <div className="flex gap-3 mt-4">
              <Button 
                className="bg-health-yellow text-secondary font-semibold px-6 py-2 rounded-full hover:bg-health-yellow/90"
                onClick={() => {
                  toast({
                    title: "Blood Pressure Check",
                    description: "Remember to check your blood pressure now!"
                  });
                }}
              >
                Check now
              </Button>
              <Button 
                variant="ghost" 
                className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-white/10"
              >
                Remind me later
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      </div>

      {/* Today's Progress Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Today's Task</h2>
          <span className="text-sm text-muted-foreground">1/5 Completed</span>
        </div>
        
        <div className="space-y-3">
          {/* Morning Walk Task */}
          <div className="bg-health-teal text-white p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div>
                <p className="font-semibold">Morning Walk</p>
                <p className="text-sm text-white/80">6:30 am - 7:00 am</p>
              </div>
            </div>
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
          </div>

          {/* Blood Pressure Check */}
          <div className="bg-health-yellow text-secondary p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div>
                <p className="font-semibold">Check Blood Pressure</p>
                <p className="text-sm text-secondary/70">11:00 am</p>
              </div>
            </div>
            <div className="w-8 h-8 border-2 border-secondary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-secondary" />
            </div>
          </div>

          {/* Call Family */}
          <div className="bg-health-blue text-white p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div>
                <p className="font-semibold">Call Grandchildren</p>
                <p className="text-sm text-white/80">3:00 pm</p>
              </div>
            </div>
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Progress Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">My Tasks</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Medication Progress */}
          <Card className="bg-health-teal p-6 text-white border-none relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <ProgressCircle progress={72} color="teal" size="md" className="text-white">
                  <span className="text-white font-bold text-lg">72%</span>
                </ProgressCircle>
                <Pill className="h-8 w-8 text-white/80" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Medication</h3>
              <p className="text-sm text-white/80">{medications.length} Tasks</p>
              <Button
                className="mt-3 bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-full text-sm px-4 py-1"
                onClick={() => setShowMedicationForm(true)}
              >
                Add Task →
              </Button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
          </Card>

          {/* Fitness Progress */}
          <Card className="bg-health-yellow p-6 text-secondary border-none relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <ProgressCircle progress={50} color="yellow" size="md" className="text-secondary">
                  <span className="text-secondary font-bold text-lg">50%</span>
                </ProgressCircle>
                <Activity className="h-8 w-8 text-secondary/80" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Fitness</h3>
              <p className="text-sm text-secondary/80">2 Tasks</p>
              <Button
                className="mt-3 bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30 rounded-full text-sm px-4 py-1"
                onClick={() => {
                  toast({
                    title: "Fitness Tracker",
                    description: "Keep up the good work with your daily activities!"
                  });
                }}
              >
                View Tasks →
              </Button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary/10 rounded-full"></div>
          </Card>
        </div>
      </div>

      {/* Ask Caretaker Help */}
      <Card className="bg-gradient-to-br from-health-yellow/20 to-health-yellow/10 border-health-yellow/30 cursor-pointer hover:shadow-lg transition-all" onClick={requestCaretakerHelp}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-health-yellow to-warning rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{t('needHelp')}</p>
                <p className="text-sm text-muted-foreground">{t('callCaretaker')}</p>
              </div>
            </div>
            <HelpCircle className="h-6 w-6 text-health-yellow" />
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
        return <EnhancedAIChat />;
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