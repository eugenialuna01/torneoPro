import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../api/torneoApi";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.log("Error al cargar usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (id, data) => {
    await updateUser(id, data);
    await loadUsers();
  };

  const removeUser = async (id) => {
    await deleteUser(id);
    await loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        loadUsers,
        editUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () =>  useContext(UserContext)
