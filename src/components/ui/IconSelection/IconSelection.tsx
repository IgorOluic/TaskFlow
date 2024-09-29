import React, { useState } from 'react';
import { Button, Image, VStack } from '@chakra-ui/react';
import AvatarSelectionModal from '../../modals/AvatarSelectionModal';
import DEFAULT_AVATARS, {
  DefaultAvatarIcon,
} from '../../../constants/defaultAvatars';
import { getRandomNumber } from '../../../utils/common';

interface IconSelectionProps {
  setSelectedIcon: (id: number | null) => void;
  setSelectedImage: (image: string | null) => void;
}

const IconSelection = ({
  setSelectedIcon,
  setSelectedImage,
}: IconSelectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewIcon, setPreviewIcon] = useState<DefaultAvatarIcon | null>(
    DEFAULT_AVATARS[getRandomNumber(19)],
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChangeIcon = () => {
    setModalOpen(true);
  };

  const setIcon = (value: DefaultAvatarIcon | null) => {
    setPreviewIcon(value);
    setSelectedIcon(value?.id || null);
  };

  const setImage = (value: string | null) => {
    setPreviewImage(value);
    setSelectedImage(value);
  };

  return (
    <>
      <VStack>
        <Image
          borderRadius={8}
          src={previewImage || previewIcon?.url}
          width="150px"
          height="150px"
          bg={previewImage ? 'transparent' : previewIcon?.bgColor}
        />
        <Button
          onClick={handleChangeIcon}
          size="sm"
          variant="outline"
          colorScheme="gray"
        >
          Change Icon
        </Button>
      </VStack>

      {modalOpen && (
        <AvatarSelectionModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          selectedIcon={previewIcon}
          setIcon={setIcon}
          setImage={setImage}
        />
      )}
    </>
  );
};

export default IconSelection;
