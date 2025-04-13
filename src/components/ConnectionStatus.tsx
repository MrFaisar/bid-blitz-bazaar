
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, User, Share } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function ConnectionStatus() {
  const { state } = useAppContext();
  const { connection, userRole } = state;
  
  const isOnline = connection.type === 'online';
  const connectedCount = connection.connectedUsers.length;
  
  const sessionLink = isOnline
    ? `${window.location.origin}/join?session=${connection.sessionId}`
    : '';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink);
    // In a real app, we would use a toast notification here
    alert("Link copied to clipboard!");
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className={`px-3 py-1 ${
                isOnline ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
              }`}
            >
              {isOnline 
                ? <Wifi className="h-3 w-3 mr-1 text-cricket-green" /> 
                : <WifiOff className="h-3 w-3 mr-1 text-amber-500" />
              }
              <span className="text-xs">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isOnline ? 'Connected to server' : 'Local network mode'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="px-3 py-1">
              <User className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {userRole.type === 'auctioneer' ? 'Auctioneer' : 'Team Owner'}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Your current role</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover>
              <PopoverTrigger asChild>
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 cursor-pointer hover:bg-muted"
                >
                  <Share className="h-3 w-3 mr-1" />
                  <span className="text-xs">Share</span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-80">
                <div className="space-y-4">
                  <div className="text-sm">
                    <h4 className="font-medium">Session Code: {connection.sessionId}</h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      Share this code with team owners to join this auction.
                    </p>
                  </div>
                  
                  {isOnline && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Share Link</h4>
                      <div className="flex space-x-2">
                        <input 
                          readOnly
                          value={sessionLink}
                          className="flex-1 px-3 py-1 text-xs bg-muted rounded border"
                        />
                        <Button size="sm" onClick={handleCopyLink}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!isOnline && (
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-muted">
                      {/* In a real app, we would render a QR code here */}
                      <div className="w-32 h-32 border-2 border-dashed flex items-center justify-center">
                        <p className="text-xs text-center text-muted-foreground">
                          QR Code for<br/>Session: {connection.sessionId}
                        </p>
                      </div>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Scan to connect via local network
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {connectedCount} user{connectedCount !== 1 ? 's' : ''} connected
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Share session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
