import { Text } from '@chakra-ui/react';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectFilteredTaskIds } from '../../../redux/tasks/tasksSelectors';
import { useMemo } from 'react';

interface TaskCountProps {
  status: TaskStatus;
}

const TaskCount = ({ status }: TaskCountProps) => {
  const totalCount = useAppSelector(selectFilteredTaskIds(status)).length;
  const filteredCount = useAppSelector(selectFilteredTaskIds(status)).length;

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
