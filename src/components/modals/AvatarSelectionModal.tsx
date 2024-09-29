import { useMemo, useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  VStack,
  HStack,
  Center,
} from '@chakra-ui/react';
import DEFAULT_AVATARS, {
  DefaultAvatarIcon,
} from '../../constants/defaultAvatars';
import SvgIcon from '../ui/SvgIcon';
import AvatarEditor from 'react-avatar-editor';
import ImageCropper from '../ui/ImageCropper';
import IconGrid from '../ui/IconSelection/IconGrid';
import UploadSection from '../ui/IconSelection/UploadSection';
import DefaultIconItem from '../ui/IconSelection/DefaultAvatarIcon';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedIcon: DefaultAvatarIcon | null;
  setIcon: (newIcon: DefaultAvatarIcon | null) => void;
  setImage: (image: string | null) => void;
}

const AvatarSelectionModal = ({
  isOpen,
  setIsOpen,
  selectedIcon,
  setIcon,
  setImage,
}: AvatarSelectionModalProps) => {
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [focusedIcon, setFocusedIcon] = useState<DefaultAvatarIcon | null>(
    selectedIcon ?? null,
  );
  const editorRef = useRef<AvatarEditor>(null);

  const onClose = () => {
    setIsOpen(false);
  };

  const onBack = () => {
    setShowAllIcons(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSelection = () => {
    if (editorRef.current && uploadedImage) {
      const canvas = editorRef.current.getImage().toDataURL();
      setImage(canvas);
      setIcon(null);
      setUploadedImage(null);
      onClose();
    } else if (focusedIcon) {
      setImage(null);
      setIcon(focusedIcon);
      onClose();
    }
  };

  const initiallyShownIcons = useMemo(() => {
    if (!focusedIcon) {
      return DEFAULT_AVATARS.slice(0, 5);
    }

    const selectedIndex = DEFAULT_AVATARS.findIndex(
      (item) => item.url === focusedIcon.url,
    );

    if (selectedIndex < 5) {
      return DEFAULT_AVATARS.slice(0, 5);
    }

    return [...DEFAULT_AVATARS.slice(0, 4), focusedIcon];
  }, [focusedIcon]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent w="375px">
        <ModalHeader>Choose an icon</ModalHeader>
        <ModalBody>
          {uploadedImage ? (
            <ImageCropper uploadedImage={uploadedImage} editorRef={editorRef} />
          ) : showAllIcons ? (
            <VStack alignItems="flex-start" spacing={5}>
              <Center
                bg="gray.100"
                w="35px"
                h="35px"
                borderRadius="full"
                cursor="pointer"
                onClick={onBack}
                _hover={{ backgroundColor: 'gray.200' }}
              >
                <SvgIcon
                  name="arrowLeft"
                  height="20px"
                  width="20px"
                  ml="2px"
                  fill="gray.700"
                />
              </Center>
              <IconGrid
                avatars={DEFAULT_AVATARS}
                focusedIcon={focusedIcon}
                onClick={(icon) => setFocusedIcon(icon)}
              />
            </VStack>
          ) : (
            <VStack spacing={10}>
              <UploadSection onDrop={onDrop} uploadedImage={uploadedImage} />

              <HStack>
                {initiallyShownIcons.map((item, index) => {
                  return (
                    <DefaultIconItem
                      key={index}
                      avatar={item}
                      focusedIcon={focusedIcon}
                      onClick={(icon) => setFocusedIcon(icon)}
                    />
                  );
                })}

                <Center
                  onClick={() => setShowAllIcons(true)}
                  w="40px"
                  h="40px"
                  _hover={{ backgroundColor: 'gray.200' }}
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  borderRadius={4}
                >
                  <SvgIcon name="horizontalDots" w="20px" h="20px" ml="2px" />
                </Center>
              </HStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <HStack spacing={4}>
            <Button variant="ghost" onClick={onClose} colorScheme="gray">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleConfirmSelection}
              isDisabled={!focusedIcon && !uploadedImage}
            >
              Select
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AvatarSelectionModal;
