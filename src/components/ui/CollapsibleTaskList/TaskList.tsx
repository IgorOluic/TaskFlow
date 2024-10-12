import { VStack } from '@chakra-ui/react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectFilteredTaskIdsByField } from '../../../redux/tasks/tasksSelectors';
import { Droppable } from '@hello-pangea/dnd';
import TaskListItem from './TaskListItem';
import { TASK_STATUS_FIELDS } from '../../../constants/tasks';

interface TaskListProps {
  status: TaskStatus;
}

const TaskList = ({ status }: TaskListProps) => {
  const taskStatusFields = TASK_STATUS_FIELDS[status];

  const taskIds = useAppSelector(
    selectFilteredTaskIdsByField(taskStatusFields.filteredIds),
  );

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
              dataField={taskStatusFields.data}
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
