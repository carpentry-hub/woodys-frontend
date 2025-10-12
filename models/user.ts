

// Esta interfaz ahora refleja la estructura de datos del usuario que envía el backend en Go.
export interface User {
  id: number;
  username: string;
  email: string;
  reputation: number;
  profile_picture?: string;
  firebase_uid: string;
  created_at: string;
}
