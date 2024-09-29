import { Center, VStack, Text, Image } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import SvgIcon from '../SvgIcon';

interface UploadSectionProps {
  onDrop: (acceptedFiles: File[]) => void;
  uploadedImage: string | null;
}

const UploadSection = ({ onDrop, uploadedImage }: UploadSectionProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <Center
      {...getRootProps()}
      borderWidth="2px"
      borderRadius="full"
      borderStyle="dashed"
      borderColor="gray.400"
      p={uploadedImage ? 2 : 6}
      textAlign="center"
      cursor="pointer"
      position="relative"
      alignItems="center"
      justifyContent="center"
      w="200px"
      h="200px"
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <Image
          src={uploadedImage}
          alt="Uploaded Image"
          boxSize="full"
          borderRadius="full"
        />
      ) : (
        <VStack>
          <SvgIcon name="upload" width="24px" height="24px" />
          <Text fontSize={14}>
            Drag and drop your image here or click to upload
          </Text>
        </VStack>
      )}
    </Center>
  );
};

export default UploadSection;
