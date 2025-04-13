
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "@/context/AppContext";
import { Team } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Form schema
const teamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").max(5, "Abbreviation must be at most 5 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  captainName: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  budget: z.number().min(1, "Budget must be at least ₹1"),
});

type TeamFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team;
};

export default function TeamForm({ open, onOpenChange, team }: TeamFormProps) {
  const { dispatch } = useAppContext();
  const isEditMode = !!team;
  
  // Default form values
  const defaultValues = {
    name: team?.name || "",
    abbreviation: team?.abbreviation || "",
    ownerName: team?.ownerName || "",
    captainName: team?.captainName || "",
    primaryColor: team?.primaryColor || "#004BA0",
    secondaryColor: team?.secondaryColor || "#D1AB3E",
    budget: team?.budget ? team.budget / 10000000 : 90, // Convert to crores for display
  };
  
  const form = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues,
  });
  
  const onSubmit = (data: z.infer<typeof teamSchema>) => {
    // Convert budget from crores to actual value
    const budgetInRupees = data.budget * 10000000;
    
    if (isEditMode && team) {
      // Update existing team
      const updatedTeam: Team = {
        ...team,
        name: data.name,
        abbreviation: data.abbreviation,
        ownerName: data.ownerName,
        captainName: data.captainName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        budget: budgetInRupees,
        remainingBudget: team.remainingBudget + (budgetInRupees - team.budget),
      };
      
      dispatch({ type: 'UPDATE_TEAM', payload: updatedTeam });
    } else {
      // Create new team
      const newTeam: Team = {
        id: uuidv4(),
        name: data.name,
        abbreviation: data.abbreviation,
        ownerName: data.ownerName,
        captainName: data.captainName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        players: [],
        budget: budgetInRupees,
        remainingBudget: budgetInRupees,
      };
      
      dispatch({ type: 'ADD_TEAM', payload: newTeam });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Team" : "Add New Team"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai Indians" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="abbreviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abbreviation</FormLabel>
                    <FormControl>
                      <Input placeholder="MI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (Crores)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="90" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Akash Ambani" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="captainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Captain Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Rohit Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded-full border" 
                          style={{ backgroundColor: field.value }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={field.value} onChange={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="secondaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded-full border" 
                          style={{ backgroundColor: field.value }}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <HexColorPicker color={field.value} onChange={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" className="bg-cricket-blue hover:bg-cricket-blue/90">
                {isEditMode ? "Update Team" : "Add Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
