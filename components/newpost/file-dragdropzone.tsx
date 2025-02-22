// "use client";

// import { Button, Spinner } from "@material-tailwind/react";
// import { useMutation } from "@tanstack/react-query";
// import { uploadFile } from "actions/storageActions";
// import { queryClient } from "config/ReactQueryClientProvider";
// import { useCallback, useRef, useState } from "react";
// import { useDropzone } from "react-dropzone";

// export default function FileDragDropZone() {
//   const [preview, setPreview] = useState(null); // 단일 미리보기 저장
//   const fileRef = useRef(null);
//   const uploadImageMutation = useMutation({
//     mutationFn: uploadFile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["images"],
//       });
//     },
//     onError: (error) => {
//       console.error("파일 업로드 중 에러 발생: ", error);
//     },
//   });

//   const onDrop = useCallback(async (acceptedFiles) => {
//     if (acceptedFiles.length > 0) {
//       const formData = new FormData();

//       const file = acceptedFiles[0]; // 첫 번째 파일만 처리
//       setPreview(URL.createObjectURL(file)); // 미리보기 URL 설정

//       acceptedFiles.forEach((file) => {
//         formData.append(file.name, file);
//       });

//       try {
//         const result = await uploadImageMutation.mutateAsync(formData); // mutate -> mutateAsync로 변경
//         console.log("업로드 결과: ", result);
//       } catch (error) {
//         console.error("업로드 실패: ", error);
//       }
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: true,
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="h-96 max-w-full w-full border-2 border-dashed border-indigo-700 flex flex-col items-center justify-center cursor-pointer relative"
//     >
//       <input {...getInputProps()} />
//       {uploadImageMutation.isPending ? (
//         <Spinner />
//       ) : isDragActive ? (
//         <p>파일을 놓아주세요</p>
//       ) : preview ? ( // 미리보기가 있으면 미리보기 이미지 표시
//         <img
//           src={preview}
//           alt="미리보기"
//           className="w-full h-full object-cover absolute top-0 left-0"
//         />
//       ) : (
//         <p className="text-gray-600">
//           파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDragDropZone({ onFilesSelected }) {
  const [preview, setPreview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 상태 관리
  const fileRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]; // 첫 번째 파일만 처리
        setPreview(URL.createObjectURL(file)); // 미리보기 URL 설정
        setSelectedFiles(acceptedFiles); // 선택된 파일 상태 업데이트
        if (onFilesSelected) {
          onFilesSelected(acceptedFiles); // 부모에게 파일 전달
        }
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // 한 번에 하나의 파일만 처리
  });

  return (
    <div
      {...getRootProps()}
      className="h-96 max-w-full w-full border-2 border-dashed border-indigo-700 flex flex-col items-center justify-center cursor-pointer relative"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>파일을 놓아주세요</p>
      ) : preview ? (
        <img
          src={preview}
          alt="미리보기"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
      ) : (
        <p className="text-gray-600">
          파일을 여기에 끌어다 놓거나 클릭하여 업로드 하세요.
        </p>
      )}
    </div>
  );
}
