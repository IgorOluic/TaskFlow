import { FormLabel, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import './RichTextEditor.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
};

interface RichTextEditorProps {
  onChange: (content: string) => void;
}

const RichTextEditor = ({ onChange }: RichTextEditorProps) => {
  return (
    <VStack alignItems="flex-start" w="full" spacing={0}>
      <FormLabel>Description</FormLabel>

      <ReactQuill
        theme="snow"
        onChange={onChange}
        placeholder="Type something..."
        modules={modules}
      />
    </VStack>
  );
};

export default RichTextEditor;
