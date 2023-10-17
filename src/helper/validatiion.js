export const _isEmpty = (value) => {
  if (value === "" || value === null || value === undefined) return true;
  else return false;
};

export const _isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const _isMobile = (mobile) => {
  return mobile.match(/^[789]\d{9}$$/);
};

export const _isAadharNumber = (card) => {
  return card.match(/^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/);
};

export const _isEmptyObject = (obj) => {
  return JSON.stringify(obj) === "{}";
};

export const isDoctor = (role) => {
  return role === "DOCTOR";
};
