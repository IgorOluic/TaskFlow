import { makeSelectIsLoading } from '../redux/app/appSelectors';
import { useAppSelector } from './useAppSelector';

const useIsLoading = (actionTypes: string | string[]) => {
  const isLoading = useAppSelector(makeSelectIsLoading(actionTypes));
  return isLoading;
};

export default useIsLoading;
