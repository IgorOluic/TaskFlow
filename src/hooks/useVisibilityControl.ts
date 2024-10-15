import { useState } from 'react';

const useVisibilityControl = (initiallyOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const onOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const onClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const onToggle = () => setIsOpen(!isOpen);

  return { isOpen, setIsOpen, onOpen, onClose, onToggle };
};

export default useVisibilityControl;
