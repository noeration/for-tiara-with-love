"use client";

import { createContext, useContext, type ReactNode } from "react";
import { birthday, type MemoryConfig } from "@/data/birthday";

const ContentContext = createContext<MemoryConfig>(birthday);

export function ContentProvider({
  content,
  children,
}: {
  content: MemoryConfig;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
