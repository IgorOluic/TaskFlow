import { Center, HStack, Text } from '@chakra-ui/react';
import SvgIcon from './SvgIcon';

const TaskListItem = ({
  task,
  isLastItem,
}: {
  task: any;
  isLastItem: boolean;
}) => {
  return (
    <HStack
      justifyContent="space-between"
      w="full"
      borderBottomWidth={isLastItem ? 0 : 1}
      borderBottomColor="gray.300"
      px={4}
      py={2}
    >
      <Text>{task.title}</Text>

      <Center w={6} h={6} borderRadius="full" backgroundColor="green">
        <SvgIcon name="calendar" width="16px" height="16px" />
      </Center>
    </HStack>
  );
};

export default TaskListItem;
