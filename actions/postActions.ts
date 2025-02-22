import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from "utils/supabase/server";
import { Database } from "types_db";

export type TextRow = Database["public"]["Tables"]["textarea"]["Row"];
export type TextRowInsert = Database["public"]["Tables"]["textarea"]["Insert"];
export type TextRowUpdate = Database["public"]["Tables"]["textarea"]["Update"];

export async function getText({ searchInput = "" }): Promise<TextRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("textarea")
    .select("*")
    .like("title", `%${searchInput}%`)
    .order("created_at", { ascending: true });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function getUserById(userId) {
  const supabase = await createServerSupabaseAdminClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  return data.user;
}

export async function createPost(postData: {
  caption: string;
  userId: string;
}) {
  const { caption, userId } = postData;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("textarea").insert([
    {
      caption,
      user_id: userId,
      comments_count: 0,
      like_count: 0,
      image_url: "",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("텍스트 저장 실패:", error);
    throw new Error("텍스트 저장에 실패했습니다.");
  }

  return data;
}
