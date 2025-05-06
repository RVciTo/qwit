export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Addiction {
  name: string;
  quitDate: Date;
}

export interface Message {
  day: number;
  type: string;
  message: string;
}

export interface UserData {
  user: User;
  addictions: Addiction[];
  isOnboarded: boolean;
}
