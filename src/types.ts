export interface User {
  _id: string;
  username: string;
  email: string;
  referredBy: {
    email: string;
    _id: string;
  } | null;
  fund: {
    referrals: User[];
  };
  createdAt: string;
  referralCount: number;
  xp: number;
  credits: number;
  verified: boolean;
  twitterId?: string;
  twitterScore?: number | null;
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

export interface Assessment {
  _id: string;
  userId: string;
  date: string;
  score: number;
  feedback: string;
  videoUrl: string; 
}