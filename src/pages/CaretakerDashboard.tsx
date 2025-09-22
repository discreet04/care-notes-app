import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Menu, Plus, UserCheck, UserX, Search, Users, AlertCircle, ShieldCheck, Pill } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import ProgressCircle from "@/components/ui/progress-circle";
import { useSpeech } from "@/contexts/SpeechContext";

const CaretakerDashboard = ({ initialInvitations, setInvitations }: { initialInvitations: any[], setInvitations: React.Dispatch<React.SetStateAction<any[]>> }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const { speak } = useSpeech();
  
  const [patients, setPatients] = useState<any[]>([
    { 
      id: 101, 
      patientName: "Raj Kumar", 
      phone: "+91 98765 12345", 
      status: "urgent", 
      lastActive: "5 mins ago",
      symptoms: ["High Fever", "Coughing"],
      medicationAdherence: 60
    },
    { 
      id: 102, 
      patientName: "Sunita Sharma", 
      phone: "+91 98765 54321", 
      status: "stable", 
      lastActive: "30 mins ago",
      symptoms: ["Stable"],
      medicationAdherence: 95
    }
  ]);

  const invitations = initialInvitations;

  const handleAcceptInvitation = (id: number) => {
    const invitation = invitations.find(inv => inv.id === id);
    if (invitation) {
      const newPatient = {
        ...invitation,
        status: "stable",
        lastActive: "Just now",
        symptoms: ["Newly Added"],
        medicationAdherence: 100
      };
      setPatients([...patients, newPatient]);
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast({
        title: "Invitation Accepted",
        description: `${invitation.patientName} has been added to your patients list.`,
      });
    }
  };

  const handleRejectInvitation = (id: number) => {
    const invitation = invitations.find(inv => inv.id === id);
    if (invitation) {
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast({
        title: "Invitation Rejected",
        description: `You have rejected the invitation from ${invitation.patientName}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Caretaker Dashboard</h1>
        <div className="w-10" />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="caretaker" />

      <main className="p-4 md:p-6 space-y-6">
        {invitations.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle 
                className="text-lg text-blue-800"
                onMouseEnter={() => speak("You have new patient invitations.")}
              >
                Patient Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div onMouseEnter={() => speak(`Invitation from ${invitation.patientName}`)}>
                      <h3 className="font-bold">{invitation.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{invitation.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" className="h-8 w-8 bg-success/10 text-success hover:bg-success hover:text-white" onClick={() => handleAcceptInvitation(invitation.id)} onMouseEnter={() => speak(`Accept invitation from ${invitation.patientName}`)}>
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Accept</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" onClick={() => handleRejectInvitation(invitation.id)} onMouseEnter={() => speak(`Reject invitation from ${invitation.patientName}`)}>
                              <UserX className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Reject</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl" onMouseEnter={() => speak("Your Patients")}>My Patients</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-10 w-full md:w-64" onFocus={() => speak("Search for patients by name.")} />
            </div>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Patients Yet</h2>
                <p className="text-muted-foreground">Accept an invitation to start monitoring a patient.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer hover:shadow-lg transition-shadow ${
                      patient.status === 'urgent' ? 'border-red-500 bg-red-50' : 
                      ''
                    }`}
                    onMouseEnter={() => speak(`Patient: ${patient.patientName}. Status: ${patient.status}. Medication adherence is ${patient.medicationAdherence} percent.`)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{patient.patientName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                        <Badge variant={patient.status === 'urgent' ? 'destructive' : 'default'}>
                          {patient.status === 'urgent' ? <AlertCircle className="h-4 w-4 mr-1.5" /> : <ShieldCheck className="h-4 w-4 mr-1.5" />}
                          {patient.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Current Symptoms</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {patient.symptoms.map((symptom: string, index: number) => (
                            <Badge key={index} variant="secondary">{symptom}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                           <Pill className="h-5 w-5 text-primary" />
                           <div>
                             <p className="text-sm font-semibold">Medication</p>
                             <p className="text-xs text-muted-foreground">Adherence</p>
                           </div>
                        </div>
                        <ProgressCircle progress={patient.medicationAdherence} size="sm" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CaretakerDashboard;