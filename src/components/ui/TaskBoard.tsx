import { HStack } from '@chakra-ui/react';
import TaskBoardColumn from './TaskBoardColumn';

const mockTaskColumns = [
  {
    title: 'TO DO',
    id: 1,
    tasks: [
      {
        title: 'task',
        id: 100,
      },
      {
        title: 'task 2',
        id: 101,
      },
      {
        title: 'task 3',
        id: 102,
      },
    ],
  },
  {
    title: 'IN PROGRESS',
    id: 2,
    tasks: [
      {
        title: 'task 4',
        id: 103,
      },
      {
        title: 'task 5',
        id: 104,
      },
      {
        title: 'task 6',
        id: 105,
      },
    ],
  },
];

interface TaskBoardProps {}

const TaskBoard = ({}: TaskBoardProps) => {
  const renderColumnItem = (column: any, index: number): JSX.Element => {
    return (
      <TaskBoardColumn
        key={index}
        title={column.title}
        columnId={column.id}
        tasks={column.tasks}
      />
    );
  };

  return (
    <HStack w="full" h="500px" backgroundColor="blue.100" overflowX="scroll">
      {mockTaskColumns.map(renderColumnItem)}
    </HStack>
  );
};

export default TaskBoard;
