import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Plus, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const { toast } = useToast();

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
      title: "Caretaker Being Called", 
      description: "Please have patience, your caretaker is being notified"
    });
  };

  const renderHomeContent = () => (
    <div className="space-y-4">
      {/* Add New Medication Button */}
      <Button
        className="w-full h-14 text-lg font-semibold bg-medication-primary text-medication-primary-foreground hover:bg-medication-primary/90 rounded-lg"
        onClick={() => setShowMedicationForm(!showMedicationForm)}
      >
        <Plus className="h-6 w-6 mr-3" />
        Add New Medication
      </Button>

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
          <CardTitle className="text-2xl font-bold text-foreground">Today's Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No medications added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{med.name}</h3>
                      <p className="text-muted-foreground">{med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      {med.instructions && (
                        <div className="flex items-center mt-2 text-warning">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{med.instructions}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{med.time || "No time set"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ask Caretaker Help */}
      <Card className="bg-secondary/20 cursor-pointer" onClick={requestCaretakerHelp}>
        <CardContent className="p-6">
          <div className="flex items-center">
            <HelpCircle className="h-6 w-6 text-muted-foreground mr-3" />
            <span className="text-lg text-muted-foreground">Trouble inputting? Ask caretaker.</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Daily Symptom Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "ai-helper":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">AI Health Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
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
          {activeTab === "home" ? "Home" : 
           activeTab === "symptoms" ? "Symptoms" : 
           activeTab === "ai-helper" ? "AI Helper" :
           activeTab === "profile" ? "Profile" : "Panic"}
        </h1>
        <div className="w-10" /> {/* Spacer */}
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