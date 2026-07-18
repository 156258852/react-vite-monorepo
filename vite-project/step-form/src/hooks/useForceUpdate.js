import { useState, useCallback } from 'react';

/**
 * Returns a function that forces a re-render when called
 */
export const useForceUpdate = () => {
  const [, setUpdate] = useState({});
  return useCallback(() => setUpdate({}), []);
};

export default useForceUpdate;
