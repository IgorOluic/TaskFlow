import {
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/react';
import AvatarEditor from 'react-avatar-editor';
import { MutableRefObject, useState } from 'react';

interface ImageCropperProps {
  uploadedImage: string;
  editorRef: MutableRefObject<AvatarEditor | null>;
}

const ImageCropper = ({ uploadedImage, editorRef }: ImageCropperProps) => {
  const [scale, setScale] = useState(1);

  return (
    <VStack spacing={4}>
      <AvatarEditor
        ref={editorRef}
        image={uploadedImage}
        width={200}
        height={200}
        border={25}
        scale={scale}
        rotate={0}
      />
      <HStack w="full" px={2}>
        <Text fontSize="sm">Zoom</Text>
        <Slider value={scale} min={1} max={3} step={0.1} onChange={setScale}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
    </VStack>
  );
};

export default ImageCropper;
