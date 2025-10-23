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


export const filterRecipes = query({
  args: {
    mealTypes: v.optional(v.array(v.string())),
    maxCookTime: v.optional(v.number()),
    diets: v.optional(v.array(v.string())),
    includeIngredients: v.optional(v.array(v.string())),
    excludeIngredients: v.optional(v.array(v.string())),
    cuisines: v.optional(v.array(v.string())),
    difficulties: v.optional(v.array(v.string())),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    // Fetch more recipes to filter from
    const allRecipes = await ctx.db
      .query('recipes')
      .order('desc')
      .take(800); 

    // Apply filters
    let filteredRecipes = allRecipes;

    // Filter by meal types (recipe.mealType is an array)
    if (args.mealTypes && args.mealTypes.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        args.mealTypes!.some(type => recipe.mealType.includes(type))
      );
    }

    // Filter by max cook time
    if (args.maxCookTime !== undefined) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.totalTime <= args.maxCookTime!
      );
    }

    // Filter by dietary tags (recipe.dietaryTags is an array)
    if (args.diets && args.diets.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        args.diets!.some(diet => 
          recipe.dietaryTags.some(tag => 
            tag.toLowerCase().includes(diet.toLowerCase())
          )
        )
      );
    }

    // Filter by cuisine
    if (args.cuisines && args.cuisines.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        args.cuisines!.some(cuisine =>
          recipe.cuisineType?.toLowerCase().includes(cuisine.toLowerCase())
        )
      );
    }

    // Filter by difficulty
    if (args.difficulties && args.difficulties.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        args.difficulties!.includes(recipe.difficulty)
      );
    }

    // Filter by included ingredients
    if (args.includeIngredients && args.includeIngredients.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        args.includeIngredients!.every(ingredient =>
          recipe.ingredients.some(recipeIngredient =>
            recipeIngredient.name.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      );
    }

    // Filter by excluded ingredients
    if (args.excludeIngredients && args.excludeIngredients.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        !args.excludeIngredients!.some(ingredient =>
          recipe.ingredients.some(recipeIngredient =>
            recipeIngredient.name.toLowerCase().includes(ingredient.toLowerCase())
          )
        )
      );
    }

    return filteredRecipes;
  }
});