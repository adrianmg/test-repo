export function validateEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
  if (!username || username.trim().length < 3) {
    return false;
  }
  return /^[a-zA-Z0-9_-]+$/.test(username);
}
