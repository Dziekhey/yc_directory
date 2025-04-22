"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchFormReset = () => {
  const router = useRouter();

  const handleReset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) form.reset();
    router.push("/"); // Navigate to home after reset
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="search-btn text-white flex items-center"
    >
      <X className="size-5" />
    </button>
  );
};

export default SearchFormReset;
