export const RegexPatterns = {
  email: /\S+@\S+\.\S+/,
  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/,
  noEmpty: /^(?!\s*$).+/,
};
