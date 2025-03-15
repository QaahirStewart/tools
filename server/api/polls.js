import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const { data: polls, error: pollsDataError } = await client
      .from("polls")
      .select("*")
      .order("created_at");

    if (pollsDataError) {
      throw pollsDataError;
    }

    return {
      polls,
    };
  } catch (error) {
    console.error("Error fetching polls:", error.message);
    return { error: error.message };
  }
});
