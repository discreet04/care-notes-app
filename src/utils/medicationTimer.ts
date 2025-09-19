export const calculateTimeUntilDose = (medicationTime: string): string => {
  if (!medicationTime) return "No time set";
  
  const now = new Date();
  const [hours, minutes] = medicationTime.split(':').map(Number);
  
  const medicationDateTime = new Date();
  medicationDateTime.setHours(hours, minutes, 0, 0);
  
  // If the medication time has passed today, it's for tomorrow
  if (medicationDateTime < now) {
    medicationDateTime.setDate(medicationDateTime.getDate() + 1);
  }
  
  const timeDiff = medicationDateTime.getTime() - now.getTime();
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hoursLeft === 0 && minutesLeft === 0) {
    return "Time to take medicine!";
  }
  
  if (hoursLeft === 0) {
    return `${minutesLeft} mins left`;
  }
  
  if (hoursLeft < 1) {
    return `${minutesLeft} mins left`;
  }
  
  return `${hoursLeft}h ${minutesLeft}m left`;
};

export const getMedicationStatus = (medicationTime: string): "urgent" | "soon" | "normal" => {
  if (!medicationTime) return "normal";
  
  const now = new Date();
  const [hours, minutes] = medicationTime.split(':').map(Number);
  
  const medicationDateTime = new Date();
  medicationDateTime.setHours(hours, minutes, 0, 0);
  
  if (medicationDateTime < now) {
    medicationDateTime.setDate(medicationDateTime.getDate() + 1);
  }
  
  const timeDiff = medicationDateTime.getTime() - now.getTime();
  const minutesLeft = Math.floor(timeDiff / (1000 * 60));
  
  if (minutesLeft <= 30) return "urgent";
  if (minutesLeft <= 120) return "soon";
  return "normal";
};