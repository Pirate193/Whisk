import { v } from "convex/values";
import { query } from "./_generated/server";


export const getRecipeByMealType = query({
   args: {
    mealType: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    
    // Get all recipes and filter in memory
    // This is necessary because Convex doesn't support array contains in filters directly
    const allRecipes = await ctx.db
      .query('recipes')
      .order('desc')
      .take(limit * 2); // Fetch more to compensate for filtering

    // Filter recipes where mealType array includes the requested meal type
    const filteredRecipes = allRecipes.filter(recipe => 
      recipe.mealType.includes(args.mealType)
    ).slice(0, limit);

    return filteredRecipes;
  }
})