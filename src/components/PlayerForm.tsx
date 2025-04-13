
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Player, PlayerType, BattingStyle, BowlingStyle } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player?: Player;
}

export default function PlayerForm({ open, onOpenChange, player }: PlayerFormProps) {
  const { dispatch } = useAppContext();
  const defaultValues = {
    name: "",
    age: "25",
    type: "Batsman" as PlayerType,
    battingStyle: "Right-Handed" as BattingStyle,
    bowlingStyle: "None" as BowlingStyle,
    basePrice: "1000000",
    nationality: "India",
    matches: "0",
    runs: "0",
    average: "0",
    strikeRate: "0",
    wickets: "0",
    economy: "0",
  };
  
  const [formValues, setFormValues] = useState(defaultValues);
  
  useEffect(() => {
    if (player) {
      setFormValues({
        name: player.name,
        age: player.age.toString(),
        type: player.type,
        battingStyle: player.battingStyle || "Right-Handed",
        bowlingStyle: player.bowlingStyle || "None",
        basePrice: player.basePrice.toString(),
        nationality: player.nationality,
        matches: player.stats.matches?.toString() || "0",
        runs: player.stats.runs?.toString() || "0",
        average: player.stats.average?.toString() || "0",
        strikeRate: player.stats.strikeRate?.toString() || "0",
        wickets: player.stats.wickets?.toString() || "0",
        economy: player.stats.economy?.toString() || "0",
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [player, open]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlayer: Player = {
      id: player?.id || Date.now().toString(),
      name: formValues.name,
      age: parseInt(formValues.age),
      type: formValues.type as PlayerType,
      battingStyle: formValues.battingStyle as BattingStyle,
      bowlingStyle: formValues.bowlingStyle as BowlingStyle,
      basePrice: parseInt(formValues.basePrice),
      nationality: formValues.nationality,
      stats: {
        matches: parseInt(formValues.matches),
        runs: parseInt(formValues.runs),
        average: parseFloat(formValues.average),
        strikeRate: parseFloat(formValues.strikeRate),
        wickets: parseInt(formValues.wickets),
        economy: parseFloat(formValues.economy),
      },
      countryFlag: getCountryFlag(formValues.nationality),
      isSold: player?.isSold || false,
      soldTo: player?.soldTo,
      soldAmount: player?.soldAmount,
    };
    
    if (player) {
      dispatch({ type: 'UPDATE_PLAYER', payload: newPlayer });
      toast.success('Player updated successfully');
    } else {
      dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
      toast.success('Player added successfully');
    }
    
    onOpenChange(false);
  };
  
  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'England': '🇬🇧',
      'South Africa': '🇿🇦',
      'New Zealand': '🇳🇿',
      'West Indies': '🌴',
      'Pakistan': '🇵🇰',
      'Sri Lanka': '🇱🇰',
      'Bangladesh': '🇧🇩',
      'Afghanistan': '🇦🇫',
    };
    
    return flags[country] || '🏏';
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {player ? 'Edit Player' : 'Add New Player'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Player Name</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
                placeholder="Enter player name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formValues.age}
                onChange={handleInputChange}
                required
                min="16"
                max="45"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Player Type</Label>
              <Select
                value={formValues.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                  <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Select
                value={formValues.nationality}
                onValueChange={(value) => handleSelectChange("nationality", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="England">England</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="New Zealand">New Zealand</SelectItem>
                  <SelectItem value="West Indies">West Indies</SelectItem>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="battingStyle">Batting Style</Label>
              <Select
                value={formValues.battingStyle}
                onValueChange={(value) => handleSelectChange("battingStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-Handed">Right-Handed</SelectItem>
                  <SelectItem value="Left-Handed">Left-Handed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bowlingStyle">Bowling Style</Label>
              <Select
                value={formValues.bowlingStyle}
                onValueChange={(value) => handleSelectChange("bowlingStyle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Right-Arm Fast">Right-Arm Fast</SelectItem>
                  <SelectItem value="Right-Arm Medium">Right-Arm Medium</SelectItem>
                  <SelectItem value="Right-Arm Off-Spin">Right-Arm Off-Spin</SelectItem>
                  <SelectItem value="Left-Arm Fast">Left-Arm Fast</SelectItem>
                  <SelectItem value="Left-Arm Medium">Left-Arm Medium</SelectItem>
                  <SelectItem value="Left-Arm Orthodox">Left-Arm Orthodox</SelectItem>
                  <SelectItem value="Leg-Spinner">Leg-Spinner</SelectItem>
                  <SelectItem value="Chinaman">Chinaman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                value={formValues.basePrice}
                onChange={handleInputChange}
                required
                min="500000"
                step="100000"
              />
              <p className="text-xs text-muted-foreground">
                Minimum ₹5 Lakhs
              </p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              Player Statistics
              <Badge variant="outline" className="ml-2">Optional</Badge>
            </h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matches">Matches</Label>
                <Input
                  id="matches"
                  name="matches"
                  type="number"
                  value={formValues.matches}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="runs">Runs</Label>
                <Input
                  id="runs"
                  name="runs"
                  type="number"
                  value={formValues.runs}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="average">Average</Label>
                <Input
                  id="average"
                  name="average"
                  type="number"
                  value={formValues.average}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strikeRate">Strike Rate</Label>
                <Input
                  id="strikeRate"
                  name="strikeRate"
                  type="number"
                  value={formValues.strikeRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wickets">Wickets</Label>
                <Input
                  id="wickets"
                  name="wickets"
                  type="number"
                  value={formValues.wickets}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="economy">Economy</Label>
                <Input
                  id="economy"
                  name="economy"
                  type="number"
                  value={formValues.economy}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cricket-blue hover:bg-cricket-blue/90">
              {player ? 'Update Player' : 'Add Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
