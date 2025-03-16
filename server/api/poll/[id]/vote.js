import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);
    const pollId = getRouterParam(event, "id");
    const { option_id, viewing_platform } = await readBody(event);

    // Insert the vote into the poll_votes table
    const { data: vote, error: voteError } = await client
      .from("poll_votes")
      .insert([
        {
          poll_id: pollId,
          option_id,
          viewing_platform,
        },
      ])
      .single();

    if (voteError) {
      throw voteError;
    }

    // Update the vote count in the polls table
    // const { data: poll, error: pollError } = await client
    //   .from("polls")
    //   .update({ vote_count: client.raw("vote_count + 1") })
    //   .eq("id", pollId)
    //   .single();

    // if (pollError) {
    //   throw pollError;
    // }

    return {
      success: true,
      vote,
    };
  } catch (error) {
    console.error("Error submitting vote:", error.message);
    return { error: error.message };
  }
});
