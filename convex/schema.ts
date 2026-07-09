import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    ...authTables.users.validator.fields,
    install_progress: v.optional(v.number()),
    has_completed_tour: v.optional(v.boolean()),
    extensionId: v.optional(v.string()),
    last_sign_in_at: v.optional(v.string()),
    streakCount: v.optional(v.number()),
    tier: v.optional(v.string()),
    isConnected: v.optional(v.boolean()),
    XP: v.optional(v.number()),
    has_onboarded: v.optional(v.boolean()),
    beta: v.optional(v.boolean()),
  })
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),
  
  learned_words: defineTable({
    user_id: v.string(),
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
    group_name: v.optional(v.string()),
    is_new: v.optional(v.boolean()),
  }).index("by_user", ["user_id"]),

  word_of_the_day: defineTable({
    id: v.string(),
    word: v.string(),
    phonetic: v.optional(v.string()),
    phonetics: v.optional(v.any()),
    meanings: v.optional(v.any()),
    updated_at: v.string(),
  }).index("by_date_id", ["id"]),

  onboarding: defineTable({
    id: v.string(),
    selected_platform: v.string(),
    learning_goal: v.string(),
    daily_time: v.string(),
    proficiency_level: v.string(),
  }).index("by_user_id", ["id"]),

  friend_requests: defineTable({
    sender_id: v.string(),
    receiver_id: v.string(),
    status: v.string(),
  }).index("by_receiver", ["receiver_id"]).index("by_sender", ["sender_id"]),

  profiles: defineTable({
    id: v.string(),
    tier: v.optional(v.string()),
    full_name: v.optional(v.string()),
    beta: v.optional(v.boolean()),
  }).index("by_user_id", ["id"]),
});
