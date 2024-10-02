import { Center, Flex, Text, VStack, useOutsideClick } from '@chakra-ui/react';
import SvgIcon from './SvgIcon';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { changeTaskStatus } from '../../redux/tasks/tasksSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectSelectedProject } from '../../redux/projects/projectsSelectors';
import { TaskStatus } from '../../redux/tasks/tasksTypes';

interface TaskMenuProps {
  isBoard?: boolean;
  taskId: string;
  status: TaskStatus;
}

const TaskMenu = ({ isBoard, taskId, status }: TaskMenuProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedProject = useAppSelector(selectSelectedProject);

  useOutsideClick({ ref, handler: () => setOpen(false) });

  const onClick = () => {
    setOpen(!open);
  };

  const onMoveToClick = () => {
    dispatch(
      changeTaskStatus({
        taskId,
        projectId: selectedProject?.id as string,
        newStatus: isBoard ? TaskStatus.backlog : TaskStatus.active,
        oldStatus: status,
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
      onClick={onClick}
      position="relative"
    >
      <SvgIcon name="horizontalDots" ml="2px" w="20px" h="20px" />

      {open && (
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
          <Flex onClick={onMoveToClick} bg="red" w="full" px={4}>
            <Text>Move to {isBoard ? 'backlog' : 'board'}</Text>
          </Flex>
        </VStack>
      )}
    </Center>
  );
};

export default TaskMenu;
