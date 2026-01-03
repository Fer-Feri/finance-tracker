// types/user.ts
export interface UserProfile {
  name: string;
  email?: string;
  image?: string;
}

export interface HeaderLeftProps {
  user: UserProfile;
  isGuest: boolean;
}

export interface ProfileProps {
  user: UserProfile;
  isGuest: boolean;
}
