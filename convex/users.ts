import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";


export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query('userProfiles')
      .filter((q) => q.eq(q.field('userId'), identity.email))
      .collect();
  },
});




export const createUser = internalMutation({
    args:{
        user:v.object({
        userId:v.string(),
        email: v.string(),
        username: v.string(),
        avatarUrl:v.optional(v.string()),

        //dietary info
        dietaryPreferences: v.array(v.string()),
        allergies: v.array(v.string()),
        dislikes: v.array(v.string()),
        
        //nutrition Targets
        dailyTargets:v.object({
            calories:v.number(),
            protein:v.number(),
            carbs:v.number(),
            fat:v.number(),
            fiber:v.optional(v.number()),
            sugar:v.optional(v.number()),
        }),
        cuisinePreferences:v.array(v.string()),
        cookingSkillLevel:v.union(
            v.literal('beginner'),
            v.literal('intermediate'),
            v.literal('expert')
        ),

        subscriptionTier:v.union(
            v.literal('free'),
            v.literal('premium'),
        ),
       
         totalRecipesSaved: v.number(),
        totalMealsLogged: v.number(),
        currentStreak: v.number(),
        longestStreak: v.number(),
       lastActiveDate: v.string(), 
    
        createdAt: v.number(),
        updatedAt: v.number()
        })
    },
    handler:async(ctx,args)=>{
     const existinguser = await ctx.db.query('userProfiles')
         .withIndex('by_userId',(q)=>q.eq('userId',args.user.userId))
         .first();

     if(existinguser) return;
     try {
     await ctx.db.insert('userProfiles',args.user);
     } catch (error) {
        console.log("Error inserting user:", error);
        throw error;
     }
    }
})

