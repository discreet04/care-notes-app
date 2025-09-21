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
    toast({
      title: "Add Patient",
      description: "Search for a patient by their phone number to send an invitation.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header with Warm Gradient */}
      <header className="bg-gradient-to-r from-orange-400 to-amber-500 text-white p-4 flex items-center justify-between shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus text-white hover:bg-orange-500/30"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Caretaker Dashboard</h1>
        <div className="w-10" />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="caretaker" />

      <div className="p-4 space-y-6">
        {/* Patient Invitations */}
        {invitations.length > 0 && (
          <Card className="border-2 border-amber-200 bg-amber-50 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-amber-700">Patient Invitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-xl p-4 bg-gradient-to-r from-orange-100 to-yellow-50 shadow-sm hover:scale-[1.01] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">{invitation.patientName}</h3>
                      <p className="text-muted-foreground">{invitation.phone}</p>
                      <p className="text-xs text-amber-700 mt-1">Invited {invitation.timestamp}</p>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                              onClick={() => handleAcceptInvitation(invitation.id)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Accept</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                              onClick={() => handleRejectInvitation(invitation.id)}
                            >
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

        {/* My Patients */}
        <Card className="border-2 border-orange-200 bg-orange-50 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-orange-800">My Patients</CardTitle>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2"
              onClick={handleAddPatientClick}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Patient
            </Button>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-orange-100/40">
                <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-orange-700" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-orange-800">No Patients Yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Accept invitations or add new patients to begin monitoring their health.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-10 rounded-full border-orange-200 focus:ring-orange-400" />
                </div>
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border rounded-xl p-4 bg-gradient-to-r from-orange-100 to-yellow-50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <h3 className="font-bold text-lg text-orange-900">{patient.patientName}</h3>
                    <p className="text-muted-foreground">{patient.phone}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-green-600 flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Connected
                      </span>
                      <span className="text-orange-600">Last activity: Today</span>
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
