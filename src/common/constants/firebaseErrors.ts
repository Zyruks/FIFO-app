export const FirebaseAuthErrorCodes = {
  /**
   * The default error code.
   */
  INVALID_CREDENTIALS: 'auth/invalid-credentials',

  /**
   * The error code for when the user account has been
   * disabled.
   */
  USER_DISABLED: 'auth/user-disabled',

  /**
   * The error code for when there are too many requests.
   */
  TOO_MANY_REQUESTS: 'auth/too-many-requests',

  /**
   * The error code for when the operation is not allowed.
   */
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
};

export const ErrorMessages = {
  [FirebaseAuthErrorCodes.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [FirebaseAuthErrorCodes.USER_DISABLED]: 'This account has been disabled.',
  [FirebaseAuthErrorCodes.TOO_MANY_REQUESTS]: 'Too many attempts. Please try again later.',
  [FirebaseAuthErrorCodes.OPERATION_NOT_ALLOWED]: 'This operation is not allowed.',
  DEFAULT_LOGIN_ERROR: 'Login failed. Please try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
};
