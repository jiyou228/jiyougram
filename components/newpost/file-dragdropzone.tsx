"use client";

import { Button, Spinner } from "@material-tailwind/react";
import { useCallback, useRef } from "react";
import { uploadFile } from "actions/storageActions";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "config/ReactQueryClientProvider";
import { useDropzone } from "react-dropzone";

export default function FileDragDropZone() {
  const fileRef = useRef(null);
  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append(file.name, file);
      });

      const result = await uploadImageMutation.mutate(formData);
      console.log(result);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="h-96 max-w-full w-full  border-2 border-dashed border-indigo-700 flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadImageMutation.isPending ? (
        <Spinner />
      ) : isDragActive ? (
        <p>파일을 놓아주세요</p>
      ) : (
        <p className="text-gray-600">
          파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
        </p>
      )}

      {/* <Button loading={uploadImageMutation.isPending} type="submit">
        파일업로드
      </Button> */}
    </div>
  );
}
