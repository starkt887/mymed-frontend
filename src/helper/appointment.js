export const notificationSender = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profilepic: user.profilepic,
});

export const messageModifier = (message, ...params) => {
  let newMessage = message;
  for (let i = 0; i < params.length; i++) {
    newMessage = newMessage.replace(`{{${i}}}`, params[i]);
  }
  return newMessage;
};

export const notificationSubjects = {
  virtualAppointment: "Online Appointment Scheduled",
  physicalAppointment: "Physical Appointment Scheduled",
  rescheduleAppointment: "Appointment Re-scheduled",
  initiateAppointment: "Appointment Initiated",
  medicalRecordShare: "Medical Record Shared",
  prescriptionGenerated: "Prescription Generated",
};

export const notificationMessages = {
  virtualAppointment:
    "An online appointment has been scheduled with {{0}} on {{1}} at {{2}}.",
  physicalAppointment:
    "A physical appointment has been scheduled with {{0}} on {{1}} at {{2}}.",
  rescheduleAppointment:
    "Appointment has been 're-scheduled' from {{0}} {{1}} to {{2}} {{3}} by {{4}}.",
  initiateAppointment:
    "Appointment has been initiated by {{0}} which was scheduled on {{1}} at {{2}}",
  medicalRecordShare:
    "Medical record '{{0}}' has been shared by {{1}} on {{2}}.",
  multiMedicalRecordShare:
    "Medical record(s) has been shared by {{0}} on {{1}}.",
  prescriptionGenerated:
    "Prescription has been generated for appointment on {{0}} {{1}} by {{2}}",
};
