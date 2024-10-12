import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { ITask, ITasksData, TaskIdsByColumn } from '../redux/tasks/tasksTypes';

interface ProcessedFirestoreData<T> {
  ids: string[];
  data: Record<string, T>;
}

/**
 * Takes an array of Firestore document snapshots and returns an object containing:
 * - An array of document IDs
 * - A record where the keys are document IDs and the values are the corresponding document data
 *
 * @template T - The type of the document data.
 * @param {QueryDocumentSnapshot<T>[]} documents - The Firestore document snapshots to process.
 * @returns {ProcessedFirestoreData<T>} An object containing an array of document IDs and a map of document data keyed by their IDs.
 */

export const groupFirestoreDocsById = <T>(
  documents: QueryDocumentSnapshot<T>[],
): ProcessedFirestoreData<T> => {
  const ids: string[] = [];
  const data: Record<string, T> = {};

  documents.forEach((doc) => {
    ids.push(doc.id);
    data[doc.id] = { ...doc.data(), id: doc.id };
  });

  return { ids, data };
};

export const timestampToISOString = (timestamp: Timestamp) => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }

  return null;
};

export const parseTasksData = (
  documents: QueryDocumentSnapshot<ITask>[],
  sortedTaskIds: string[],
): { data: ITasksData; idsByColumn: TaskIdsByColumn } => {
  const data: Record<string, ITask> = {};
  const idsByColumn: Record<string, string[]> = {};

  const docMap: Map<string, QueryDocumentSnapshot<ITask>> = new Map();
  documents.forEach((doc) => {
    docMap.set(doc.id, doc);
  });

  sortedTaskIds.forEach((taskId) => {
    const doc = docMap.get(taskId);
    if (doc) {
      const taskData = { ...doc.data(), id: taskId };

      data[taskId] = taskData;

      const { columnId } = taskData;

      if (!idsByColumn[columnId]) {
        idsByColumn[columnId] = [];
      }

      idsByColumn[columnId].push(taskId);
    }
  });

  return { data, idsByColumn };
};
