"use clinet";

import { useQuery } from "@tanstack/react-query";
import DropboxImage from "./Image";
import { searchFiles } from "actions/storageActions";
import { Spinner } from "@material-tailwind/react";

export default function ImageList({ searchInput }) {
  const searchImageQuery = useQuery({
    queryKey: ["images", searchInput],
    queryFn: () => searchFiles(searchInput),
  });
  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
      {searchImageQuery.isLoading && <Spinner />}
      {searchImageQuery.data &&
        searchImageQuery.data.map((image) => (
          <DropboxImage key={image.id} image={image} />
        ))}
    </section>
  );
}
