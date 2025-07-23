import { auth } from '../lib/firebase';

export async function getIdTokenHeader(): Promise<{ Authorization?: string }> {
  if (typeof window === 'undefined') return {};
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}
