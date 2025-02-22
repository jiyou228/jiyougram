"use client";

import { Button, Textarea } from "@material-tailwind/react";
import FileDragDropZone from "./file-dragdropzone";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { createPost } from "actions/postActions";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function Post() {
  const [input, setInput] = useState(""); // 텍스트 상태
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드된 이미지 상태
  const [imageUrl, setImageUrl] = useState("");

  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      const uploadedFileData = data[0]?.data;
      if (uploadedFileData) {
        setImageUrl(uploadedFileData.path);
      }
    },
    onError: (error) => {
      console.error("파일 업로드 중 에러 발생: ", error);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      console.log("텍스트 저장 성공");
    },
    onError: (error) => {
      console.error("텍스트 저장 실패:", error);
    },
  });

  const handleSubmit = async () => {
    const supabase = createBrowserSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      throw new Error("User is not authenticated");
    }

    const userId = session.user.id;
    const caption = input;

    // if (uploadedImage && uploadedImage.length > 0) {
    //   const formData = new FormData();
    //   uploadedImage.forEach((file) => {
    //     formData.append(file.name, file);
    //   });

    //   try {
    //     await uploadImageMutation.mutateAsync(formData); // 이미지 업로드

    //     // 파일 업로드 후 텍스트와 이미지 URL을 함께 저장
    //     createPostMutation.mutate({ caption, userId });
    //   } catch (error) {
    //     console.error("업로드 실패: ", error);
    //   }
    // }
    createPostMutation.mutate({ caption, userId });
  };

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-light-blue-50">
      <div className="pt-6 pb-6 px-10 w-full max-w-lg flex flex-col items-center justify-center border border-gray-400 bg-white gap-4">
        <div className="w-full">
          <FileDragDropZone
            onFilesSelected={(files) => setUploadedImage(files)}
          />
        </div>

        <div className="w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            label="본문"
            className="h-36 w-full"
          />
        </div>

        <div>
          <Button
            onClick={handleSubmit}
            className="text-white text-sm bg-indigo-600"
          >
            업로드
          </Button>
        </div>
      </div>
    </main>
  );
}
