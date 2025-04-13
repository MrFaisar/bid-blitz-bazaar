import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Player, Team, UserRole, ConnectionMode } from '../types';

// Initial state
const initialState: AppState = {
  players: [],
  teams: [],
  auction: {
    status: 'idle',
    currentBid: 0,
    previousBids: [],
    timer: 30,
  },
  userRole: {
    type: 'auctioneer',
    name: 'Auctioneer',
  },
  connection: {
    type: 'online',
    sessionId: '',
    connectedUsers: [],
  },
  theme: 'light',
};

// Action types
type ActionType =
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'UPDATE_PLAYER'; payload: Player }
  | { type: 'DELETE_PLAYER'; payload: string }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'UPDATE_TEAM'; payload: Team }
  | { type: 'DELETE_TEAM'; payload: string }
  | { type: 'START_AUCTION'; payload: Player }
  | { type: 'PLACE_BID'; payload: { teamId: string; amount: number } }
  | { type: 'FINALIZE_BID'; payload: { sold: boolean; teamId?: string; amount?: number } }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_CONNECTION_MODE'; payload: ConnectionMode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESET_AUCTION' };

// Reducer
const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.id ? action.payload : player
        ),
      };
    
    case 'DELETE_PLAYER':
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload),
      };
    
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
    
    case 'UPDATE_TEAM':
      return {
        ...state,
        teams: state.teams.map(team => 
          team.id === action.payload.id ? action.payload : team
        ),
      };
    
    case 'DELETE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
      };
    
    case 'START_AUCTION':
      return {
        ...state,
        auction: {
          ...state.auction,
          status: 'bidding',
          currentPlayer: action.payload,
          currentBid: action.payload.basePrice,
          currentBidder: undefined,
          previousBids: [],
          timer: 30,
        },
      };
    
    case 'PLACE_BID':
      const currentTeam = state.teams.find(team => team.id === action.payload.teamId);
      if (!currentTeam) return state;
      
      return {
        ...state,
        auction: {
          ...state.auction,
          currentBid: action.payload.amount,
          currentBidder: currentTeam,
          previousBids: [
            ...state.auction.previousBids,
            {
              teamId: action.payload.teamId,
              amount: action.payload.amount,
              timestamp: Date.now(),
            },
          ],
          timer: 30, // Reset timer on new bid
        },
      };
    
    case 'FINALIZE_BID':
      if (!state.auction.currentPlayer) return state;
      
      let updatedPlayers = [...state.players];
      let updatedTeams = [...state.teams];
      
      const playerIndex = updatedPlayers.findIndex(p => p.id === state.auction.currentPlayer!.id);
      
      if (playerIndex >= 0) {
        // Update the player
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          isSold: action.payload.sold,
          soldTo: action.payload.teamId,
          soldAmount: action.payload.amount,
        };
        
        // If sold, update the team
        if (action.payload.sold && action.payload.teamId) {
          const teamIndex = updatedTeams.findIndex(t => t.id === action.payload.teamId);
          if (teamIndex >= 0 && action.payload.amount) {
            const player = updatedPlayers[playerIndex];
            updatedTeams[teamIndex] = {
              ...updatedTeams[teamIndex],
              players: [...updatedTeams[teamIndex].players, player],
              remainingBudget: updatedTeams[teamIndex].remainingBudget - action.payload.amount,
            };
          }
        }
      }
      
      return {
        ...state,
        players: updatedPlayers,
        teams: updatedTeams,
        auction: {
          ...state.auction,
          status: action.payload.sold ? 'sold' : 'unsold',
        },
      };
    
    case 'RESET_AUCTION':
      return {
        ...state,
        auction: {
          ...state.auction,
          status: 'idle',
          currentPlayer: undefined,
          currentBid: 0,
          currentBidder: undefined,
          previousBids: [],
          timer: 30,
        },
      };
    
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
    
    case 'SET_CONNECTION_MODE':
      return { ...state, connection: action.payload };
    
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { ...state, theme: newTheme };
    
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      dispatch({ type: 'TOGGLE_THEME' });
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Load mock data for demo
  useEffect(() => {
    // For demo purposes, let's add some mock data
    if (state.players.length === 0) {
      const mockPlayers: Player[] = [
        {
          id: '1',
          name: 'Virat Kohli',
          age: 33,
          type: 'Batsman',
          battingStyle: 'Right-Handed',
          basePrice: 20000000, // 2 Crore
          stats: {
            matches: 207,
            runs: 6624,
            average: 51.35,
            strikeRate: 129.8,
            highestScore: 113,
          },
          nationality: 'India',
          countryFlag: '🇮🇳',
          isSold: false,
        },
        {
          id: '2',
          name: 'Jasprit Bumrah',
          age: 28,
          type: 'Bowler',
          bowlingStyle: 'Right-Arm Fast',
          basePrice: 15000000, // 1.5 Crore
          stats: {
            matches: 106,
            wickets: 145,
            economy: 7.39,
            bestBowling: '5/10',
          },
          nationality: 'India',
          countryFlag: '🇮🇳',
          isSold: false,
        },
        {
          id: '3',
          name: 'Hardik Pandya',
          age: 29,
          type: 'All-Rounder',
          battingStyle: 'Right-Handed',
          bowlingStyle: 'Right-Arm Medium',
          basePrice: 18000000, // 1.8 Crore
          stats: {
            matches: 92,
            runs: 1476,
            wickets: 57,
            strikeRate: 153.9,
            economy: 8.52,
          },
          nationality: 'India',
          countryFlag: '🇮🇳',
          isSold: false,
        },
      ];
      
      dispatch({ type: 'SET_PLAYERS', payload: mockPlayers });
    }
    
    if (state.teams.length === 0) {
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Mumbai Indians',
          abbreviation: 'MI',
          ownerName: 'Akash Ambani',
          primaryColor: '#004BA0',
          secondaryColor: '#D1AB3E',
          players: [],
          budget: 900000000, // 90 Crore
          remainingBudget: 900000000,
        },
        {
          id: '2',
          name: 'Chennai Super Kings',
          abbreviation: 'CSK',
          ownerName: 'N. Srinivasan',
          primaryColor: '#F9CD05',
          secondaryColor: '#0081E4',
          players: [],
          budget: 900000000, // 90 Crore
          remainingBudget: 900000000,
        },
        {
          id: '3',
          name: 'Royal Challengers Bangalore',
          abbreviation: 'RCB',
          ownerName: 'Vijay Mallya',
          primaryColor: '#EC1C24',
          secondaryColor: '#000000',
          players: [],
          budget: 900000000, // 90 Crore
          remainingBudget: 900000000,
        },
      ];
      
      dispatch({ type: 'SET_TEAMS', payload: mockTeams });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
