// src/pages/CaretakerDashboard.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Menu, Plus, UserCheck, UserX, Search, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CaretakerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [invitations, setInvitations] = useState([
    { id: 1, patientName: "John Doe", phone: "+91 9876543210", timestamp: "2 hours ago" },
    { id: 2, patientName: "Mary Smith", phone: "+91 8765432109", timestamp: "1 day ago" }
  ]);

  const handleAcceptInvitation = (id: number) => {
    const invitation = invitations.find(inv => inv.id === id);
    if (invitation) {
      setPatients([...patients, { ...invitation, accepted: true }]);
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast({
        title: "Invitation Accepted",
        description: `${invitation.patientName} has been added to your patients list.`,
      });
    }
  };

  const handleRejectInvitation = (id: number) => {
    const invitation = invitations.find(inv => inv.id === id);
    setInvitations(invitations.filter(inv => inv.id !== id));
    if (invitation) {
      toast({
        title: "Invitation Rejected",
        description: `You have rejected the invitation from ${invitation.patientName}.`,
        variant: "destructive",
      });
    }
  };

  const handleAddPatientClick = () => {
    // This would typically open a search dialog or navigate to a new page
    toast({
      title: "Add Patient",
      description: "Search for a patient by their phone number to send an invitation.",
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
        <h1 className="text-xl font-bold text-primary">Caretaker Dashboard</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="caretaker" />

      <div className="p-4 space-y-6">
        {/* Patient Invitations */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Patient Invitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="border rounded-lg p-4 bg-secondary/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{invitation.patientName}</h3>
                      <p className="text-muted-foreground">{invitation.phone}</p>
                      <p className="text-sm text-muted-foreground">Invited {invitation.timestamp}</p>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-success/10 border-success text-success hover:bg-success hover:text-success-foreground"
                              onClick={() => handleAcceptInvitation(invitation.id)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accept invitation</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-destructive/10 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRejectInvitation(invitation.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reject invitation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* My Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">My Patients</CardTitle>
            <Button className="btn-elderly bg-primary" onClick={handleAddPatientClick}>
              <Plus className="h-5 w-5 mr-2" />
              Add Patient
            </Button>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Patients Yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  When you accept an invitation, the patient will appear here. You can also add new patients to monitor their health.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-10" />
                </div>
                {patients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <h3 className="font-bold text-lg">{patient.patientName}</h3>
                    <p className="text-muted-foreground">{patient.phone}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-success flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </span>
                        Connected
                      </span>
                      <span className="text-muted-foreground">Last activity: Today</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaretakerDashboard;