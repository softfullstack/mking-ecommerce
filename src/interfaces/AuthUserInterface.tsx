interface User {
    id: number;
    name: string;
    email: string;
  }
  
  interface AuthStore {
    login: (user: User) => void;
  }
  
  import useAuthStore from "../store/AuthStore"
  const { login } = useAuthStore() as AuthStore;