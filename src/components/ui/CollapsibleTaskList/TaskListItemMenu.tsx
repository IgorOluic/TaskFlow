import { Center, Flex, Text, VStack, useOutsideClick } from '@chakra-ui/react';
import { useRef } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { updateTaskStatusAndPosition } from '../../../redux/tasks/tasksSlice';
import SvgIcon from '../SvgIcon';
import useVisibilityControl from '../../../hooks/useVisibilityControl';

interface TaskMenuProps {
  taskId: string;
  status: TaskStatus;
}

const TaskListItemMenu = ({ taskId, status }: TaskMenuProps) => {
  const dispatch = useAppDispatch();
  const { isOpen, onClose, onToggle } = useVisibilityControl();
  const ref = useRef(null);

  const isInBoard = status === TaskStatus.board;

  useOutsideClick({ ref, handler: onClose });

  const onMoveToClick = () => {
    dispatch(
      updateTaskStatusAndPosition({
        taskId,
        newStatus: isInBoard ? TaskStatus.backlog : TaskStatus.board,
        oldStatus: status,
        newIndex: 0,
      }),
    );
  };

  return (
    <Center
      ref={ref}
      h="30px"
      w="30px"
      _hover={{ bg: 'gray.200' }}
      borderRadius={4}
      onClick={onToggle}
      position="relative"
    >
      <SvgIcon name="horizontalDots" ml="2px" w="20px" h="20px" />

      {isOpen && (
        <VStack
          position="absolute"
          top="100%"
          marginTop="10px"
          right={0}
          bg="white"
          py={2}
          zIndex={10}
          minW="200px"
          borderWidth={1}
          boxShadow="md"
          alignItems="flex-start"
        >
          <Flex onClick={onMoveToClick} w="full" px={4}>
            <Text>
              Move to{' '}
              <Text as="span" fontWeight={600}>
                {isInBoard ? 'Backlog' : 'Board'}
              </Text>
            </Text>
          </Flex>
        </VStack>
      )}
    </Center>
  );
};

export default TaskListItemMenu;
