import { createTool } from "@convex-dev/agent";
import { z } from "zod/v4";
import { api } from "./_generated/api";


export const searchRecipe = createTool({
  description: 'Search for recipes in the database. Returns a list of recipes with their IDs, titles, and details. Use this when users ask for recipe recommendations or want to find specific dishes.',
  args: z.object({ 
    query: z.string().describe("The search query for recipes (e.g., 'chicken breast', 'vegan pasta', 'high protein')") 
  }),
  handler: async (ctx, args) => {
    const recipes: any = await ctx.runAction(api.recipe.searching, { query: args.query });
    
    // Return formatted results with recipe IDs
    if (Array.isArray(recipes)) {
      return recipes.map((recipe: any) => ({
        id: recipe._id,
        title: recipe.title,
        description: recipe.description,
        calories: recipe.nutrition?.calories,
        protein: recipe.nutrition?.protein,
        difficulty: recipe.difficulty,
        totalTime: recipe.totalTime,
      }));
    }
    
    return [{
      id: recipes._id,
      title: recipes.title,
      description: recipes.description,
      calories: recipes.nutrition?.calories,
      protein: recipes.nutrition?.protein,
      difficulty: recipes.difficulty,
      totalTime: recipes.totalTime,
    }];
  }
});

export const modifyRecipe = createTool({
  description: 'Modify an existing recipe by adjusting ingredients, servings, or dietary restrictions. Use this when users want to customize a recipe.',
  args: z.object({
    recipeId: z.string().describe("The ID of the recipe to modify"),
    modifications: z.string().describe("Description of what changes to make (e.g., 'make it vegetarian', 'double the recipe', 'reduce calories')")
  }),
  handler: async (ctx, args) => {
    // TODO: Implement recipe modification logic
    return { 
      success: true, 
      message: `Recipe modifications noted: ${args.modifications}. This feature is coming soon!` 
    };
  }
});

export const generateMealPlan = createTool({
  description: 'Generate a meal plan for a user based on their preferences and goals.',
  args: z.object({
    userId: z.string().describe("The user's ID"),
    name: z.string().describe("A descriptive name for the meal plan (e.g., 'Muscle Gain Week 1', 'Keto October')"),
    description: z.optional(z.string()).describe("Brief description of the meal plan's purpose"),
    startDate: z.string().describe("Start date in YYYY-MM-DD format"),
    endDate: z.string().describe("End date in YYYY-MM-DD format"),
    meals: z.array(z.object({
      date: z.string().describe("Date for this meal in YYYY-MM-DD format"),
      mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).describe("Type of meal"),
      recipeId: z.string().describe("The recipe ID from searchRecipe results"),
      servings: z.number().describe("Number of servings"),
      notes: z.optional(z.string()).describe("Any special notes about this meal")
    })).describe("Array of meals for the plan")
  }),
  handler: async (ctx, args) => {
    // Calculate totals
    const totalRecipes = args.meals.length;
    const totalCalories = 0; // Will be calculated by the backend
    
    const mealPlanId: any = await ctx.runMutation(api.mealplan.createMealPlan, {
      userId: args.userId,
      name: args.name,
      description: args.description || '',
      startDate: args.startDate,
      endDate: args.endDate,
      meals: args.meals.map(meal => ({
        ...meal,
        recipeId: meal.recipeId as any, // Cast to Id<"recipes">
      })),
      totalCalories,
      totalRecipes,
      generatedBy: 'ai' as const,
      isActive: true,
      completedMeals: 0,
      updatedAt: Date.now(),
    });
    
    return { 
      success: true, 
      mealPlanId,
      message: `Created meal plan "${args.name}" with ${totalRecipes} meals from ${args.startDate} to ${args.endDate}`
    };
  }
});



