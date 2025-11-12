import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
    try {
        const isAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

        if (isAdminExist) {
            return;
        }

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "admin",
            role: Role.ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]

        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const admin = await User.create(payload)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}