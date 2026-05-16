export interface PointsProgram {
  id: string;
  name: string;
  provider: string;
  balance: number;
  estimatedValue: number;
  expiryDate?: string;
  icon: string;
  color: string;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  rewardRate: number;
  bonusCategories: BonusCategory[];
  signupBonus?: number;
  signupSpendReq?: number;
  icon: string;
  color: string;
  recommended?: boolean;
}

export interface BonusCategory {
  category: string;
  multiplier: number;
  cap?: number;
}

export interface SpendCategory {
  name: string;
  amount: number;
  currentCard: string;
  optimalCard: string;
  currentReward: number;
  optimalReward: number;
  missedReward: number;
}

export interface TravelSearch {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  cabin: "economy" | "premium" | "business" | "first";
  passengers: number;
  flexible: boolean;
}

export interface AwardResult {
  id: string;
  airline: string;
  route: string;
  departDate: string;
  cabin: string;
  pointsRequired: number;
  taxesFees: number;
  program: string;
  transferPartner?: string;
  transferRatio?: string;
  availability: "available" | "waitlist" | "limited";
  valuePerPoint: number;
}

export interface TransferBonus {
  id: string;
  from: string;
  to: string;
  bonusPercent: number;
  expiryDate: string;
  isActive: boolean;
}

export interface HealthAlert {
  id: string;
  type: "expiry" | "devaluation" | "bonus" | "inflation";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  actionRequired: boolean;
  deadline?: string;
  program: string;
}

export interface ContentArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "draft" | "review" | "published";
  author: string;
  createdAt: string;
  publishedAt?: string;
  tags: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  monthlySpend: number;
  totalPoints: number;
  tier: "free" | "pro" | "executive";
  joinedAt: string;
  lastActive: string;
  trips: number;
  notes: string[];
}

export interface AffiliateLink {
  id: string;
  cardName: string;
  issuer: string;
  clicks: number;
  conversions: number;
  revenue: number;
  url: string;
}

export interface MembershipTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
