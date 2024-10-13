import { Transaction, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TaskStatus } from '../redux/tasks/tasksTypes';

const reorderTaskPosition = async ({
  projectId,
  taskStatus,
  newIndex,
  taskId,
  transaction,
}: {
  projectId: string;
  taskStatus: TaskStatus;
  newIndex: number;
  taskId: string;
  transaction: Transaction;
}) => {
  const taskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${taskStatus}`,
  );

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
};

const removeTaskFromOrder = async ({
  projectId,
  taskStatus,
  taskId,
  transaction,
}: {
  projectId: string;
  taskStatus: TaskStatus;
  taskId: string;
  transaction: Transaction;
}) => {
  const taskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${taskStatus}`,
  );

  const taskOrderDoc = await transaction.get(taskOrderRef);

  const taskOrder = taskOrderDoc.exists()
    ? (taskOrderDoc.data().taskOrder as string[])
    : [];

  const oldIndex = taskOrder.indexOf(taskId);
  if (oldIndex > -1) {
    taskOrder.splice(oldIndex, 1);
  }

  transaction.set(taskOrderRef, { taskOrder }, { merge: true });
};

const addTaskToOrder = async ({
  projectId,
  taskStatus,
  taskId,
  transaction,
  newIndex,
}: {
  projectId: string;
  taskStatus: TaskStatus;
  taskId: string;
  transaction: Transaction;
  newIndex: number;
}) => {
  const taskOrderRef = doc(
    db,
    `projects/${projectId}/taskOrders/${taskStatus}`,
  );

  const taskOrderDoc = await transaction.get(taskOrderRef);

  const taskOrder = taskOrderDoc.exists()
    ? (taskOrderDoc.data().taskOrder as string[])
    : [];

  taskOrder.splice(newIndex, 0, taskId);

  transaction.set(taskOrderRef, { taskOrder }, { merge: true });
};

const updateTaskStatus = ({
  projectId,
  taskId,
  newStatus,
  transaction,
}: {
  projectId: string;
  taskId: string;
  newStatus: TaskStatus;
  transaction: Transaction;
}) => {
  const taskRef = doc(db, `projects/${projectId}/tasks/${taskId}`);

  transaction.update(taskRef, {
    status: newStatus,
    updatedAt: new Date().toISOString(),
  });
};

export default {
  reorderTaskPosition,
  removeTaskFromOrder,
  addTaskToOrder,
  updateTaskStatus,
};
