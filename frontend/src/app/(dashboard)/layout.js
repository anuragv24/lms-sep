import { getAuthenticatedUser } from '@/api/user';
import DashboardWrapper from '@/components/DashboardWrapper';

export default async function DashboardLayout({ children }) {
  let currentUser ;

  try {
    currentUser = await getAuthenticatedUser()
  } catch (error) {
    console.error("RBAC_LAYOUT_SESSION_RESOLVE_ERROR:", error.message);
  }

  return (
    <DashboardWrapper currentUser={currentUser}>
      {children}
    </DashboardWrapper>
  );
}