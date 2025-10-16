import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
    userProfiles:defineTable({
        userId:v.string(),
        email: v.string(),
        username: v.string(),
        avatarUrl:v.optional(v.string()),

        //dietary info
        dietaryPreferences: v.array(v.string()),
        allergies: v.array(v.string()),
        dislikes: v.array(v.string()),
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
            gender:v.optional(v.union(v.literal('male'),v.literal('famale'))),
            age:v.optional(v.number())
        })),
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
        subscriptionExpiresAt:v.optional(v.number()),
         totalRecipesSaved: v.number(),
        totalMealsLogged: v.number(),
        currentStreak: v.number(),
        longestStreak: v.number(),
       lastActiveDate: v.string(), 
    
        createdAt: v.number(),
        updatedAt: v.number()

    })
     .index('by_userId',['userId'])
     .index('by_email',['email']),

     //recipies 
     recipes:defineTable({

        externalId:v.optional(v.string()),
        title:v.string(),
        description:v.optional(v.string()),
        imageUrl:v.string(),

        //recipes details
        servings:v.number(),
        prepTime:v.number(),
        cookTime:v.number(),
        totalTime:v.number(),
        difficulty:v.union(
            v.literal('easy'),
            v.literal('medium'),
            v.literal('hard')
        ),

        ingredients:v.array(v.object({
            name:v.string(),
            amount:v.number(),
            unit:v.string(),
            notes:v.optional(v.string())
        })),

        //instruction
        instruction:v.array(v.object({
            stepNumber:v.number(),
            instruction:v.string(),
            duration:v.optional(v.number()),
            imageUrl:v.optional(v.string())
        })),

        //nutrition 
        nutrition:v.object({
            calories:v.number(),
            protein:v.number(),
            carbs:v.number(),
            fat:v.number(),
            fiber:v.optional(v.number()),
            sugar:v.optional(v.number()),
            sodium:v.optional(v.number()),
            cholesterol:v.optional(v.number())
        }),

        mealType:v.array(v.string()),
        cuisineType:v.optional(v.string()),
        dishType:v.array(v.string()),
        dietaryTags:v.array(v.string()),

        source:v.union(
            v.literal('api'),
            v.literal('ai'),
            v.literal('user'),
            v.literal('community')
        ),
        sourceUrl:v.optional(v.string()),
        sourceName:v.optional(v.string()),
        createdBy:v.optional(v.string()),
         
        //engagement metrics
        viewCounts:v.number(),
        favoriteCount:v.number(),
        cookCount:v.number(),
        averageRating:v.optional(v.number()),

        //video
        videoUrl:v.optional(v.string()),
        videoThumbnailUrl:v.optional(v.string()),

        createdAt:v.number(),
        updatedAt:v.number()
     })
    .searchIndex('search_title',{
        searchField:'title',
        filterFields:['dietaryTags','cuisineType','mealType','source','difficulty']
    })
    .index('by_source',['source'])
    .index('by_externalId',['externalId'])
    .index('by_createdBy',['createdBy'])
    .index('by_dificulty',['difficulty'])
    .index('by_mealType',['mealType']),
    
    favourites:defineTable({
        userId:v.string(),
        recipeId:v.id('recipes'),
        addedAt:v.number()
    })
    .index('by_userId',['userId'])
    .index('by_recipeId',['recipeId'])
    .index('by_userId_recipeId',['userId','recipeId']),

    collections:defineTable({
        userId:v.string(),
        name:v.string(),
        description:v.optional(v.string()),
        emoji:v.optional(v.string()),
        recipeIds:v.array(v.id('recipes')),
        isDefault:v.boolean(),
        createdAt:v.number(),
        updatedAt:v.number()
    })
      .index('by_userId',['userId']),

    mealLogs:defineTable({
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
        photoUrl:v.optional(v.string()),
        
    })
    .index('by_userId_date',['userId','date'])
    .index('by_userId',['userId'])
    .index('by_recipeId',['recipeId']),

    //meal plans
    mealPlans:defineTable({
        userId:v.string(),
        name:v.string(),
        description:v.optional(v.string()),
        startDate:v.string(),
        endDate:v.string(),

        meals:v.array(v.object({
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
        })),
        totalCalories:v.number(),
        totalRecipes:v.number(),

        generatedBy:v.union(
            v.literal('user'),
            v.literal('ai')
        ),
        isActive:v.boolean(),
        completedMeals:v.number(),
        updatedAt:v.number()
    })
     .index('by_userId',['userId'])
     .index('by_userId_isActive',['userId','isActive'])
     .index('by_startDate',['startDate']),

     //shoppong lists
    shoppingLists: defineTable({
    userId: v.string(),
    name: v.string(), // "Weekly Groceries"
    
    // Items
    items: v.array(v.object({
      ingredient: v.string(),
      amount: v.string(),
      unit: v.string(),
      category: v.optional(v.union(
        v.literal("produce"),
        v.literal("meat"),
        v.literal("dairy"),
        v.literal("pantry"),
        v.literal("frozen"),
        v.literal("other")
      )),
      isChecked: v.boolean(),
      recipeId: v.optional(v.id("recipes")), // Which recipe needs this
    })),
    
    // Generation
    generatedFrom: v.optional(v.object({
      type: v.union(
        v.literal("mealPlan"),
        v.literal("recipes")
      ),
      mealPlanId: v.optional(v.id("mealPlans")),
      recipeIds: v.optional(v.array(v.id("recipes")))
    })),
    
    // Stats
    totalItems: v.number(),
    checkedItems: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_userId", ["userId"]),




    //modified recipes by ai
  recipeModifications: defineTable({
    userId: v.string(),
    originalRecipeId: v.id("recipes"),
    
    // What changed
    modificationType: v.union(
      v.literal("ingredient_swap"),
      v.literal("portion_adjust"),
      v.literal("dietary_adapt"), // Make it vegan/gluten-free
      v.literal("time_reduce"),
      v.literal("equipment_substitute")
    ),
    
    userRequest: v.string(),
    // Changes Made
    ingredientsChanged: v.array(v.object({
      original: v.string(),
      replacement: v.string(),
      reason: v.optional(v.string())
    })),
    instructionsChanged: v.array(v.object({
      stepNumber: v.number(),
      originalInstruction: v.string(),
      modifiedInstruction: v.string()
    })),
    nutritionImpact: v.optional(v.object({
      caloriesDiff: v.number(), // +/- calories
      proteinDiff: v.number()
    })),
    
    // The modified recipe (stored as snapshot)
    modifiedRecipe: v.object({
      title: v.string(),
      ingredients: v.array(v.any()),
      instructions: v.array(v.any()),
      nutrition: v.any()
    }),
    
    // Save as new recipe?
    savedAsRecipe: v.optional(v.boolean()),
    savedRecipeId: v.optional(v.id("recipes")),
    
    createdAt: v.number()
  })
    .index("by_userId", ["userId"])
    .index("by_originalRecipeId", ["originalRecipeId"]),

    //recipe rating and reviews
  recipeReviews: defineTable({
    userId: v.string(),
    recipeId: v.id("recipes"),
    
    rating: v.number(), // 1-5
    review: v.optional(v.string()),
    
    // Cook Details
    didModify: v.boolean(),
    modifications: v.optional(v.string()), // "Used chicken instead of beef"
    
    // Photos
    photoUrls: v.optional(v.array(v.string())),
    
    // Engagement
    helpfulCount: v.number(), // Other users marked as helpful
  })
    .index("by_recipeId", ["recipeId"])
    .index("by_userId", ["userId"])
    .index("by_userId_recipeId", ["userId", "recipeId"]),

        //user insights and analytics
  userInsights: defineTable({
    userId: v.string(),
    date: v.string(), // "2025-01-15"
    
    // Daily Stats
    dailyStats: v.object({
      caloriesConsumed: v.number(),
      caloriesTarget: v.number(),
      proteinConsumed: v.number(),
      carbsConsumed: v.number(),
      fatConsumed: v.number(),
      mealsLogged: v.number(),
      waterIntake: v.optional(v.number()) // ml
    }),
    
    // Behavioral
    mostCookedMealType: v.optional(v.string()),
    averageMealPrepTime: v.optional(v.number()),
    
    // Achievements
    achievementsUnlocked: v.optional(v.array(v.string())),
    
    
  })
    .index("by_userId_date", ["userId", "date"])
    .index("by_userId", ["userId"]),


    //notifications
  notifications: defineTable({
    userId: v.string(),
    
    type: v.union(
      v.literal("meal_reminder"),
      v.literal("meal_plan_ready"),
      v.literal("streak_milestone"),
      v.literal("recipe_recommendation"),
      v.literal("shopping_list_ready")
    ),
    
    title: v.string(),
    body: v.string(),
    
    // Action
    actionType: v.optional(v.union(
      v.literal("open_recipe"),
      v.literal("open_meal_plan"),
      v.literal("open_shopping_list")
    )),
    actionId: v.optional(v.string()), // recipeId, mealPlanId, etc.
    
    // Status
    isRead: v.boolean(),
    isSent: v.boolean(),
    
    scheduledFor: v.optional(v.number()), // Future notifications
    sentAt: v.optional(v.number()),
   
  })
    .index("by_userId", ["userId"])
    .index("by_userId_isRead", ["userId", "isRead"])
    .index("by_scheduledFor", ["scheduledFor"]),

    //premium fetures usage

  featureUsage: defineTable({
    userId: v.string(),
    feature: v.union(
      v.literal("ai_generation"),
      v.literal("voice_cook_mode"),
      v.literal("meal_planning"),
      v.literal("photo_recognition"),
      v.literal("recipe_modification")
    ),
    
    usageCount: v.number(),
    lastUsedAt: v.number(),
    
    // For rate limiting free users
    dailyUsageCount: v.number(),
    dailyResetAt: v.number(),
   
    updatedAt: v.number()
  })
    .index("by_userId_feature", ["userId", "feature"])
    .index("by_userId", ["userId"])
})