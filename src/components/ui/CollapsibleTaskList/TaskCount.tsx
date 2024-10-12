import { Text } from '@chakra-ui/react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { TASK_STATUS_FIELDS } from '../../../constants/tasks';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  selectFilteredTaskIdsByField,
  selectTaskIdsByField,
} from '../../../redux/tasks/tasksSelectors';
import { useMemo } from 'react';

interface TaskCountProps {
  status: TaskStatus;
}

const TaskCount = ({ status }: TaskCountProps) => {
  const { ids, filteredIds } = TASK_STATUS_FIELDS[status];

  const totalCount = useAppSelector(selectTaskIdsByField(ids)).length;
  const filteredCount = useAppSelector(
    selectFilteredTaskIdsByField(filteredIds),
  ).length;

  const countText = useMemo(() => {
    if (totalCount === filteredCount) {
      return `(${totalCount} task${totalCount > 1 ? 's' : ''})`;
    }

    return `(${filteredCount} of ${totalCount} tasks visible)`;
  }, [totalCount, filteredCount]);

  return (
    <Text as="span" fontSize={12} fontWeight={500} color="gray.500">
      {countText}
    </Text>
  );
};

export default TaskCount;
