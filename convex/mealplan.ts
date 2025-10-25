import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// convex/mealPlans.ts
export const createMealPlan = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    meals: v.array(v.object({
      date: v.string(),
      mealType: v.union(
        v.literal('breakfast'),
        v.literal('lunch'),
        v.literal('dinner'),
        v.literal('snack')
      ),
      recipeId: v.id('recipes'),
      servings: v.number(),
      notes: v.optional(v.string())
    })),
    totalCalories: v.number(),
    totalRecipes: v.number(),
    generatedBy: v.union(
      v.literal('user'),
      v.literal('ai')
    ),
    isActive: v.boolean(),
    completedMeals: v.number(),
    updatedAt: v.number()
  },
  handler: async (ctx, args) => {
    const mealPlanId = await ctx.db.insert('mealPlans', {
      userId: args.userId,
      name: args.name,
      description: args.description,
      startDate: args.startDate,
      endDate: args.endDate,
      meals: args.meals,
      totalCalories: args.totalCalories,
      totalRecipes: args.totalRecipes,
      generatedBy: args.generatedBy,
      isActive: args.isActive,
      completedMeals: args.completedMeals,
      updatedAt: args.updatedAt,
    });
    
    return mealPlanId;
  }
});

export const logMeal = mutation({
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

        nutrition:v.object({
            calories:v.number(),
            protein:v.number(),
            carbs:v.number(),
            fat:v.number(),
        }),
        //notes
        notes:v.optional(v.string()),
        rating:v.optional(v.number()),

        photoUrl:v.optional(v.id('_storage')),
        
    },
    handler: async(ctx ,args)=>{
     const meallog = await ctx.db.insert('mealLogs',args)
     return meallog;
    }
})

export const getMealplan = query({
    args:{userId:v.string()},
    handler: async(ctx ,args)=>{
        const mealplan = await ctx.db.query('mealPlans').withIndex('by_userId',q=>q.eq('userId',args.userId)).order('desc').collect();
        return mealplan;
    }
});

export const deleteMealplan = mutation({
    args:{ id:v.id('mealPlans')},
    handler:async(ctx ,args)=>{
        await ctx.db.delete(args.id)
        return {success:true}
    }
})
export const updateMealplan = mutation({
    args:{
       mealPlanId:v.id('mealPlans'),
       name:v.optional(v.string()),
       description:v.optional(v.string()),
       startDate:v.optional(v.string()),
       endDate:v.optional(v.string()),
       isActive:v.optional(v.boolean())
    },
    handler:async(ctx ,args)=>{
         const {mealPlanId,...updates}= args;

         await ctx.db.patch(mealPlanId,{
            ...updates,
            updatedAt:Date.now()
         })
         return mealPlanId
    }
})

export const getActiveMealPlans = query({
    args:{userId:v.string()},
    handler: async(ctx ,args)=>{
        const mealPlans = await ctx.db.query('mealPlans')
        .withIndex('by_userId_isActive',(q)=>
        q.eq('userId',args.userId).eq('isActive',true))
        .order('desc').collect();
        return mealPlans;
    }
});

export const getMealplanById = query({
    args:{mealPlanId:v.id('mealPlans')},
    handler: async(ctx ,args)=>{
        const mealplan = await ctx.db.get(args.mealPlanId)
        if(!mealplan){
            return null;
        }
        const mealswithRecipes = await Promise.all(
            mealplan.meals.map(async(meal)=>{
                const recipe = await ctx.db.get(meal.recipeId);
                return {
                    ...meal,
                    recipe:recipe ?{
                        _id:recipe._id,
                        title:recipe.title,
                        imageUrl:recipe.imageUrl,
                        totalTime:recipe.totalTime,
                        difficulty:recipe.difficulty
                    }:null
                }
            })
        );
        return {
            ...mealplan,
            mealswithRecipes
        }
    }
   
})

//get mealplan by date
export const getMealplanByDate = query({
    args:{
        userId:v.string(),
        date:v.string()
    },
    handler:async( ctx ,args)=>{
        const activePlans = await ctx.db.query('mealPlans')
           .withIndex('by_userId_isActive',(q)=>
           q.eq('userId',args.userId).eq('isActive',true))
           .collect();

        const mealsForDate =[]
        for(const plan of activePlans){
            const meals = plan.meals.filter((meal)=>meal.date === args.date);

            for(const meal of meals){
                const recipe = await ctx.db.get(meal.recipeId);
                mealsForDate.push({
                    ...meal,
                    mealPlanId:plan._id,
                    mealPlanName:plan.name,
                    recipe:recipe?{
                        _id:recipe._id,
                        title:recipe.title,
                        imageUrl:recipe.imageUrl,
                        totalTime:recipe.totalTime,
                        difficulty:recipe.difficulty
                    }:null,
                })
            }
        }
        return mealsForDate;
    }
})

export const getMealPlanStats = query({
    args:{userId:v.string()},
    handler: async(ctx ,args)=>{
        const allPlans = await ctx.db.query('mealPlans')
          .withIndex('by_userId',(q)=>q.eq('userId',args.userId))
          .collect();

        const activePlans = allPlans.filter((p)=>p.isActive);
        const totalMeals = allPlans.reduce((sum,p)=>sum +p.totalRecipes,0);
        const completedMeals = allPlans.reduce((sum,p)=>sum+p.completedMeals,0);

        return{
            totalPlans:allPlans.length,
            activePlans:activePlans.length,
            totalMeals,
            completedMeals,
            completionRate:totalMeals >0 ?(completedMeals/totalMeals)*100:0
        }
    }
})

export const addMealToPlan = mutation({
    args:{
        mealPlanId:v.id('mealPlans'),
        meal:v.object({
            date:v.string(),
            mealType:v.union(
                v.literal('breakfast'),
                v.literal('lunch'),
                v.literal('dinner'),
                v.literal('snack')
            ),
            recipeId:v.id('recipes'),
            servings:v.number(),
            notes:v.optional(v.string())
        })
    },
    handler: async(ctx ,args)=>{
        const mealPlan = await ctx.db.get(args.mealPlanId);
        if(!mealPlan){
            throw new Error('meal plan not found');
        }
        const updatedMeals = [...mealPlan.meals,args.meal];

        await ctx.db.patch(args.mealPlanId,{
            meals:updatedMeals,
            totalRecipes:updatedMeals.length,
            updatedAt:Date.now(),
        });
        return args.mealPlanId
    }
})

export const removeMealFromPlan = mutation({
    args:{
        mealPlanId:v.id('mealPlans'),
        mealIndex:v.number()
    },
    handler:async(ctx ,args)=>{
        const mealPlan = await ctx.db.get(args.mealPlanId);
        if(!mealPlan){
            throw new Error('meal plan not found')
        }

        const updatedMeals = mealPlan.meals.filter((_,index)=>index !== args.mealIndex)

        await ctx.db.patch(args.mealPlanId,{
            meals:updatedMeals,
            totalRecipes:updatedMeals.length,
            updatedAt:Date.now(),
        })

        return args.mealPlanId
    }
})

export const markMealCompleted = mutation ({
    args:{
        mealPlanId:v.id('mealPlans'),
        
    },
    handler:async(ctx ,args)=>{
        const mealPlan = await ctx.db.get(args.mealPlanId);
        if(!mealPlan){
            throw new Error('meal plan not found')
        }

        await ctx.db.patch(args.mealPlanId,{
            completedMeals:mealPlan.completedMeals+1,
            updatedAt:Date.now(),
        });
        return args.mealPlanId
    }
})

export const toggleMealPlanActive = mutation({
    args:{
        mealPlanId:v.id('mealPlans')
    },
    handler: async(ctx ,args)=>{
        const mealPlan = await ctx.db.get(args.mealPlanId);
        if(!mealPlan){
            throw new Error('meal plan not found')
        }
        await ctx.db.patch(args.mealPlanId,{
            isActive:!mealPlan.isActive,
            updatedAt:Date.now(),
        });
        return args.mealPlanId
    }
})