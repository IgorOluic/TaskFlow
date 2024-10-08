import { useState } from 'react';

const useVisibilityControl = (initiallyOpen?: boolean) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(!isOpen);

  return { isOpen, setIsOpen, onOpen, onClose, onToggle };
};

export default useVisibilityControl;
