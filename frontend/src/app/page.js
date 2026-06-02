import { getAuthenticatedUser } from '@/api/user';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  let user = null;

  user = await getAuthenticatedUser()

  if (user && user !== null) {
    redirect('/books');
  } else {
    redirect('/login');
  }
}