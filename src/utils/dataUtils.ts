import { QueryDocumentSnapshot } from 'firebase/firestore';

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
