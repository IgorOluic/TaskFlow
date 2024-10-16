import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { filterTasks } from '../../../redux/tasks/tasksSlice';
import SvgIcon from '../SvgIcon';
import { TaskStatus } from '../../../redux/tasks/tasksTypes';

const TaskSearchInput = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(
        filterTasks({
          search,
          statusesToFilter: [TaskStatus.backlog, TaskStatus.board],
        }),
      );
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
    dispatch(
      filterTasks({
        search: null,
        statusesToFilter: [TaskStatus.backlog, TaskStatus.board],
      }),
    );
  };

  return (
    <InputGroup>
      <InputLeftElement>
        <SvgIcon
          name="magnifyingGlass"
          width="16px"
          height="16px"
          color="gray.500"
        />
      </InputLeftElement>
      <Input placeholder="Search" value={search} onChange={handleInputChange} />
      {search && (
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={
              <SvgIcon
                name="close"
                width="12px"
                height="12px"
                color="gray.500"
              />
            }
            size="xs"
            variant="ghost"
            onClick={handleClearSearch}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default TaskSearchInput;
