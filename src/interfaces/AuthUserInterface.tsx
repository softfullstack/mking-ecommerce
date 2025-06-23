interface User {
    id: number;
    name: string;
    email: string;
  }
  
  interface AuthStore {
    login: (user: User) => void;
  }