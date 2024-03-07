export const isPostLiked = (
  votes: Array<{ userid: number; isupvote: boolean }>,
  currUserId: number
): boolean => {
  const isLiked = votes.find((vote) => {
    return vote.userid === currUserId && vote.isupvote === true;
  });
  if (isLiked) return true;
  return false;
};
