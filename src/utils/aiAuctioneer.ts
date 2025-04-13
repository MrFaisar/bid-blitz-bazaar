
import { Player, Team } from "../types";

// In a real app, this would connect to the Llama API
export async function getAIAuctioneerResponse(
  player: Player,
  currentBid: number,
  teams: Team[],
  previousBids: { teamId: string; amount: number; timestamp: number }[]
): Promise<string> {
  // Simple mock response logic
  const responses = [
    `We have a current bid of ${formatIndianCurrency(currentBid)} for ${player.name}. Do I hear ${formatIndianCurrency(currentBid + getNextBidIncrement(currentBid))}?`,
    `${formatIndianCurrency(currentBid)} for this excellent ${player.type.toLowerCase()}. Who will give me ${formatIndianCurrency(currentBid + getNextBidIncrement(currentBid))}?`,
    `The bid is at ${formatIndianCurrency(currentBid)}. ${player.name} with a strike rate of ${player.stats.strikeRate || 'N/A'}. Can I get ${formatIndianCurrency(currentBid + getNextBidIncrement(currentBid))}?`,
    `${formatIndianCurrency(currentBid)} is the current bid. This is a player with ${player.stats.matches || 0} matches experience. Will anyone bid ${formatIndianCurrency(currentBid + getNextBidIncrement(currentBid))}?`
  ];

  if (previousBids.length > 0) {
    const lastTeam = teams.find(t => t.id === previousBids[previousBids.length - 1].teamId);
    if (lastTeam) {
      responses.push(
        `${lastTeam.name} has bid ${formatIndianCurrency(currentBid)}. Do I hear ${formatIndianCurrency(currentBid + getNextBidIncrement(currentBid))}?`
      );
    }
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return responses[Math.floor(Math.random() * responses.length)];
}

function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getNextBidIncrement(currentBid: number): number {
  if (currentBid < 1000000) return 100000; // Less than 10L: increment by 1L
  if (currentBid < 5000000) return 500000; // Less than 50L: increment by 5L
  if (currentBid < 10000000) return 1000000; // Less than 1Cr: increment by 10L
  return 2000000; // More than 1Cr: increment by 20L
}
