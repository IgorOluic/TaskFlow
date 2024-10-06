import { VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { TOP_BAR_HEIGHT } from '../../constants/layout';
import TopBar from './TopBar';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchInvitations } from '../../redux/invitations/invitationsSlice';

export const TopBarLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchInvitations());
  }, []);

  return (
    <VStack
      display="flex"
      minH="100vh"
      alignItems="flex-start"
      flex={1}
      spacing={0}
    >
      <TopBar />

      <VStack
        flex={1}
        w="full"
        alignItems="flex-start"
        maxW="100vw"
        marginTop={`${TOP_BAR_HEIGHT}px`}
        position="relative"
        minH={`calc(100vh - ${TOP_BAR_HEIGHT}px)`}
      >
        <Outlet />
      </VStack>
    </VStack>
  );
};

export default TopBarLayout;
