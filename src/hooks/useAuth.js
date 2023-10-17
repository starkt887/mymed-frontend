import { useSelector } from "react-redux";

function useAuth() {
  const { user } = useSelector((state) => state.user);
  return user?.isLoggedIn;
}

export default useAuth;
