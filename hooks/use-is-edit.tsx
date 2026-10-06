import { useState, useEffect } from 'react';

export const useIsEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setIsEdit(window.location.hostname.startsWith('edit.'));
  }, []);

  return isEdit;
};
