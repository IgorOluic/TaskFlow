import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TaskStatus } from '../redux/tasks/tasksTypes';

const reorderTaskPosition = async ({
  projectId,
  taskStatus,
  newIndex,
  taskId,
}: {
  projectId: string;
  taskStatus: TaskStatus;
  newIndex: number;
  taskId: string;
}) => {
  const taskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${taskStatus}`,
  );

  await runTransaction(db, async (transaction) => {
    const taskOrderDoc = await transaction.get(taskOrderRef);

    if (!taskOrderDoc.exists()) {
      throw new Error('Task order document does not exist');
    }

    const taskOrder = taskOrderDoc.data().taskOrder as string[];

    const currentIndex = taskOrder.indexOf(taskId);

    if (currentIndex === -1) {
      throw new Error('Task ID not found in task order');
    }

    taskOrder.splice(currentIndex, 1);
    taskOrder.splice(newIndex, 0, taskId);

    transaction.update(taskOrderRef, { taskOrder });
  });
};

const updateTaskStatusAndPosition = async ({
  projectId,
  newStatus,
  oldStatus,
  taskId,
  newIndex,
}: {
  projectId: string;
  newStatus: TaskStatus;
  oldStatus: TaskStatus;
  taskId: string;
  newIndex: number;
}) => {
  const newTaskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${newStatus}`,
  );

  const oldTaskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${oldStatus}`,
  );

  const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

  await runTransaction(db, async (transaction) => {
    // Recalculate new status task ids
    const newTaskOrderDoc = await transaction.get(newTaskOrderRef);
    const newTaskOrder = newTaskOrderDoc.exists()
      ? (newTaskOrderDoc.data().taskOrder as string[])
      : [];
    newTaskOrder.splice(newIndex, 0, taskId);

    // Recalculate old status task ids
    const oldTaskOrderDoc = await transaction.get(oldTaskOrderRef);
    const oldTaskOrder = oldTaskOrderDoc.exists()
      ? (oldTaskOrderDoc.data().taskOrder as string[])
      : [];
    const oldIndex = oldTaskOrder.indexOf(taskId);
    if (oldIndex > -1) {
      oldTaskOrder.splice(oldIndex, 1);
    }

    transaction.set(
      newTaskOrderRef,
      { taskOrder: newTaskOrder },
      { merge: true },
    );
    transaction.set(
      oldTaskOrderRef,
      { taskOrder: oldTaskOrder },
      { merge: true },
    );
    transaction.update(taskRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  });
};

const updateTaskColumn = async ({
  taskId,
  projectId,
  columnId,
}: {
  taskId: string;
  projectId: string;
  columnId: string;
}) => {
  const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

  await updateDoc(taskRef, {
    columnId: columnId,
  });
};

const updateTaskColumnAndPosition = async ({
  projectId,
  taskStatus,
  newIndex,
  taskId,
  columnId,
}: {
  projectId: string;
  taskStatus: TaskStatus;
  newIndex: number;
  taskId: string;
  columnId: string;
}) => {
  const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);
  const taskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${taskStatus}`,
  );

  await runTransaction(db, async (transaction) => {
    const taskOrderDoc = await transaction.get(taskOrderRef);

    if (!taskOrderDoc.exists()) {
      throw new Error('Task order document does not exist');
    }

    const taskOrder = taskOrderDoc.data().taskOrder as string[];

    const currentIndex = taskOrder.indexOf(taskId);

    if (currentIndex === -1) {
      throw new Error('Task ID not found in task order');
    }

    taskOrder.splice(currentIndex, 1);
    taskOrder.splice(newIndex, 0, taskId);

    transaction.update(taskOrderRef, { taskOrder });
    transaction.update(taskRef, {
      columnId: columnId,
    });
  });
};

export default {
  reorderTaskPosition,
  updateTaskStatusAndPosition,
  updateTaskColumn,
  updateTaskColumnAndPosition,
};
