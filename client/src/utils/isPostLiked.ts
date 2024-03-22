export const isPostLiked = (
  votes: Array<number>,
  currUserId: number
): boolean => {
  if (!votes || !votes.length) return false;
  const isLiked = votes.find((vote) => {
    return vote === currUserId;
  });
  if (isLiked) return true;
  return false;
};
