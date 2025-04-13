
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { formatTimeRemaining } from "@/utils/format";
import { getAIAuctioneerResponse } from "@/utils/aiAuctioneer";
import { Bot, Clock } from "lucide-react";
import { toast } from "sonner";

const AIAuctioneer = () => {
  const { state } = useAppContext();
  const { auction, teams } = state;
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  
  // Generate AI response when auction state changes
  useEffect(() => {
    if (auction.status === 'bidding' && auction.currentPlayer) {
      generateAIResponse();
    }
  }, [auction.currentBid, auction.currentPlayer, auction.status]);
  
  // Timer countdown effect
  useEffect(() => {
    if (auction.status !== 'bidding') {
      setTimeRemaining(30);
      return;
    }
    
    if (timeRemaining <= 0) {
      toast.warning("Time's up! Finalizing the current bid.");
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auction.status, timeRemaining]);
  
  // Reset timer when bid changes
  useEffect(() => {
    if (auction.status === 'bidding') {
      setTimeRemaining(30);
    }
  }, [auction.currentBid]);
  
  const generateAIResponse = async () => {
    if (!auction.currentPlayer) return;
    
    setIsLoading(true);
    
    try {
      const response = await getAIAuctioneerResponse(
        auction.currentPlayer,
        auction.currentBid,
        teams,
        auction.previousBids
      );
      
      setAiResponse(response);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("Who will place the next bid?");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (auction.status === 'idle') {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">AI Auctioneer</h3>
        <p className="text-muted-foreground">
          Ready to assist with the auction process.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-cricket-blue/10 border border-cricket-blue/20 rounded-lg p-4 relative">
      <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/80 px-2 py-1 rounded text-xs">
        <Clock className="h-3 w-3" />
        <span>{formatTimeRemaining(timeRemaining)}</span>
      </div>
      
      <div className="flex items-start space-x-3 mb-3">
        <div className="bg-cricket-blue text-white p-2 rounded-full">
          <Bot className="h-5 w-5" />
        </div>
        
        <div>
          <p className="text-sm font-medium">AI Auctioneer</p>
          <p className="text-xs text-muted-foreground">Powered by LLama</p>
        </div>
      </div>
      
      <div className="min-h-[80px] mb-3">
        {isLoading ? (
          <div className="animate-pulse flex space-x-2 items-center">
            <div className="h-2 w-2 bg-cricket-blue rounded-full"></div>
            <div className="h-2 w-2 bg-cricket-blue rounded-full animation-delay-200"></div>
            <div className="h-2 w-2 bg-cricket-blue rounded-full animation-delay-500"></div>
            <span className="text-sm text-muted-foreground ml-1">Thinking</span>
          </div>
        ) : (
          <p className="text-lg">{aiResponse || "Let the bidding begin!"}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateAIResponse}
          disabled={isLoading || !auction.currentPlayer}
        >
          Prompt AI
        </Button>
      </div>
    </div>
  );
};

export default AIAuctioneer;
