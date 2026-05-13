import { getSession } from './getSession';

export type CognitoGroup = 'Admin' | 'DataRoom';

export async function getUserGroups(): Promise<CognitoGroup[]> {
  const session = await getSession();
  if (!session) return [];
  const groups =
    (session.tokens?.accessToken.payload['cognito:groups'] as string[] | undefined) ?? [];
  return groups.filter((g): g is CognitoGroup => g === 'Admin' || g === 'DataRoom');
}

export async function isInGroup(group: CognitoGroup): Promise<boolean> {
  const groups = await getUserGroups();
  return groups.includes(group);
}
