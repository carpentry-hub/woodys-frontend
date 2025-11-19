

// Esta interfaz ahora refleja la estructura de datos del usuario que envía el backend en Go.
export interface User {
  profile_picture_url: undefined;
  id: number;
  username: string;
  email: string;
  reputation: number;
  profile_picture?: number;
  firebase_uid: string;
  created_at: string;
}
