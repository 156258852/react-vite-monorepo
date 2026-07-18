import { createContext, useContext } from 'react';

const FormCtx = createContext({});

export const useFormContext = () => useContext(FormCtx);

export default FormCtx;
