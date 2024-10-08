import { useEffect } from 'react';
import { onSnapshot, collection, getDoc, doc } from 'firebase/firestore';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { updateProjectMembers } from '../redux/members/membersSlice';
import { IMember } from '../redux/members/membersTypes';
import { IUserData } from '../redux/auth/authTypes';
import { timestampToISOString } from '../utils/dataUtils';
import { db } from '../firebase/firebaseConfig';
import { selectSelectedProjectId } from '../redux/projects/projectsSelectors';

export const useTrackProjectMembers = () => {
  const dispatch = useAppDispatch();
  const selectedProjectId = useAppSelector(selectSelectedProjectId);

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    const membersRef = collection(db, `projects/${selectedProjectId}/members`);

    const unsubscribe = onSnapshot(
      membersRef,
      async (querySnapshot) => {
        const result = await querySnapshot.docs.reduce(
          async (accPromise, docSnapshot) => {
            const acc = await accPromise;

            const memberData = docSnapshot.data();
            const userId = memberData.userId;

            const userDoc = await getDoc(doc(db, `users`, userId));

            let userData = null;
            if (userDoc.exists()) {
              userData = userDoc.data();
            }

            const combinedData = {
              ...(memberData as IMember),
              ...(userData as IUserData),
              addedAt: timestampToISOString(memberData.addedAt),
              createdAt: timestampToISOString(userData?.createdAt),
            };

            acc.ids.push(userId);
            acc.data[userId] = combinedData;

            return acc;
          },
          Promise.resolve({
            ids: [] as string[],
            data: {} as Record<string, IMember & IUserData>,
          }),
        );

        dispatch(updateProjectMembers(result));
      },
      (error) => {
        console.error('Error listening to members:', error);
      },
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedProjectId, dispatch]);
};
