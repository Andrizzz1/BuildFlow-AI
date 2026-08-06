// AuthContext.tsx
import { createContext, useContext, useState} from "react";
import type {ReactNode} from "react"
type Role = string

const AuthContext = createContext<{
  role: Role | null;
  setRole: (r: Role) => void;
}>({ role: null, setRole: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem("role") as Role) || null
  );

  const updateRole = (r: Role) => {
    localStorage.setItem("role", r);
    setRole(r);
  };

  return (
    <AuthContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);