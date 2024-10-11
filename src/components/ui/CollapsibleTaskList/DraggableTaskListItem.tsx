import { VStack } from '@chakra-ui/react';
import { TaskStatusDataFields } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskByIdAndField } from '../../../redux/tasks/tasksSelectors';
import TaskListItem from './TaskListItem';
import { Draggable } from 'react-beautiful-dnd';

interface DraggableTaskListItemProps {
  taskId: string;
  dataField: TaskStatusDataFields;
  index: number;
}

const DraggableTaskListItem = ({
  taskId,
  dataField,
  index,
}: DraggableTaskListItemProps) => {
  const task = useAppSelector(selectTaskByIdAndField(dataField, taskId));

  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided, snapshot) => (
        <VStack
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          w="full"
          bg={snapshot.isDragging ? 'purple.100' : 'white'}
          borderBottomWidth={1}
          borderBottomColor="gray.300"
          data-extra-info="asd"
        >
          <TaskListItem task={task} dataField={dataField} />
        </VStack>
      )}
    </Draggable>
  );
};

export default DraggableTaskListItem;
