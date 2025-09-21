import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EnhancedAIChat from "@/components/AIChat";
import useDailyTip from "@/hooks/useDailyTip";

export default function PatientDashboard() {
  const [medications, setMedications] = useState([
    { id: 1, name: "Aspirin", taken: false },
    { id: 2, name: "Metformin", taken: false },
  ]);

  const [elderlyMode, setElderlyMode] = useState(false);
  const [panicCountdown, setPanicCountdown] = useState<number | null>(null);

  const { tip, refresh } = useDailyTip();

  // Handle med taken toggle
  const toggleTaken = (id: number) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, taken: !m.taken } : m
      )
    );
  };

  // Panic button handler
  const triggerPanic = () => {
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
    toast.error("Emergency! Contacting caretaker in 5 seconds...");
    setPanicCountdown(5);
  };

  useEffect(() => {
    if (panicCountdown === null) return;
    if (panicCountdown === 0) {
      toast.success("Caretaker has been contacted.");
      setPanicCountdown(null);
      return;
    }
    const t = setTimeout(() => setPanicCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [panicCountdown]);

  // Compliance calculation (percentage of meds taken today)
  const compliance = Math.round(
    (medications.filter((m) => m.taken).length / medications.length) * 100
  );

  return (
    <div className={`p-6 ${elderlyMode ? "text-xl" : "text-base"}`}>
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>

      {/* Elderly Mode */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={elderlyMode}
            onChange={(e) => setElderlyMode(e.target.checked)}
          />
          Elderly-friendly mode
        </label>
      </div>

      {/* Compliance Tracker */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Weekly Compliance</h2>
        <Progress value={compliance} className="h-3" />
        <p className="mt-2">{compliance}% meds taken today</p>
      </div>

      {/* Medications */}
      <div className="grid gap-3 mb-6">
        {medications.map((med) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <span>{med.name}</span>
            <Button
              variant={med.taken ? "default" : "outline"}
              onClick={() => toggleTaken(med.id)}
            >
              {med.taken ? "✓ Taken" : "Mark Taken"}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Doctor's Tip */}
      <div className="p-4 border rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Doctor's Tip of the Day</h2>
        <p>{tip}</p>
        <Button size="sm" className="mt-2" onClick={refresh}>
          Refresh Tip
        </Button>
      </div>

      {/* Panic Button */}
      <div className="mb-6">
        <Button variant="destructive" onClick={triggerPanic}>
          🚨 Panic Button
        </Button>
        {panicCountdown !== null && (
          <p className="mt-2 text-red-600">
            Calling caretaker in {panicCountdown}...
          </p>
        )}
      </div>

      {/* AI Chat */}
      <div className="mt-8">
        <EnhancedAIChat
          initialContext="Patient is 68 years old with diabetes and hypertension. Provide simple, clear advice."
        />
      </div>
    </div>
  );
}
