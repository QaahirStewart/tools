import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const pollid = getRouterParam(event, "id");

    // Fetch poll data
    const { data: poll, error: pollDataError } = await client
      .from("polls")
      .select("*")
      .eq("id", pollid)
      .single();

    if (pollDataError) {
      throw pollDataError;
    }

    // Fetch options for the poll
    const { data: options, error: optionsDataError } = await client
      .from("options")
      .select("*")
      .eq("poll_id", pollid);

    if (optionsDataError) {
      throw optionsDataError;
    }

    // Fetch votes for the poll
    const { data: votes, error: votesDataError } = await client
      .from("poll_votes")
      .select("*")
      .eq("poll_id", pollid);

    if (votesDataError) {
      throw votesDataError;
    }

    return {
      poll,
      options,
      votes,
    };
  } catch (error) {
    console.error("Error fetching poll data:", error.message);
    return { error: error.message };
  }
});
