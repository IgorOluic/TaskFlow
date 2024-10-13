import { Center, Text } from '@chakra-ui/react';
import { TaskStatus } from '../../../../redux/tasks/tasksTypes';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectColumnTaskCount } from '../../../../redux/tasks/tasksSelectors';

interface ColumnTaskCountItemProps {
  status: TaskStatus;
  columnId: string;
}

const ColumnTaskCountItem = ({
  status,
  columnId,
}: ColumnTaskCountItemProps) => {
  const count = useAppSelector(selectColumnTaskCount(status, columnId));

  return (
    <Center bg="purple.400" h="20px" borderRadius="full" minW="20px">
      <Text fontSize={12} lineHeight="12px" fontWeight={500} color="white">
        {count}
      </Text>
    </Center>
  );
};

export default ColumnTaskCountItem;
