import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import clientPromise from '../../../lib/mongodb';
// import AppleProvider from 'next-auth/providers/apple';
// import FacebookProvider from 'next-auth/providers/facebook';
// import GoogleProvider from 'next-auth/providers/google';
// import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  // Required for production
  secret: process.env.NEXTAUTH_SECRET || undefined,
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: 'auto',
    brandColor: '#f00',
    logo: '',
  },

  // Configure one or more authentication providers
  providers: [
    // AppleProvider({}),
    // GoogleProvider({}),
    // FacebookProvider({}),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    //   version: "2.0", // opt-in to Twitter OAuth 2.0
    // })
    GithubProvider({
      clientId: process.env.NEXTAUTH_GH_ID,
      clientSecret: process.env.NEXTAUTH_GH_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      console.log(user, account, profile, email, credentials);

      if (isAllowedToSignIn) {
        return true;
      }
      // Return false to display a default error message
      return false;
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    },
    // redirect({ url, baseUrl }) {
    //   if (url.startsWith(baseUrl)) return url;
    //   // Allows relative callback URLs
    //   if (url.startsWith('/')) return new URL(url, baseUrl).toString();
    //   return baseUrl;
    // },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      return {
        token,
        userId: user.id,
        userData: { emailVerified: user.emailVerified },
        ...session,
      };
    },
  },
});
