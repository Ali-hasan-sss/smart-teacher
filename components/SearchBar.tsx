import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  buttonLabel = "Search",
  className,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex relative py-2 gap-2 ${className}`}
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      <Button
        type="submit"
        className="absolute top-3 h-8 left-2 text-white dark:text-white hover:text-gray-900"
      >
        <Search className="mr-2 " />
        {buttonLabel}
      </Button>
    </form>
  );
};

export default SearchBar;
