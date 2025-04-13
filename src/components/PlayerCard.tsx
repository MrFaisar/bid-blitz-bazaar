
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  isActive?: boolean;
  onClick?: () => void;
}

export default function PlayerCard({ player, isActive = false, onClick }: PlayerCardProps) {
  return (
    <Card 
      className={`cricket-card cursor-pointer transition-all ${
        isActive ? "ring-2 ring-cricket-orange" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{player.name} {player.countryFlag}</h3>
          <span className="text-sm bg-cricket-blue text-white px-2 py-1 rounded">
            {player.type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Age:</p>
            <p>{player.age} years</p>
          </div>
          <div>
            <p className="text-muted-foreground">Base Price:</p>
            <p className="font-semibold text-cricket-orange">{formatPrice(player.basePrice)}</p>
          </div>
          
          {player.battingStyle && (
            <div>
              <p className="text-muted-foreground">Batting:</p>
              <p>{player.battingStyle}</p>
            </div>
          )}
          
          {player.bowlingStyle && player.bowlingStyle !== 'None' && (
            <div>
              <p className="text-muted-foreground">Bowling:</p>
              <p>{player.bowlingStyle}</p>
            </div>
          )}
          
          {player.stats.matches && (
            <div>
              <p className="text-muted-foreground">Matches:</p>
              <p>{player.stats.matches}</p>
            </div>
          )}
          
          {player.stats.runs && (
            <div>
              <p className="text-muted-foreground">Runs:</p>
              <p>{player.stats.runs}</p>
            </div>
          )}
          
          {player.stats.wickets && (
            <div>
              <p className="text-muted-foreground">Wickets:</p>
              <p>{player.stats.wickets}</p>
            </div>
          )}
          
          {player.isSold && (
            <div className="col-span-2 mt-2">
              <p className="text-cricket-green font-semibold">
                Sold to {player.soldTo} for {player.soldAmount ? formatPrice(player.soldAmount) : 'n/a'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
