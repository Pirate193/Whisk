import { v } from "convex/values";
import { mutation, query } from "./_generated/server";




export const logMealFromPlan = mutation({
    args:{
      userId:v.string(),
      recipeId:v.id('recipes'),
      date:v.string(),
      mealType:v.union(
        v.literal('breakfast'),
        v.literal('lunch'),
        v.literal('dinner'),
        v.literal('snack')
      ),
      servings:v.number(),
    },
    handler:async (ctx ,args)=>{
        const recipe = await ctx.db.get(args.recipeId);
        if(!recipe){
            throw new Error('Recipe not found');
        }
        const nutrition = {
            calories:recipe.nutrition.calories * args.servings,
            protein:recipe.nutrition.protein * args.servings,
            carbs:recipe.nutrition.carbs * args.servings,
            fat:recipe.nutrition.fat * args.servings,
        }
        const logId = await ctx.db.insert('mealLogs',{
            userId:args.userId,
            recipeId:args.recipeId,
            date:args.date,
            mealType:args.mealType,
            servings:args.servings,
            nutrition,
        })
        return logId
    }
})

export const getMealLogs = query({
  args:{userId:v.string()},
  handler:async ( ctx ,args)=>{
    const logs = await ctx.db.query('mealLogs').withIndex('by_userId',(q)=>q.eq('userId',args.userId)).collect();

    return logs
  }
})

export const getMealLogsByDate = query({
    args:{
        userId:v.string(),
        date:v.string(),
    },
    handler:async (ctx ,args)=>{
        const logs = await ctx.db.query('mealLogs')
          .withIndex('by_userId_date',(q)=>
        q.eq('userId',args.userId).eq('date',args.date))
          .collect();

        const logswithRecipes = await Promise.all(
            logs.map(async (log) => {
                const recipe = await ctx.db.get(log.recipeId);
                return {
                    ...log,
                    recipe: recipe?{
                        _id:recipe._id,
                        title:recipe.title,
                        imageUrl:recipe.imageUrl,
                        totalTime:recipe.totalTime
                    }:null
                }
            })
        )

        const grouped = {
            breakfast:logswithRecipes.filter(l=>l.mealType ==='breakfast'),
            lunch:logswithRecipes.filter(l=>l.mealType ==='lunch'),
            dinner:logswithRecipes.filter(l=>l.mealType ==='dinner'),
            snack:logswithRecipes.filter(l=>l.mealType ==='snack'),
        }

        return grouped
    }
})

export const getDailyNutritionSummary = query({
    args:{
        userId:v.string(),
        date:v.string(),
    },
    handler:async(ctx ,args)=>{

        const logs = await ctx.db.query('mealLogs')
           .withIndex('by_userId_date',(q)=>
        q.eq('userId',args.userId).eq('date',args.date))
           .collect();

        const summary = logs.reduce((acc, log) => {
      return {
        calories: acc.calories + log.nutrition.calories,
        protein: acc.protein + log.nutrition.protein,
        carbs: acc.carbs + log.nutrition.carbs,
        fat: acc.fat + log.nutrition.fat,
        mealCount: acc.mealCount + 1,
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      mealCount: 0,
    });

    return summary;
    }
})

export const getDailyNutritionGoal = query({
    args:{
        userId:v.string(),
        date:v.string(),
    },
    handler:async(ctx ,args)=>{

        const activePlans = await ctx.db.query('mealPlans')
          .withIndex('by_userId_isActive',(q)=>
        q.eq('userId',args.userId).eq('isActive',true))
          .filter((q)=>
        q.and(
            q.lte(q.field('startDate'),args.date),
            q.gte(q.field('endDate'),args.date)
        ))
          .collect();

        let totalGoal = {
            calories:0,
            protein:0,
            carbs:0,
            fat:0,
        }

        for(const plan of activePlans){
            const mealsForDate = plan.meals.filter(m=>m.date ===args.date);

            for(const meal of mealsForDate){
                const recipe = await ctx.db.get(meal.recipeId);
                if(recipe){
                    totalGoal.calories+=recipe.nutrition.calories * meal.servings;
                    totalGoal.protein+=recipe.nutrition.protein * meal.servings;
                    totalGoal.carbs+=recipe.nutrition.carbs * meal.servings;
                    totalGoal.fat+=recipe.nutrition.fat * meal.servings;
                }
            }
        }

        return totalGoal
    }
})

export const updateMeallog = mutation({
    args:{
    logId: v.id("mealLogs"),
    servings: v.optional(v.number()),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
    photoUrl: v.optional(v.id("_storage")),
    },
    handler:async (ctx ,args)=>{
          const { logId, ...updates } = args;
    
    // If servings changed, recalculate nutrition
    if (updates.servings !== undefined) {
      const log = await ctx.db.get(logId);
      if (log) {
        const recipe = await ctx.db.get(log.recipeId);
        if (recipe) {
          const nutrition = {
            calories: recipe.nutrition.calories * updates.servings,
            protein: recipe.nutrition.protein * updates.servings,
            carbs: recipe.nutrition.carbs * updates.servings,
            fat: recipe.nutrition.fat * updates.servings,
          };
          await ctx.db.patch(logId, { ...updates, nutrition });
          return logId;
        }
      }
    }

    await ctx.db.patch(logId, updates);
    return logId;
    }
})

export const deleteMealLog = mutation({
  args: { logId: v.id("mealLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.logId);
    return { success: true };
  },
});

// Get weekly/monthly statistics
export const getNutritionStats = query({
  args: { 
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("mealLogs")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();

    // Group by date
    const dailyStats = new Map();
    
    logs.forEach(log => {
      const existing = dailyStats.get(log.date) || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        mealCount: 0,
      };
      
      dailyStats.set(log.date, {
        calories: existing.calories + log.nutrition.calories,
        protein: existing.protein + log.nutrition.protein,
        carbs: existing.carbs + log.nutrition.carbs,
        fat: existing.fat + log.nutrition.fat,
        mealCount: existing.mealCount + 1,
      });
    });

    return Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }));
  },
});

// Get meal logs for date range
export const getMealLogsByDateRange = query({
  args: { 
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const allLogs = await ctx.db
      .query("mealLogs")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();

    return allLogs;
  },
});
