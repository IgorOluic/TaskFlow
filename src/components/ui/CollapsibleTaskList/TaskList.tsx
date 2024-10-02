import { VStack } from '@chakra-ui/react';
import {
  TaskStatusDataFields,
  TaskStatusIdsFields,
} from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectTaskIdsByField } from '../../../redux/tasks/tasksSelectors';
import TaskListItem from './TaskListItem';

interface TaskListProps {
  idsField: TaskStatusIdsFields;
  dataField: TaskStatusDataFields;
}

const TaskList = ({ idsField, dataField }: TaskListProps) => {
  const taskIds = useAppSelector(selectTaskIdsByField(idsField));

  const renderTaskItem = (id: string, index: number): JSX.Element => {
    const isLastItem = taskIds.length - 1 === index;
    return (
      <TaskListItem
        key={index}
        taskId={id}
        dataField={dataField}
        isLastItem={isLastItem}
      />
    );
  };

  return (
    <VStack
      w="full"
      alignItems="flex-start"
      backgroundColor="white"
      borderWidth={1}
      borderColor="gray.300"
      spacing={0}
    >
      {taskIds.map(renderTaskItem)}
    </VStack>
  );
};

export default TaskList;
