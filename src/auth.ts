import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InactiveAccountError, InvalidEmailPasswordError } from "./utils/errors";
import { sendRequest } from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          body: {
            ...credentials
          }
        });

        // Call Backend to hash password and verify if the user exist

        if (response.statusCode === 201) {
          // return user object with their profile data
          // console.log({
          //   _id: response.data?.user._id,
          //   name: response.data?.user.name,
          //   email: response.data?.user.email,
          //   access_token: response.data?.acess_token,
          // })
          return {
            _id: response.data?.user._id,
            name: response.data?.user.name,
            email: response.data?.user.email,
            access_token: response.data?.access_token,
          };
        } else if (+response.statusCode === 401) { // Sai mật khẩu 401
          throw new InvalidEmailPasswordError();
        } else if (+response.statusCode === 400) { // Tài khoản chưa kích hoạt
          throw new InactiveAccountError();
        } else {
          throw new Error("Internal Sever Error");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login"
  },
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.user = (user as IUser);
      }
      return token
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session
    },
    authorized: async ({auth}) => {
      // Logged in users are authenticated
      // otherwise redirect to login page
      return !!auth;
    },
  },
})