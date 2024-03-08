export const isPostLiked = (
  votes: Array<number>,
  currUserId: number
): boolean => {
  const isLiked = votes.find((vote) => {
    return vote === currUserId;
  });
  if (isLiked) return true;
  return false;
};
