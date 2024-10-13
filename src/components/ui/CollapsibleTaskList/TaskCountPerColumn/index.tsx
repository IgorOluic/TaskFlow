import { HStack } from '@chakra-ui/react';
import { TaskStatus } from '../../../../redux/tasks/tasksTypes';
import { selectColumnIds } from '../../../../redux/columns/columnsSelectors';
import ColumnTaskCountItem from './ColumnTaskCountItem';
import { useAppSelector } from '../../../../hooks/useAppSelector';

interface TaskCountPerColumnProps {
  status: TaskStatus;
}

const TaskCountPerColumn = ({ status }: TaskCountPerColumnProps) => {
  const columnIds = useAppSelector(selectColumnIds);

  const renderCountItem = (columnId: string, index: number): JSX.Element => {
    return (
      <ColumnTaskCountItem key={index} status={status} columnId={columnId} />
    );
  };

  return <HStack>{columnIds.map(renderCountItem)}</HStack>;
};

export default TaskCountPerColumn;
