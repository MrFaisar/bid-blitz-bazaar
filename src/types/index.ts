
export interface Player {
  id: string;
  name: string;
  age: number;
  type: PlayerType;
  battingStyle?: BattingStyle;
  bowlingStyle?: BowlingStyle;
  basePrice: number;
  stats: PlayerStats;
  imageUrl?: string;
  countryFlag?: string;
  nationality: string;
  isSold: boolean;
  soldTo?: string;
  soldAmount?: number;
}

export interface PlayerStats {
  matches?: number;
  runs?: number;
  average?: number;
  strikeRate?: number;
  wickets?: number;
  economy?: number;
  highestScore?: number;
  bestBowling?: string;
}

export type PlayerType = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
export type BattingStyle = 'Right-Handed' | 'Left-Handed';
export type BowlingStyle = 'Right-Arm Fast' | 'Right-Arm Medium' | 'Right-Arm Off-Spin' | 'Left-Arm Fast' | 'Left-Arm Medium' | 'Left-Arm Orthodox' | 'Leg-Spinner' | 'Chinaman' | 'None';

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  ownerName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
  budget: number;
  remainingBudget: number;
}

export interface AuctionState {
  status: 'idle' | 'bidding' | 'sold' | 'unsold';
  currentPlayer?: Player;
  currentBid: number;
  currentBidder?: Team;
  previousBids: BidHistory[];
  timer: number;
}

export interface BidHistory {
  teamId: string;
  amount: number;
  timestamp: number;
}

export interface UserRole {
  type: 'auctioneer' | 'team-owner';
  teamId?: string;
  name: string;
}

export interface ConnectionMode {
  type: 'online' | 'offline';
  sessionId: string;
  connectedUsers: UserRole[];
}

export interface AppState {
  players: Player[];
  teams: Team[];
  auction: AuctionState;
  userRole: UserRole;
  connection: ConnectionMode;
  theme: 'light' | 'dark';
}
