import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getLearnedWords = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db
      .query("learned_words")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

export const getLearnedWordsCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    const words = await ctx.db
      .query("learned_words")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
    return words.length;
  },
});

export const getWordOfTheDay = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.userId) throw new Error("Unauthorized");
    return await ctx.db
      .query("word_of_the_day")
      .withIndex("by_date_id", (q) => q.eq("id", args.userId))
      .unique();
  },
});

export const addLearnedWord = mutation({
  args: {
    user_id: v.optional(v.string()),
    word: v.string(),
    part_of_speech: v.optional(v.string()),
    definition: v.optional(v.string()),
    example: v.optional(v.string()),
    show_name: v.optional(v.string()),
    platform: v.optional(v.string()),
    thumbnailimg: v.optional(v.string()),
    timeTracked: v.optional(v.string()),
    season: v.optional(v.string()),
    episode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("learned_words", { ...args, user_id: userId });
  },
});

export const updateWordOfTheDay = mutation({
  args: {
    id: v.string(),
    word: v.string(),
    phonetic: v.optional(v.string()),
    phonetics: v.optional(v.any()),
    meanings: v.optional(v.any()),
    updated_at: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.id) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("word_of_the_day")
      .withIndex("by_date_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("word_of_the_day", args);
    }
  },
});

export const updateLearnedWord = mutation({
  args: {
    id: v.id("learned_words"),
    part_of_speech: v.optional(v.string()),
    definition: v.optional(v.string()),
    example: v.optional(v.string()),
    group_name: v.optional(v.string()),
    // Add other fields as needed
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.user_id !== userId) throw new Error("Unauthorized");
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const deleteLearnedWord = mutation({
  args: {
    id: v.id("learned_words")
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.user_id !== userId) throw new Error("Unauthorized");
    return await ctx.db.delete(args.id);
  }
});

export const sendFriendRequest = mutation({
  args: {
    sender_id: v.optional(v.string()),
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("friend_requests", { 
      receiver_id: args.receiver_id,
      status: "pending",
      sender_id: userId 
    });
  }
});

export const saveOnboarding = mutation({
  args: {
    id: v.string(),
    selected_platform: v.string(),
    learning_goal: v.string(),
    daily_time: v.string(),
    proficiency_level: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId || userId !== args.id) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_user_id", (q) => q.eq("id", args.id))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("onboarding", args);
    }
  }
});
