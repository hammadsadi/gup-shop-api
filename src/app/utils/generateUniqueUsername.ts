import { generateUsername } from "./generateUsername";
import prisma from "./prisma";

export const generateUniqueUsername = async (fullName: string) => {
  let baseUsername = generateUsername(fullName);
  let username = baseUsername;
  let count = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) break;

    // If the username already exists, append a number to make it unique
    username = `${baseUsername}${count}`;
    count++;
  }

  return username;
};
