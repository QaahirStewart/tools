import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    // Fetch all polls
    const { data: polls, error: pollsDataError } = await client
      .from("polls")
      .select("*")
      .order("created_at");

    if (pollsDataError) {
      throw pollsDataError;
    }

    // Fetch pinned polls
    const { data: pinnedPolls, error: pinnedPollsDataError } = await client
      .from("polls")
      .select("*")
      .eq("pinned", true)
      .order("created_at");

    if (pinnedPollsDataError) {
      throw pinnedPollsDataError;
    }

    // Destructure the first pinned poll (if it exists)
    const pinnedPoll = pinnedPolls.length > 0 ? pinnedPolls[0] : null;

    return {
      polls,
      pinnedPoll, // Return only the first pinned poll
    };
  } catch (error) {
    console.error("Error fetching polls:", error.message);
    return { error: error.message };
  }
});
