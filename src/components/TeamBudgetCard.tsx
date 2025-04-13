
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice, formatIndianNumber } from "@/utils/format";
import { Team } from "@/types";

interface TeamBudgetCardProps {
  team: Team;
  isCurrentBidder?: boolean;
}

export default function TeamBudgetCard({ team, isCurrentBidder = false }: TeamBudgetCardProps) {
  const teamStyle = {
    borderTop: `4px solid ${team.primaryColor}`,
    borderBottom: `1px solid ${team.secondaryColor}`,
  };
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${isCurrentBidder ? 'animate-pulse shadow-lg' : ''}`} 
      style={teamStyle}
    >
      <CardHeader className="pb-1">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{team.abbreviation}</h3>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {team.players.length} Players
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{team.name}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Total Budget:</p>
            <p>{formatIndianNumber(team.budget)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining:</p>
            <p className={`font-semibold ${team.remainingBudget < (team.budget * 0.2) ? 'text-cricket-red' : 'text-cricket-green'}`}>
              {formatIndianNumber(team.remainingBudget)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
