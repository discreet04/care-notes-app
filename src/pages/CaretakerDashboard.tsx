import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Menu, Plus, UserCheck, UserX, Search, Users, AlertTriangle, Pill, Heart, Activity, Calendar, Clock, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Vitals = {
  heartRate: number;
  bloodPressure: string;
  temperature: string; // e.g. "99.2°F"
};

type Patient = {
  id: number;
  patientName: string;
  phone: string;
  age: number;
  lastActivity: string;
  urgentAttention: boolean;
  symptoms: string[];
  medicationCompliance: number; // 0-100
  vitals: Vitals;
  nextAppointment: string;
  chronicConditions: string[];
  riskLevel: "high" | "medium" | "low" | string;
  accepted?: boolean;
};

type Invitation = {
  id: number;
  patientName: string;
  phone: string;
  timestamp: string;
  age?: number;
};

const CaretakerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 3,
      patientName: "Alice Johnson",
      phone: "‪+91 9876543211‬",
      age: 72,
      lastActivity: "2 hours ago",
      urgentAttention: true,
      symptoms: ["Chest pain", "Shortness of breath"],
      medicationCompliance: 85,
      vitals: {
        heartRate: 95,
        bloodPressure: "140/90",
        temperature: "99.2°F",
      },
      nextAppointment: "Tomorrow, 2:00 PM",
      chronicConditions: ["Hypertension", "Diabetes"],
      riskLevel: "high",
    },
    {
      id: 4,
      patientName: "Robert Chen",
      phone: "‪+91 8765432108‬",
      age: 68,
      lastActivity: "30 minutes ago",
      urgentAttention: false,
      symptoms: ["Mild fatigue"],
      medicationCompliance: 95,
      vitals: {
        heartRate: 72,
        bloodPressure: "120/80",
        temperature: "98.6°F",
      },
      nextAppointment: "Friday, 10:00 AM",
      chronicConditions: ["Arthritis"],
      riskLevel: "low",
    },
    {
      id: 5,
      patientName: "Margaret Davis",
      phone: "‪+91 7654321098‬",
      age: 78,
      lastActivity: "1 day ago",
      urgentAttention: false,
      symptoms: [],
      medicationCompliance: 60,
      vitals: {
        heartRate: 78,
        bloodPressure: "130/85",
        temperature: "98.4°F",
      },
      nextAppointment: "Next Monday, 11:00 AM",
      chronicConditions: ["Osteoporosis", "High Cholesterol"],
      riskLevel: "medium",
    },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 1, patientName: "John Doe", phone: "‪+91 9876543210‬", timestamp: "2 hours ago", age: 65 },
    { id: 2, patientName: "Mary Smith", phone: "‪+91 8765432109‬", timestamp: "1 day ago", age: 71 },
  ]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return "text-green-600";
    if (compliance >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const handleAcceptInvitation = (id: number) => {
    const invitation = invitations.find((inv) => inv.id === id);
    if (!invitation) return;

    const newPatient: Patient = {
      id: Math.max(...patients.map((p) => p.id), 0) + 1,
      patientName: invitation.patientName,
      phone: invitation.phone,
      age: invitation.age ?? 0,
      accepted: true,
      lastActivity: "Just joined",
      urgentAttention: false,
      symptoms: [],
      medicationCompliance: 100,
      vitals: {
        heartRate: 75,
        bloodPressure: "120/80",
        temperature: "98.6°F",
      },
      nextAppointment: "To be scheduled",
      chronicConditions: [],
      riskLevel: "low",
    };

    setPatients((prev) => [...prev, newPatient]);
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    toast({
      title: "Invitation Accepted",
      description: `${invitation.patientName} has been added to your patients list.`,
    });
  };

  const handleRejectInvitation = (id: number) => {
    const invitation = invitations.find((inv) => inv.id === id);
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
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

  const urgentPatientsCount = patients.filter((p) => p.urgentAttention).length;
  const lowComplianceCount = patients.filter((p) => p.medicationCompliance < 70).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Hamburger Menu */}
      <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="elderly-focus"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Caretaker Dashboard</h1>
        <div className="w-10" />
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentRole="caretaker" />

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Urgent Attention</p>
                  <p className="text-2xl font-bold">{urgentPatientsCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Low Compliance</p>
                  <p className="text-2xl font-bold">{lowComplianceCount}</p>
                </div>
                <Pill className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Invitations */}
        {invitations.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Patient Invitations
                <Badge variant="secondary" className="ml-2">
                  {invitations.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <TooltipProvider>
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="border-l-4 border-purple-400 bg-purple-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{invitation.patientName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{invitation.phone}</span>
                          <span>•</span>
                          <span>Age: {invitation.age ?? "—"}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Invited {invitation.timestamp}</p>
                      </div>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAcceptInvitation(invitation.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accept invitation</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleRejectInvitation(invitation.id)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Reject
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
              </TooltipProvider>
            </CardContent>
          </Card>
        )}

        {/* My Patients */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              My Patients
              <Badge variant="secondary" className="ml-2">
                {patients.length}
              </Badge>
            </CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddPatientClick}>
              <Plus className="h-5 w-5 mr-2" />
              Add Patient
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {patients.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900">No Patients Yet</h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  When you accept an invitation, the patient will appear here. You can also add new patients to monitor their health.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input placeholder="Search patients..." className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400" />
                </div>

                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                      patient.urgentAttention ? "border-red-200 bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{patient.patientName}</h3>

                          <Badge className={`${getRiskLevelColor(patient.riskLevel)} border`}>
                            {String(patient.riskLevel).toUpperCase()} RISK
                          </Badge>

                          {patient.urgentAttention && (
                            <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse ml-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              URGENT
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>{patient.phone}</span>
                          <span>•</span>
                          <span>Age: {patient.age}</span>
                          <span>•</span>
                          <span className="flex items-center gap-2">
                            <span className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                {patient.urgentAttention ? (
                                  <>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </>
                                ) : (
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                )}
                              </span>
                              <span>Last seen: {patient.lastActivity}</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {/* Symptoms */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Current Symptoms
                        </h4>
                        {patient.symptoms.length > 0 ? (
                          <div className="space-y-1">
                            {patient.symptoms.map((symptom, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className={`${patient.urgentAttention ? "border-red-300 text-red-700" : "border-gray-300 text-gray-700"} text-xs mr-1`}
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            No symptoms reported
                          </p>
                        )}
                      </div>

                      {/* Medication Compliance */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Medication Compliance
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${patient.medicationCompliance >= 90 ? "bg-green-500" : patient.medicationCompliance >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${patient.medicationCompliance}%` }}
                            />
                          </div>
                          <span className={`font-bold text-sm ${getComplianceColor(patient.medicationCompliance)}`}>
                            {patient.medicationCompliance}%
                          </span>
                        </div>
                        {patient.medicationCompliance < 70 && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Requires attention
                          </p>
                        )}
                      </div>

                      {/* Vital Signs */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Latest Vitals
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Heart Rate:</span>
                            <span className={`font-medium ${patient.vitals.heartRate > 90 ? "text-red-600" : "text-gray-900"}`}>
                              {patient.vitals.heartRate} bpm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Blood Pressure:</span>
                            <span className="font-medium text-gray-900">{patient.vitals.bloodPressure}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Temperature:</span>
                            <span className={`font-medium ${parseFloat(String(patient.vitals.temperature)) > 99 ? "text-red-600" : "text-gray-900"}`}>
                              {patient.vitals.temperature}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chronic Conditions & Next Appointment */}
                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Chronic Conditions</h4>
                        {patient.chronicConditions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {patient.chronicConditions.map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">None reported</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Next Appointment
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {patient.nextAppointment}
                        </p>
                      </div>
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
