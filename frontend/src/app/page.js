import { getAuthenticatedUser } from '@/api/user';
import { redirect } from 'next/navigation';

export default async function RootPage() {
    redirect('/books');
}