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
  socialCapital?: number;
  credits: number;
  verified: boolean;
  twitterId?: string;
  twitterScore?: number | null;
}

export interface Assessment {
  _id: string;
  userId: string;
  status: string;
  updatedAt: string;
  completedAt: string;
  videoUrl: string;
  feedback?: string;
  score: {
    IQ?: number;
    evangelism?: number;
    determination?: number;
    effectiveness?: number;
    vision?: number;
  };
}