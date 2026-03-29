import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { applyTaskFilter } from '../../../redux/tasks/tasksSlice';
import SvgIcon from '../SvgIcon';
import { TaskFilterTypes, TaskStatus } from '../../../redux/tasks/tasksTypes';
import { useLocation, useNavigate } from 'react-router-dom';

const TaskSearchInput = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get('search') || '';

    if (inputRef.current) {
      inputRef.current.value = initialSearch;
    }

    if (initialSearch) {
      dispatch(
        applyTaskFilter({
          key: TaskFilterTypes.SEARCH,
          value: initialSearch,
          statusesToFilter: [TaskStatus.backlog, TaskStatus.board],
        }),
      );
    }

    return () => {
      dispatch(
        applyTaskFilter({
          key: TaskFilterTypes.SEARCH,
          value: '',
          statusesToFilter: [TaskStatus.backlog, TaskStatus.board],
        }),
      );
    };
  }, [dispatch]);

  const handleInputChange = (value: string) => {
    const params = new URLSearchParams(location.search);

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );

    dispatch(
      applyTaskFilter({
        key: TaskFilterTypes.SEARCH,
        value: value,
        statusesToFilter: [TaskStatus.backlog, TaskStatus.board],
      }),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleInputChange(value);
    }, 500);
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    dispatch(
      applyTaskFilter({
        key: TaskFilterTypes.SEARCH,
        value: null,
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
      <Input placeholder="Search" ref={inputRef} onChange={handleChange} />
      <InputRightElement>
        <IconButton
          aria-label="Clear search"
          icon={
            <SvgIcon name="close" width="12px" height="12px" color="gray.500" />
          }
          size="xs"
          variant="ghost"
          onClick={handleClearSearch}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default TaskSearchInput;
