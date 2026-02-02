import { useProfileContext } from '@/context/profileContext';

export function useUserRole() {
  // This assumes user role is stored in profile context as state.user.role
  // Adjust selector as needed to match actual context structure
  const { state } = useProfileContext();
  const role = state?.user?.role || 'OWNER'; // fallback OWNER for dev
  return { role };
}
