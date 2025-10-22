import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";
import { transformRecipe } from "./backfill";



export const getRecipes = query({
    args:{
      limit:v.optional(v.number()),
    },
    returns:v.array(v.any()),
    handler:async(ctx,args)=>{
      const limit = args.limit ?? 50;
      const recipes =   await ctx.db.query('recipes').order('desc').take(limit);

      return recipes;
    }
})


export const getRecipe = query({
  args:{
    recipeId:v.id('recipes')
  },
  handler:async(ctx,args)=>{
    const recipe = await ctx.db.get(args.recipeId);
    return recipe;
  }
})

export const searchRecipe = query({
  args:{
    query:v.string(),
  },
  handler:async(ctx,args)=>{
    const limit = 20
    const recipe = ctx.db.query('recipes').withSearchIndex('search_title',(q)=>q.search('title',args.query)).take(limit)
    return recipe;
  }
})

// convex/recipe.ts
export const searching = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    // First search database
    const dbSearch: any = await ctx.runQuery(api.recipe.searchRecipe, { query: args.query });

    if (dbSearch && dbSearch.length > 0) {
      return dbSearch; // Return multiple results
    }

    // If not found, fetch from Spoonacular
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${args.query}&number=5&addRecipeInformation=true&fillIngredients=true&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("No recipes found");
    }

    // Transform and save all results
    const savedRecipes = [];
    for (const recipe of data.results) {
      const transformedRecipe = transformRecipe(recipe);
      const recipeId:any = await ctx.runMutation(internal.recipe.createRecipe, { 
        recipe: transformedRecipe 
      });
      
      savedRecipes.push({
        _id: recipeId,
        ...transformedRecipe
      });
    }

    return savedRecipes;
  }
});

export const createRecipe = internalMutation({
    args:{
        recipe:v.object({
            
      externalId: v.optional(v.string()),
      title: v.string(),
      description: v.optional(v.string()),
      imageUrl: v.string(),
      servings: v.number(),
      prepTime: v.number(),
      cookTime: v.number(),
      totalTime: v.number(),
      difficulty: v.union(v.literal('easy'), v.literal('medium'), v.literal('hard')),
      ingredients: v.array(v.object({
        name: v.string(),
        amount: v.number(),
        unit: v.string(),
        notes: v.optional(v.string())
      })),
      instruction: v.array(v.object({
        stepNumber: v.number(),
        instruction: v.string(),
        duration: v.optional(v.number()),
        imageUrl: v.optional(v.string())
      })),
      nutrition: v.object({
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fat: v.number(),
        fiber: v.optional(v.number()),
        sugar: v.optional(v.number()),
        sodium: v.optional(v.number()),
        cholesterol: v.optional(v.number())
      }),
      mealType: v.array(v.string()),
      cuisineType: v.optional(v.string()),
      dishType: v.array(v.string()),
      dietaryTags: v.array(v.string()),
      source: v.union(v.literal('api'), v.literal('ai'), v.literal('user'), v.literal('community')),
      sourceUrl: v.optional(v.string()),
      sourceName: v.optional(v.string()),
      viewCounts: v.number(),
      favoriteCount: v.number(),
      cookCount: v.number(),
      averageRating: v.optional(v.number()),
      videoUrl: v.optional(v.string()),
      videoThumbnailUrl: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number()
        })
    },
    handler:async(ctx,args)=>{
        const recipeId = await ctx.db.insert('recipes',args.recipe);
        return recipeId;
    }
})

export const getRecipeByExternalId = query({
  args:{externalId:v.string()},
  handler: async (ctx, args) => {
     return await ctx.db
      .query("recipes")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
  }
})

