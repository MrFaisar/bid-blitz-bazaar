
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import { useAppContext } from "@/context/AppContext";
import { Gavel, Ban, CheckCircle } from "lucide-react";

export default function AuctionControls() {
  const { state, dispatch } = useAppContext();
  const [customBid, setCustomBid] = useState<string>("");
  
  const { auction, userRole } = state;
  const isAuctioneer = userRole.type === 'auctioneer';
  const isTeamOwner = userRole.type === 'team-owner';
  
  if (!auction.currentPlayer) return null;
  
  // Calculate the next bid increment
  const getBidIncrement = (currentBid: number) => {
    if (currentBid < 1000000) return 100000; // Less than 10L: increment 1L
    if (currentBid < 5000000) return 500000; // Less than 50L: increment 5L
    if (currentBid < 10000000) return 1000000; // Less than 1Cr: increment 10L
    return 2000000; // More than 1Cr: increment 20L
  };
  
  const nextBidAmount = auction.currentBid + getBidIncrement(auction.currentBid);
  
  const handlePlaceBid = () => {
    if (!isTeamOwner || !userRole.teamId) return;
    
    dispatch({
      type: 'PLACE_BID',
      payload: {
        teamId: userRole.teamId,
        amount: nextBidAmount,
      },
    });
  };
  
  const handleCustomBid = () => {
    if (!isTeamOwner || !userRole.teamId) return;
    
    const amount = parseInt(customBid);
    if (isNaN(amount) || amount <= auction.currentBid) return;
    
    dispatch({
      type: 'PLACE_BID',
      payload: {
        teamId: userRole.teamId,
        amount,
      },
    });
    
    setCustomBid("");
  };
  
  const handleFinalizeBid = (sold: boolean) => {
    if (!isAuctioneer) return;
    
    dispatch({
      type: 'FINALIZE_BID',
      payload: {
        sold,
        teamId: auction.currentBidder?.id,
        amount: auction.currentBid,
      },
    });
    
    // Return to idle state after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'RESET_AUCTION' });
    }, 3000);
  };
  
  return (
    <Card className="shadow-lg border-t-4 border-t-cricket-blue">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Current bid display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Current Bid</p>
            <p className="text-3xl font-bold text-cricket-orange">
              {formatPrice(auction.currentBid)}
            </p>
            {auction.currentBidder && (
              <p className="text-sm mt-1">
                by <span className="font-medium">{auction.currentBidder.name}</span>
              </p>
            )}
          </div>
          
          {/* Bidding controls for team owners */}
          {isTeamOwner && auction.status === 'bidding' && (
            <div className="space-y-2">
              <Button 
                className="w-full bg-cricket-green hover:bg-cricket-green/90"
                onClick={handlePlaceBid}
              >
                Bid {formatPrice(nextBidAmount)}
              </Button>
              
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Custom bid amount"
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCustomBid}>Bid</Button>
              </div>
            </div>
          )}
          
          {/* Auctioneer controls */}
          {isAuctioneer && auction.status === 'bidding' && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 border-cricket-red text-cricket-red hover:bg-cricket-red hover:text-white"
                onClick={() => handleFinalizeBid(false)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Unsold
              </Button>
              <Button 
                className="flex-1 bg-cricket-green hover:bg-cricket-green/90"
                onClick={() => handleFinalizeBid(true)}
                disabled={!auction.currentBidder}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Sold
              </Button>
            </div>
          )}
          
          {/* Status display for sold/unsold */}
          {auction.status === 'sold' && (
            <div className="text-center py-2 bg-cricket-green/20 rounded-md">
              <Gavel className="inline-block mr-2" />
              <span className="font-medium">
                Sold to {auction.currentBidder?.name} for {formatPrice(auction.currentBid)}
              </span>
            </div>
          )}
          
          {auction.status === 'unsold' && (
            <div className="text-center py-2 bg-cricket-red/20 rounded-md">
              <Ban className="inline-block mr-2" />
              <span className="font-medium">Player Unsold</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
