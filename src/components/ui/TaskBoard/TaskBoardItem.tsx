import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectBoardTaskById } from '../../../redux/tasks/tasksSelectors';
import TinyAssigneeSelection from '../AssigneeSelection/TinyAssigneeSelection';
import { BOARD_TASKS_DATA } from '../../../constants/tasks';
import { useRef, useState } from 'react';

interface TaskBoardItemProps {
  taskId: string;
}

const TaskBoardItem = ({ taskId }: TaskBoardItemProps) => {
  const task = useAppSelector(selectBoardTaskById(taskId));
  const [isDragging, setIsDragging] = useState(false);
  const taskRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('taskId', taskId);
    event.dataTransfer.effectAllowed = 'move';

    // Get the actual width of the component and apply it to the drag image
    if (taskRef.current) {
      const { offsetWidth } = taskRef.current;
      const dragImage = taskRef.current.cloneNode(true) as HTMLDivElement;
      dragImage.style.width = `${offsetWidth}px`;
      dragImage.style.borderColor = 'transparent';
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }

    setIsDragging(true);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <VStack
      ref={taskRef}
      w="full"
      backgroundColor="white"
      borderRadius={8}
      p={2}
      borderWidth={1}
      cursor="pointer"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      borderColor={isDragging ? 'purple.400' : 'gray.200'}
    >
      <Flex flex={1} w="full" mb={2}>
        <Text fontSize={14}>{task.summary}</Text>
      </Flex>

      <HStack w="full" alignItems="center" justifyContent="space-between">
        <Text fontSize={12} fontWeight={600}>
          {task.id}
        </Text>

        <TinyAssigneeSelection
          taskId={task.id}
          assigneeId={task.assignedTo}
          dataField={BOARD_TASKS_DATA}
        />
      </HStack>
    </VStack>
  );
};

export default TaskBoardItem;
