import * as React from 'react';

const disabledRowContext = React.createContext<boolean | undefined>(undefined);

export const disabledRowContextDefaultValue = false;

export const useDisabledRowContext = () =>
  React.useContext(disabledRowContext) ?? disabledRowContextDefaultValue;

export const DisabledRowContextProvider = disabledRowContext.Provider;