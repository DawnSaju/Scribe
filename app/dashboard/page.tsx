import React from "react";
import Words from "@/components/features/words/WordsList";
import WordOfTheDay from "@/components/features/WordOfTheDay";
import { CustomCard } from "@/components/ui/CustomCard";

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-[24px] w-full px-[24px] pt-[24px]">
      <CustomCard className="!p-0 overflow-hidden">
        <WordOfTheDay />
      </CustomCard>
      
      <div className="w-full">
        <Words />
      </div>
    </div>
  );
}
