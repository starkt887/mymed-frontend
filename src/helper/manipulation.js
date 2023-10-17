export const _sanitizeObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (
        v === null ||
        v === undefined ||
        (typeof v === "string" && v.trim() === "")
      )
        return false;
      return true;
    })
  );
};

export const profileChecker = (obj) => {
  let completion = true;
  let personal = true;
  let professional = true;
  let scheduler = true;
  let progress = 0;
  const personalFields = [
    "name",
    "mobile",
    "dob",
    "gender",
    "age",
    "address",
    "city",
    "state",
    "country",
    "blood_group",
    "height",
    "weight",
  ];
  const professionalFields = [
    "fees",
    "speciality",
    "degree",
    "license",
    "experience",
    "clinic_name",
    "work_address",
    "work_city",
    "work_state",
    "work_zip_code",
  ];
  const schedulerFields = ["schedule"];
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (
        personalFields.includes(_) &&
        (v == null ||
          v.length === 0 ||
          (typeof v === "object" && Object.keys(v).length === 0))
      ) {
        completion = false;
        personal = false;
      }
    })
  );
  if (personal) progress += 30;
  else progress += 10;
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (
        professionalFields.includes(_) &&
        (v == null ||
          v.length === 0 ||
          (typeof v === "object" && Object.keys(v).length === 0))
      ) {
        completion = false;
        professional = false;
      }
    })
  );
  if (professional) progress += 50;
  else progress += 20;
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (
        schedulerFields.includes(_) &&
        (v == null ||
          v.length === 0 ||
          (typeof v === "object" && Object.keys(v).length === 0))
      ) {
        completion = false;
        scheduler = false;
      }
    })
  );
  if (scheduler) progress += 20;
  return { completion, progress };
};
