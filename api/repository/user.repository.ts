import { prisma } from "../lib/prisma";

export type CreateUserInput = {
    email: string;
    passwordHash: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
};

export const findUserByEmail = (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const findUserByUsername = (username: string) => {
    return prisma.user.findUnique({ where: { username } });
};

export const createUser = (input: CreateUserInput) => {
    return prisma.user.create({ data: input });
};

export const findUserByResetToken = (token: string) => {
    return prisma.user.findFirst({ where: { resetToken: token } });
};

export const updateUserResetToken = (userId: string, token: string | null, expires: Date | null) => {
    return prisma.user.update({
        where: { id: userId },
        data: { resetToken: token, resetTokenExpires: expires }
    });
};


export const updateUserPassword = (userId: string, passwordHash: string) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            passwordHash,
            resetToken: null,
            resetTokenExpires: null
        }
    });
};
