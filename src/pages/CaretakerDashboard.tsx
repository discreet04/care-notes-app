import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, Plus, UserCheck, UserX } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const CaretakerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    }
  };

  const handleRejectInvitation = (id: number) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
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
                            className="h-8 w-8"
                            onClick={() => handleRejectInvitation(invitation.id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reject invitation</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* My Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">My Patients</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Add Patient</h2>
                <p className="text-muted-foreground mb-6">
                  You haven't added any patients yet. Accept patient invitations above or search for patients to add.
                </p>
                <Button className="btn-elderly bg-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Patient
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <h3 className="font-bold text-lg">{patient.patientName}</h3>
                    <p className="text-muted-foreground">{patient.phone}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-success">● Connected</span>
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