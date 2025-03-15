import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event);

    const pollid = getRouterParam(event, "id");

    const { data: poll, pollDataError } = await client
      .from("polls")
      .select("*")
      .eq("id", pollid);

    if (pollDataError) {
      throw pollDataError;
    }

    return {
      poll,
    };
  } catch (error) {
    console.error("Error fetching polls:", error.message);
    return { error: error.message };
  }
});
