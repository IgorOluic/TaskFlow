import { VStack } from '@chakra-ui/react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Droppable } from '@hello-pangea/dnd';
import TaskListItem from './TaskListItem';
import { selectFilteredTaskIds } from '../../../redux/tasks/tasksSelectors';

interface TaskListProps {
  status: TaskStatus;
}

const TaskList = ({ status }: TaskListProps) => {
  const taskIds = useAppSelector(selectFilteredTaskIds(status));

  return (
    <Droppable droppableId={`droppable-${status}`}>
      {(provided) => (
        <VStack
          {...provided.droppableProps}
          ref={provided.innerRef}
          w="full"
          spacing={0}
          cursor="pointer"
        >
          {taskIds.map((task, index) => (
            <TaskListItem
              key={task}
              taskId={task}
              status={status}
              index={index}
            />
          ))}
          {provided.placeholder}
        </VStack>
      )}
    </Droppable>
  );
};

export default TaskList;
