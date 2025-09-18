import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, Plus, Clock, AlertTriangle, MessageCircle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState<any[]>([]);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hamburger Menu */}
      <header className="bg-card border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Patient Dashboard</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="patient" />

      <div className="p-4">
        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-sm">
            <TabsTrigger value="medications">Home</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="caretaker">Add Caretaker</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-4 mt-6">
            {/* Add New Medication Button */}
            <Button
              className="w-full btn-elderly bg-primary mb-4"
              onClick={() => setShowMedicationForm(!showMedicationForm)}
            >
              <Plus className="h-5 w-5 mr-2" />
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Today's Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {medications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg">No medications added yet</p>
                    <p className="text-sm">Click "Add New Medication" above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {medications.map((med) => (
                      <div key={med.id} className="border rounded-lg p-4 bg-secondary/30">
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

            {/* Prescription Help */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <p className="text-center text-muted-foreground mb-3">
                  Having trouble inputting details?
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={requestCaretakerHelp}
                >
                  Let your caretaker add them for you
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Daily Symptom Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Log your symptoms daily</p>
                {/* Symptom tracking form would go here */}
                <div className="text-center py-8 text-muted-foreground">
                  <p>Symptom tracking form coming soon...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                {symptoms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-lg">No symptoms logged yet</p>
                    <p className="text-sm">Start tracking your daily symptoms above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Symptoms list would render here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  AI Health Assistant
                </CardTitle>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <p className="text-sm text-warning-foreground">
                    <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice. Always seek professional advice from a doctor before diagnosing any disease on your own.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>AI Assistant chat interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="caretaker" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <UserPlus className="h-6 w-6 mr-2" />
                  Add Caretaker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Caretaker management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;