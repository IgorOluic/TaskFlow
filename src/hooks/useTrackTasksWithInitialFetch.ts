import { useEffect, useRef } from 'react';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { useAppDispatch } from './useAppDispatch';
import { db } from '../firebase/firebaseConfig';
import {
  updateTask,
  setInitialTasks,
  updateTaskOrder,
  setInitialLoadInProgress,
} from '../redux/tasks/tasksSlice';
import { ITask, ITasksData, TaskStatus } from '../redux/tasks/tasksTypes';
import { useAppSelector } from './useAppSelector';
import { selectSelectedProjectId } from '../redux/projects/projectsSelectors';

export const useTrackTasksWithInitialFetch = () => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector(selectSelectedProjectId);

  const initialTasksLoaded = useRef(false);
  const initialBacklogOrderLoaded = useRef(false);
  const initialBoardOrderLoaded = useRef(false);
  const bothInitialOrdersLoaded = useRef(false);

  const onBothOrdersLoaded = () => {
    bothInitialOrdersLoaded.current = true;
    dispatch(setInitialLoadInProgress(false));
  };

  useEffect(() => {
    if (!projectId) return;

    const tasksRef = collection(db, `projects/${projectId}/tasks`);
    const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
      const tasksData: ITasksData = {};

      snapshot.docChanges().forEach((change) => {
        if (change.doc.metadata.hasPendingWrites) {
          return;
        }

        const task = { id: change.doc.id, ...change.doc.data() } as ITask;

        // If it's the first snapshot, store the data
        if (!initialTasksLoaded.current) {
          tasksData[change.doc.id] = task;
        } else {
          if (change.type === 'added' || change.type === 'modified') {
            dispatch(updateTask({ taskId: change.doc.id, taskData: task }));
          } else if (change.type === 'removed') {
            // TODO: Handle task deletion
          }
        }
      });

      // After all the tasks from the first snapshot are stored, update the state and listen to changes in task orders
      if (!initialTasksLoaded.current && snapshot.docs.length > 0) {
        dispatch(setInitialTasks(tasksData));

        initialTasksLoaded.current = true;

        const backlogOrderRef = doc(
          db,
          `projects/${projectId}/taskOrders/backlog`,
        );
        const boardOrderRef = doc(db, `projects/${projectId}/taskOrders/board`);

        const unsubscribeBacklogOrder = onSnapshot(
          backlogOrderRef,
          (snapshot) => {
            if (snapshot.metadata.hasPendingWrites) {
              return;
            }

            const taskOrder = snapshot.data()?.taskOrder || [];
            dispatch(
              updateTaskOrder({
                taskStatus: TaskStatus.backlog,
                newTaskOrder: taskOrder,
                initialLoad: !initialBacklogOrderLoaded.current,
              }),
            );

            if (!initialBacklogOrderLoaded.current) {
              initialBacklogOrderLoaded.current = true;
            }

            if (
              initialBacklogOrderLoaded.current &&
              initialBoardOrderLoaded.current &&
              !bothInitialOrdersLoaded.current
            ) {
              onBothOrdersLoaded();
            }
          },
        );

        const unsubscribeBoardOrder = onSnapshot(boardOrderRef, (snapshot) => {
          if (snapshot.metadata.hasPendingWrites) {
            return;
          }

          const taskOrder = snapshot.data()?.taskOrder || [];
          dispatch(
            updateTaskOrder({
              taskStatus: TaskStatus.board,
              newTaskOrder: taskOrder,
              initialLoad: !initialBoardOrderLoaded.current,
            }),
          );

          if (!initialBoardOrderLoaded.current) {
            initialBoardOrderLoaded.current = true;
          }

          if (
            initialBacklogOrderLoaded.current &&
            initialBoardOrderLoaded.current &&
            !bothInitialOrdersLoaded.current
          ) {
            onBothOrdersLoaded();
          }
        });

        return () => {
          unsubscribeBacklogOrder();
          unsubscribeBoardOrder();
        };
      }
    });

    return () => {
      dispatch(setInitialLoadInProgress(true));
      unsubscribeTasks();
    };
  }, [dispatch, projectId]);
};
