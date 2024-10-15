import { Text } from '@chakra-ui/react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  selectFilteredTaskCount,
  selectTotalTaskCount,
} from '../../../redux/tasks/tasksSelectors';
import { useMemo } from 'react';

interface TaskCountProps {
  status: TaskStatus;
}

const TaskCount = ({ status }: TaskCountProps) => {
  const totalCount = useAppSelector(selectTotalTaskCount(status));
  const filteredCount = useAppSelector(selectFilteredTaskCount(status));

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
