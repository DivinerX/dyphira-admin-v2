export interface User {
  id: string;
  name: string;
  email: string;
  referredBy: string | null;
  createdAt: string;
  referralCount: number;
  xp: number;
  credits: number;
  twitterConnected: boolean;
  twitterHandle?: string;
}

export interface Interview {
  id: string;
  userId: string;
  date: string;
  type: string;
  status: string;
  score?: number;
  feedback?: string;
  videoUrl: string;
}