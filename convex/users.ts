import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";


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
        avatarId:v.optional(v.id('_storage')),

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


export const getUser = query({
    args:{userId:v.string()},
    handler: async (ctx,args)=>{
        const user =await ctx.db.query('userProfiles').withIndex('by_userId',(q)=>q.eq('userId',args.userId)).first();
        const imageurl = await ctx.storage.getUrl(user?.avatarId!);
        return {...user,imageurl};
    }
})

export const updateProfile = mutation({
    args:{
        userId:v.string(),

        username: v.optional(v.string()),
        avatarId:v.optional(v.id('_storage')),

        //dietary info
        dietaryPreferences: v.optional(v.array(v.string())),
        allergies: v.optional(v.array(v.string())),
        dislikes: v.optional(v.array(v.string())),
        medications: v.optional(v.array(v.object({
            name:v.string(),
            interactions:v.array(v.string())
        }))),
        healthGoals:v.optional(v.object({
            goal:v.union(
                v.literal("lose_weight"),
                v.literal('gain_muscle'),
                v.literal('maintain'),
                v.literal('eat_healthy')
            ),
            activityLevel:v.union(
                v.literal('sedentary'),
                v.literal('light'),
                v.literal('moderate'),
                v.literal('active')
            ),
            targetWeight:v.optional(v.number()),
            currentWeight:v.optional(v.number()),
            gender:v.optional(v.union(v.literal('male'),v.literal('female'))),
            age:v.optional(v.number())
        })),
        //nutrition Targets
        dailyTargets:v.optional(v.object({
            calories:v.number(),
            protein:v.number(),
            carbs:v.number(),
            fat:v.number(),
            fiber:v.optional(v.number()),
            sugar:v.optional(v.number()),
        })),
        cuisinePreferences:v.optional(v.array(v.string())),
        cookingSkillLevel:v.optional(v.union(
            v.literal('beginner'),
            v.literal('intermediate'),
            v.literal('expert')
        )),
    },
    handler: async (ctx ,args)=>{
        const user = await ctx.db.query('userProfiles').withIndex('by_userId',(q)=>q.eq('userId',args.userId)).first();
        if(!user) return;
        
        const updated = await ctx.db.patch(user._id,{
            username:args.username,
            avatarId:args.avatarId,
            dietaryPreferences:args.dietaryPreferences,
            allergies:args.allergies,
            dislikes:args.dislikes,
            medications:args.medications,
            healthGoals:args.healthGoals,
            dailyTargets:args.dailyTargets,
            cuisinePreferences:args.cuisinePreferences,
            cookingSkillLevel:args.cookingSkillLevel
        })

        return updated

    }
})