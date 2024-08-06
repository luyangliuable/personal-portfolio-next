"use client";

import React, { ReactNode } from "react";
import { Provider } from 'react-redux';
import { TriggerProvider } from './TriggerContext';
import { store } from './store';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <TriggerProvider>
        {children}
      </TriggerProvider>
    </Provider>
  );
}
