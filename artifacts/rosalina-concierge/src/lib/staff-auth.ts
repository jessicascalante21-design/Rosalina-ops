const STAFF_PIN = import.meta.env.VITE_STAFF_PIN || "Rosalina2025!";
const SESSION_KEY = "rosalina_staff_session";
const SESSION_HOURS = 8;

interface StaffSession {
  authenticated: boolean;
  expiresAt: number;
}

export function checkStaffPin(pin: string): boolean {
  return pin === STAFF_PIN;
}

export function createSession(): void {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const session: StaffSession = { authenticated: true, expiresAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session: StaffSession = JSON.parse(raw);
    if (!session.authenticated) return false;
    if (Date.now() > session.expiresAt) {
      clearSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionExpiry(): Date | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: StaffSession = JSON.parse(raw);
    return new Date(session.expiresAt);
  } catch {
    return null;
  }
}
