import { useState, useEffect } from 'react';

export const useIsEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setIsEdit(window.location.hostname === 'edit.sta.dnb.de'), [];
  });

  return isEdit;
};
