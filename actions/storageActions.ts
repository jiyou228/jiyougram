"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  // const file = formData.get("file") as File;

  const files = Array.from(formData.entries()).map(
    ([name, file]) => file as File
  );
  const results = await Promise.all(
    files.map((file) =>
      supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
        .upload(file.name, file, { upsert: true })
    )
  );

  // handleError(error);

  return results;
}

export async function searchFiles(search: string = "") {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .list(null, {
      search,
    });

  handleError(error);

  return data;
}

export async function deleteFile(filename: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove([filename]);

  handleError(error);

  return data;
}
