import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/databse";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        // so it wont select the last google account that is used
        params: {
          prompt: "consent",
          acceess_type: "offline",
          responese_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //invoked on succeful sign in
    async signIn({ profile }) {
      //1. connect to the database
      await connectDB();
      //2. check if user exists
      // find email, and get that with profile.email
      const userExists = await User.findOne({ email: profile.email });
      //3. if not, create user
      if (!userExists) {
        // truncate username if too long
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      //4. return true to allow sign in
      return true;
    },
    //Session callback function that modifies the session object
    async session({ session }) {
      // 1.get the user from database
      // find email, and get that with session.user.email
      const user = await User.findOne({ email: session.user.email });
      // 2. assign user id from the session
      session.user.id = user._id.toString();
      // 3. return session
      return session;
    },
  },
};
