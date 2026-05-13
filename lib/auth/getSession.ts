import { fetchAuthSession } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/amplify_outputs.json';

const { runWithAmplifyServerContext } = createServerRunner({ config: outputs });

export async function getSession() {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens ? session : null;
      } catch {
        return null;
      }
    },
  });
}
