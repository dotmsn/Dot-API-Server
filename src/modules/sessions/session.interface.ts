import { User } from "../users/users.model";

export default interface Session {
    accessToken: string;
    user: User;
}
