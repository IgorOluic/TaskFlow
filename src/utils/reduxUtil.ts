export const isPendingAction = (action: { type: string }): boolean => {
  return action.type.endsWith('pending');
};

export const isFulfilledAction = (action: { type: string }): boolean => {
  return action.type.endsWith('fulfilled');
};

export const isRejectedAction = (action: { type: string }): boolean => {
  return action.type.endsWith('rejected');
};

export const getBaseActionType = (actionType: string): string =>
  actionType.substring(0, actionType.lastIndexOf('/'));
