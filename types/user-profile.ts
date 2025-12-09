// types/user.ts
export interface UserProfile {
  name: string;
  email?: string;
  image?: string;
}

export interface HeaderLeftProps {
  user: UserProfile;
}

export interface ProfileProps {
  user: UserProfile;
}
