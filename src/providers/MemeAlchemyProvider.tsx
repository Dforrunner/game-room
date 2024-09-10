'use client';

import { useMemeAlchemy } from '@/hooks/useMemeAlchemy';
import React, { createContext } from 'react';

type MemeAlchemyContextState = ReturnType<typeof useMemeAlchemy>;

// Create the context
export const MemeAlchemyContext = createContext<MemeAlchemyContextState>(
  {} as any
);

interface Props {
  children: React.ReactNode;
}
export default function MemeAlchemyProvider({ children }: Props) {
  const contextValue = useMemeAlchemy();

  return (
    <MemeAlchemyContext.Provider value={contextValue}>
      {children}
    </MemeAlchemyContext.Provider>
  );
}
