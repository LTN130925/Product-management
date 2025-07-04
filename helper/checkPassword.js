module.exports.isValidPassword = (password) => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasNoWhitespace = /^\S+$/.test(password);
  const hasLength = password.length >= 8 && password.length <= 16;

  return hasUpper && hasLower && hasDigit && hasSpecial && hasLength && hasNoWhitespace;
};

