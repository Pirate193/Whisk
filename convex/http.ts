import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/clerk-weehook",
    method:"POST",
    handler: httpAction(async(ctx,request)=>{
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhookSecret){
            console.error("CLERK_WEBHOOK_SECRET is not set");
            return new Response("Webhook secret not configured", {status:500});
        }

      const svix_id = request.headers.get("svix-id");
      const svix_signature = request.headers.get("svix-signature");
     const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt :any;

    try {
        evt = wh.verify(body,{
            "svix-id": svix_id,
             "svix-timestamp": svix_timestamp,
           "svix-signature": svix_signature,
        })as any;
    } catch (err) {
    console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if(eventType === "user.created"){
        const data = evt.data;

  const email_address = data.email_addresses?.[0]?.email_address || "";
    // Use Clerk's id as userId
    const userId = data.id;
    // Use username if available, else fallback to email prefix
    const username = data.username || email_address.split("@")[0];
    // Use Clerk's image_url
    const avatarUrl = data.image_url || data.profile_image_url || undefined;

     
  const createdAt = data.created_at ? new Date(data.created_at).getTime() : Date.now();
  const updatedAt = data.updated_at ? new Date(data.updated_at).getTime() : Date.now();
    const user = {
        userId,
        email: email_address,
        username,
        avatarUrl,
        dietaryPreferences: [],
        allergies: [],
        dislikes: [],
        dailyTargets: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: undefined,
            sugar: undefined
        },
        cuisinePreferences: [],
        cookingSkillLevel: "beginner" as const,
        subscriptionTier: "free" as const,
        totalRecipesSaved: 0,
        totalMealsLogged: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString(),
        createdAt,
        updatedAt
    };

    console.log("Creating user with data:", user);
    try{
         await ctx.runMutation(internal.users.createUser,{user})
    }catch(error){
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
    }

}
   console.log("Unhandled event type:", eventType);
     return new Response("Webhook processed successfully", { status: 200 });

    })
})

export default http;

