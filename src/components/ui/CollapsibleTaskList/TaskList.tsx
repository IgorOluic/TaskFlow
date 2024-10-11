import { VStack } from '@chakra-ui/react';
import {
  TaskStatusDataFields,
  TaskStatusIdsFields,
} from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectFilteredTaskIdsByField } from '../../../redux/tasks/tasksSelectors';
import { Droppable } from 'react-beautiful-dnd';
import DraggableTaskListItem from './DraggableTaskListItem';

interface TaskListProps {
  idsField: TaskStatusIdsFields;
  dataField: TaskStatusDataFields;
}

const TaskList = ({ idsField, dataField }: TaskListProps) => {
  const taskIds = useAppSelector(
    selectFilteredTaskIdsByField(idsField, dataField),
  );

  return (
    <Droppable
      // TODO: Find a better way to do this
      droppableId={
        dataField === 'backlogTasksData'
          ? 'droppable-backlog'
          : 'droppable-board'
      }
    >
      {(provided) => (
        <VStack
          {...provided.droppableProps}
          ref={provided.innerRef}
          w="full"
          spacing={0}
          cursor="pointer"
          transition="all .3s"
          _hover={{ transition: 'all .3s' }}
        >
          {taskIds.map((task, index) => (
            <DraggableTaskListItem
              key={task}
              taskId={task}
              dataField={dataField}
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
