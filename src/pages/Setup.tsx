
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowRight, 
  Wifi, 
  WifiOff, 
  User, 
  Users, 
  Gavel 
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { generateSessionCode } from "@/utils/qrcode";

const Setup = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  
  const [connectionType, setConnectionType] = useState<'online' | 'offline'>('online');
  const [userType, setUserType] = useState<'auctioneer' | 'team-owner'>('auctioneer');
  const [teamId, setTeamId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(generateSessionCode());
  const [joinSessionId, setJoinSessionId] = useState<string>('');
  
  const handleCreateSession = () => {
    // Set up the session
    dispatch({
      type: 'SET_CONNECTION_MODE',
      payload: {
        type: connectionType,
        sessionId,
        connectedUsers: [
          {
            type: userType,
            name: userName || (userType === 'auctioneer' ? 'Auctioneer' : 'Team Owner'),
            teamId: userType === 'team-owner' ? teamId : undefined,
          }
        ],
      },
    });
    
    // Set user role
    dispatch({
      type: 'SET_USER_ROLE',
      payload: {
        type: userType,
        name: userName || (userType === 'auctioneer' ? 'Auctioneer' : 'Team Owner'),
        teamId: userType === 'team-owner' ? teamId : undefined,
      },
    });
    
    // Navigate to the main app
    navigate('/');
  };
  
  const handleJoinSession = () => {
    if (!joinSessionId.trim()) {
      // Show error in a real app
      return;
    }
    
    // Set up connection
    dispatch({
      type: 'SET_CONNECTION_MODE',
      payload: {
        type: connectionType,
        sessionId: joinSessionId,
        connectedUsers: [
          {
            type: userType,
            name: userName || (userType === 'auctioneer' ? 'Auctioneer' : 'Team Owner'),
            teamId: userType === 'team-owner' ? teamId : undefined,
          }
        ],
      },
    });
    
    // Set user role
    dispatch({
      type: 'SET_USER_ROLE',
      payload: {
        type: userType,
        name: userName || (userType === 'auctioneer' ? 'Auctioneer' : 'Team Owner'),
        teamId: userType === 'team-owner' ? teamId : undefined,
      },
    });
    
    // Navigate to main app
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ThemeToggle />
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-heading bg-gradient-to-r from-cricket-blue to-cricket-orange bg-clip-text text-transparent">
            Bid Blitz Bazaar
          </CardTitle>
          <CardDescription>
            Set up your cricket auction platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Connection Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={connectionType === 'online' ? 'default' : 'outline'}
                className={connectionType === 'online' ? 'bg-cricket-blue' : ''}
                onClick={() => setConnectionType('online')}
              >
                <Wifi className="mr-2 h-4 w-4" />
                Online
              </Button>
              <Button
                type="button"
                variant={connectionType === 'offline' ? 'default' : 'outline'}
                className={connectionType === 'offline' ? 'bg-cricket-blue' : ''}
                onClick={() => setConnectionType('offline')}
              >
                <WifiOff className="mr-2 h-4 w-4" />
                Offline
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {connectionType === 'online' 
                ? 'Connect via internet to users anywhere' 
                : 'Connect via local network to users nearby'}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={userType === 'auctioneer' ? 'default' : 'outline'}
                className={userType === 'auctioneer' ? 'bg-cricket-blue' : ''}
                onClick={() => setUserType('auctioneer')}
              >
                <Gavel className="mr-2 h-4 w-4" />
                Auctioneer
              </Button>
              <Button
                type="button"
                variant={userType === 'team-owner' ? 'default' : 'outline'}
                className={userType === 'team-owner' ? 'bg-cricket-blue' : ''}
                onClick={() => setUserType('team-owner')}
              >
                <User className="mr-2 h-4 w-4" />
                Team Owner
              </Button>
            </div>
            
            <div className="space-y-2 mt-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder={userType === 'auctioneer' ? 'Auctioneer Name' : 'Team Owner Name'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            
            {userType === 'team-owner' && (
              <div className="space-y-2 mt-2">
                <label className="text-sm font-medium">Select Your Team</label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Mumbai Indians</SelectItem>
                    <SelectItem value="2">Chennai Super Kings</SelectItem>
                    <SelectItem value="3">Royal Challengers Bangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Session</TabsTrigger>
              <TabsTrigger value="join">Join Session</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Code</label>
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Create a new auction session that others can join
                </p>
              </div>
              
              <Button 
                className="w-full bg-cricket-blue hover:bg-cricket-blue/90"
                onClick={handleCreateSession}
                disabled={userType === 'team-owner' && !teamId}
              >
                Create Auction
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
            
            <TabsContent value="join" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Code</label>
                <Input
                  placeholder="Enter session code"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the code provided by the auctioneer
                </p>
              </div>
              
              <Button 
                className="w-full bg-cricket-orange hover:bg-cricket-orange/90"
                onClick={handleJoinSession}
                disabled={(userType === 'team-owner' && !teamId) || !joinSessionId.trim()}
              >
                Join Auction
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          <p>Connect team owners and auctioneers for a live bidding experience</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Setup;
