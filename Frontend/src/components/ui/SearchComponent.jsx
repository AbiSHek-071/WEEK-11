import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchComponent() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className='relative flex items-center justify-end'>
      <div
        className={`absolute right-[44px] top-0 transition-all duration-300 ease-in-out overflow-hidden ${
          isSearchVisible ? "w-64 opacity-100 mr-[10px]" : "w-0 opacity-0 mr-0"
        }`}>
        <Input
          type='search'
          placeholder='Search...'
          className='w-full h-10 pl-3 pr-10'
        />
      </div>
      <Button
        variant='outline'
        size='icon'
        onClick={toggleSearch}
        aria-label='Toggle search'
        className='relative z-10'>
        <Search className='h-4 w-4' />
      </Button>
      
    </div>
  );
}
