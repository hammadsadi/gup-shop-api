export const generateUsername = (fullName: string) => {
  const baseUsername = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);
  return baseUsername;
};
