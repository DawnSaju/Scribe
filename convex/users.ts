import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const updateXP = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId !== null) {
      const safeAmount = Math.max(0, Math.min(args.amount, 100));
      const user = await ctx.db.get(userId);
      if (user) {
        const currentXP = user.XP || 0;
        return await ctx.db.patch(userId, { XP: currentXP + safeAmount });
      }
    }
  },
});

export const updateUserMetadata = mutation({
  args: { 
    install_progress: v.optional(v.number()),
    has_completed_tour: v.optional(v.boolean()),
    extensionId: v.optional(v.string()),
    name: v.optional(v.string()),
    isConnected: v.optional(v.boolean()),
    has_onboarded: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId !== null) {
      return await ctx.db.patch(userId, args);
    }
  },
});

export const updateStreak = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (!user) return;
    
    const today = new Date();
    const prevSignin = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;
    let newStreak = user.streakCount || 0;
    let update = false;

    if (!prevSignin) {
      newStreak = 1;
      update = true;
    } else {
      const days = Math.floor((today.setHours(0,0,0,0) - prevSignin.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
      if (days === 1) {
        newStreak += 1;
        update = true;
      } else if (days > 1) {
        newStreak = 1;
        update = true;
      }
    }

    if (update) {
      await ctx.db.patch(userId, {
        last_sign_in_at: new Date().toISOString(),
        streakCount: newStreak
      });
    }
  }
});

export const searchUsers = query({
  args: { userinput: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    
    if (!args.userinput) return [];

    const nameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.userinput))
      .take(10);
      
    const emailResults = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) => q.search("email", args.userinput))
      .take(10);
      
    const combined = [...nameResults, ...emailResults];
    
    // Deduplicate and filter out current user
    const uniqueUsers = new Map();
    for (const u of combined) {
      if (u._id !== userId) {
        uniqueUsers.set(u._id, u);
      }
    }
    
    const results = Array.from(uniqueUsers.values()).slice(0, 10);
    
    return results.map((u: any) => ({
      id: u._id,
      email: u.email,
      full_name: u.name,
      avatar_url: u.image
    }));
  }
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.id) {
      throw new Error("Unauthorized");
    }
    
    // In a real app we'd verify the user is allowed to delete this id.
    // Let's delete their learned words
    const words = await ctx.db.query("learned_words")
      .withIndex("by_user", q => q.eq("user_id", args.id))
      .collect();
    
    for (const word of words) {
      await ctx.db.delete(word._id);
    }
    
    // For now we don't delete the user themselves since Convex Auth manages the users table
    // But we clear their data
    return true;
  }
});
