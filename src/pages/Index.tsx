import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ThemeToggle from "@/components/ThemeToggle";
import PlayerCard from "@/components/PlayerCard";
import TeamBudgetCard from "@/components/TeamBudgetCard";
import AuctionControls from "@/components/AuctionControls";
import PlayerForm from "@/components/PlayerForm";
import TeamForm from "@/components/TeamForm";
import ConnectionStatus from "@/components/ConnectionStatus";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Users, 
  List, 
  Gavel, 
  Edit, 
  Trash2,
  AlertTriangle,
  UserPlus
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { state, dispatch } = useAppContext();
  const [playerFormOpen, setPlayerFormOpen] = useState(false);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("auction");
  
  const { auction, players, teams, userRole } = state;
  const isAuctioneer = userRole.type === 'auctioneer';
  const isTeamOwner = userRole.type === 'team-owner';
  
  const handleOpenPlayerForm = (playerId?: string) => {
    if (playerId) {
      setEditingPlayer(playerId);
    } else {
      setEditingPlayer(null);
    }
    setPlayerFormOpen(true);
  };

  const handleOpenTeamForm = (teamId?: string) => {
    if (teamId) {
      setEditingTeam(teamId);
    } else {
      setEditingTeam(null);
    }
    setTeamFormOpen(true);
  };
  
  const handleStartAuction = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      dispatch({ type: 'START_AUCTION', payload: player });
    }
  };
  
  const handleDeletePlayer = (playerId: string) => {
    dispatch({ type: 'DELETE_PLAYER', payload: playerId });
  };

  const handleDeleteTeam = (teamId: string) => {
    dispatch({ type: 'DELETE_TEAM', payload: teamId });
  };
  
  const playerToEdit = editingPlayer 
    ? players.find(p => p.id === editingPlayer) 
    : undefined;

  const teamToEdit = editingTeam
    ? teams.find(t => t.id === editingTeam)
    : undefined;
  
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <ConnectionStatus />
      
      <header className="pt-6 pb-4 px-4 md:px-8">
        <div className="container max-w-7xl">
          <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-cricket-blue to-cricket-orange bg-clip-text text-transparent">
            Bid Blitz Bazaar
          </h1>
          <p className="text-muted-foreground">
            A real-time cricket auction platform
          </p>
        </div>
      </header>
      
      <main className="px-4 md:px-8 pb-20">
        <div className="container max-w-7xl">
          <Tabs 
            defaultValue="auction" 
            className="space-y-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="auction">
                <Gavel className="h-4 w-4 mr-2" />
                Auction
              </TabsTrigger>
              <TabsTrigger value="players">
                <List className="h-4 w-4 mr-2" />
                Players
              </TabsTrigger>
              <TabsTrigger value="teams">
                <Users className="h-4 w-4 mr-2" />
                Teams
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="auction" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                  {auction.status === 'idle' ? (
                    <div className="cricket-card flex flex-col items-center justify-center p-8">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <Gavel className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Active Auction</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        {isAuctioneer 
                          ? "Select a player from the list to start the auction" 
                          : "Waiting for the auctioneer to start the next auction"}
                      </p>
                      {isAuctioneer && (
                        <Button 
                          onClick={() => setActiveTab("players")}
                          className="bg-cricket-blue hover:bg-cricket-blue/90"
                        >
                          Go to Players List
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Current Auction</h2>
                      {auction.currentPlayer && (
                        <div className="cricket-card p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h2 className="text-2xl font-bold mb-1">
                                {auction.currentPlayer.name} {auction.currentPlayer.countryFlag}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                {auction.currentPlayer.type} • {auction.currentPlayer.age} years
                              </p>
                            </div>
                            <div className="bg-cricket-blue text-white px-3 py-1 rounded-full text-sm">
                              Base: ₹{(auction.currentPlayer.basePrice / 100000).toFixed(1)}L
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            {auction.currentPlayer.stats.matches && (
                              <div>
                                <p className="text-xs text-muted-foreground">Matches</p>
                                <p className="font-medium">{auction.currentPlayer.stats.matches}</p>
                              </div>
                            )}
                            
                            {auction.currentPlayer.stats.runs && (
                              <div>
                                <p className="text-xs text-muted-foreground">Runs</p>
                                <p className="font-medium">{auction.currentPlayer.stats.runs}</p>
                              </div>
                            )}
                            
                            {auction.currentPlayer.stats.average && (
                              <div>
                                <p className="text-xs text-muted-foreground">Average</p>
                                <p className="font-medium">{auction.currentPlayer.stats.average}</p>
                              </div>
                            )}
                            
                            {auction.currentPlayer.stats.strikeRate && (
                              <div>
                                <p className="text-xs text-muted-foreground">Strike Rate</p>
                                <p className="font-medium">{auction.currentPlayer.stats.strikeRate}</p>
                              </div>
                            )}
                            
                            {auction.currentPlayer.stats.wickets && (
                              <div>
                                <p className="text-xs text-muted-foreground">Wickets</p>
                                <p className="font-medium">{auction.currentPlayer.stats.wickets}</p>
                              </div>
                            )}
                            
                            {auction.currentPlayer.stats.economy && (
                              <div>
                                <p className="text-xs text-muted-foreground">Economy</p>
                                <p className="font-medium">{auction.currentPlayer.stats.economy}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm">
                            <div className="flex space-x-2 mb-1">
                              <span className="text-muted-foreground">Batting:</span>
                              <span>{auction.currentPlayer.battingStyle || 'N/A'}</span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <span className="text-muted-foreground">Bowling:</span>
                              <span>
                                {(auction.currentPlayer.bowlingStyle && auction.currentPlayer.bowlingStyle !== 'None') 
                                  ? auction.currentPlayer.bowlingStyle 
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <AuctionControls />
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-4 space-y-4">
                  <h2 className="text-xl font-bold">Team Budgets</h2>
                  <div className="space-y-3">
                    {teams.map(team => (
                      <TeamBudgetCard 
                        key={team.id} 
                        team={team} 
                        isCurrentBidder={auction.currentBidder?.id === team.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="players" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Players</h2>
                {(isAuctioneer || isTeamOwner) && (
                  <Button 
                    onClick={() => handleOpenPlayerForm()}
                    className="bg-cricket-blue hover:bg-cricket-blue/90"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map(player => (
                  <div key={player.id} className="relative">
                    <PlayerCard 
                      player={player} 
                      isActive={selectedPlayer === player.id}
                      onClick={() => setSelectedPlayer(player.id)}
                    />
                    
                    {selectedPlayer === player.id && (isAuctioneer || isTeamOwner) && (
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPlayerForm(player.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 bg-background/80 backdrop-blur-sm text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Player</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {player.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDeletePlayer(player.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    
                    {selectedPlayer === player.id && isAuctioneer && !player.isSold && auction.status === 'idle' && (
                      <div className="absolute bottom-2 right-2">
                        <Button 
                          size="sm" 
                          className="bg-cricket-orange hover:bg-cricket-orange/90"
                          onClick={() => handleStartAuction(player.id)}
                        >
                          <Gavel className="h-4 w-4 mr-1" />
                          Start Auction
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {players.length === 0 && (
                  <div className="col-span-full cricket-card flex flex-col items-center justify-center p-8">
                    <AlertTriangle className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="text-xl font-bold mb-2">No Players Available</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Add players to the system to begin the auction process
                    </p>
                    {(isAuctioneer || isTeamOwner) && (
                      <Button 
                        onClick={() => handleOpenPlayerForm()}
                        className="bg-cricket-blue hover:bg-cricket-blue/90"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Player
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Teams & Squads</h2>
                {(isAuctioneer || isTeamOwner) && (
                  <Button 
                    onClick={() => handleOpenTeamForm()}
                    className="bg-cricket-blue hover:bg-cricket-blue/90"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Team
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map(team => (
                  <div 
                    key={team.id} 
                    className="cricket-card relative"
                    style={{ borderTop: `4px solid ${team.primaryColor}` }}
                  >
                    {(isAuctioneer || isTeamOwner) && (
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                          onClick={() => handleOpenTeamForm(team.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 bg-background/80 backdrop-blur-sm text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {team.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDeleteTeam(team.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center">
                            <span className="font-medium text-foreground mr-1">Owner:</span> {team.ownerName}
                          </p>
                          {team.captainName && (
                            <p className="text-sm flex items-center">
                              <span className="font-medium mr-1">Captain:</span> 
                              <span className="text-cricket-blue">{team.captainName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Players: {team.players.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Budget: ₹{(team.remainingBudget / 10000000).toFixed(2)} Cr
                        </p>
                      </div>
                    </div>
                    
                    {team.players.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Squad</h4>
                        <div className="border rounded-md divide-y">
                          {team.players.map(player => (
                            <div key={player.id} className="p-2 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{player.name}</p>
                                <p className="text-xs text-muted-foreground">{player.type}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-cricket-orange">
                                  ₹{(player.soldAmount || 0) / 100000}L
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md bg-muted/50">
                        <p className="text-muted-foreground">No players acquired yet</p>
                      </div>
                    )}
                  </div>
                ))}

                {teams.length === 0 && (
                  <div className="col-span-full cricket-card flex flex-col items-center justify-center p-8">
                    <AlertTriangle className="h-8 w-8 text-cricket-orange mb-2" />
                    <h3 className="text-xl font-bold mb-2">No Teams Available</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Add teams to the system to begin the auction process
                    </p>
                    {(isAuctioneer || isTeamOwner) && (
                      <Button 
                        onClick={() => handleOpenTeamForm()}
                        className="bg-cricket-blue hover:bg-cricket-blue/90"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Team
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <PlayerForm 
        open={playerFormOpen} 
        onOpenChange={setPlayerFormOpen} 
        player={playerToEdit}
      />

      <TeamForm
        open={teamFormOpen}
        onOpenChange={setTeamFormOpen}
        team={teamToEdit}
      />
    </div>
  );
};

export default Index;
