import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

import { can } from "../utils/permissions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

const MySwal =withReactContent(Swal);

const Users = () => {

  const { user } = useAuth();

  const {
    users,
    loading,
    editUser,
    removeUser,
  } = useUsers();

  const [editingId, setEditingId] =
    useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "",
    },
  });

  const handleEdit = (
    selectedUser
  ) => {

    setEditingId(
      selectedUser._id
    );

    setValue(
      "username",
      selectedUser.username || ""
    );

    setValue(
      "email",
      selectedUser.email || ""
    );

    setValue(
      "role",
      selectedUser.role?._id ||
        selectedUser.role ||
        ""
    );

  };

  const submitHandler = async (
    data
  ) => {

    await editUser(
      editingId,
      data
    );
      toast.success(
       "Usuario editado correctamente"
     );
    reset({
      username: "",
      email: "",
      role: "",
    });

    setEditingId(null);

  };

  const handleDelete = async (
    id
  ) => {

   const result = await MySwal.fire({
  title: "¿Esta seguro de querer eliminar este usuario?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#dc2626",
  cancelButtonColor: "#475569",
  confirmButtonText: "Sí, eliminar",
  cancelButtonText: "Cancelar",
  background: "#0f172a",
  color: "#ffffff",
  iconColor: "#f59e0b",
  customClass: {
    popup: "rounded-2xl shadow-2xl",
    title: "text-2xl font-bold",
    htmlContainer: "text-slate-300",
    confirmButton:
      "px-5 py-2 rounded-xl font-semibold",
    cancelButton:
      "px-5 py-2 rounded-xl font-semibold",
  },
});

if (!result.isConfirmed) return;

    await removeUser(id);
      toast.success(
       "Usuario eliminado correctamente"
     );
  };

  if (
    !can(user, "user:read")
  ) {

    return (
      <section className="p-6">

        <p className="text-red-600 font-semibold">
          No tienes permiso para ver usuarios.
        </p>

      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-linear-to-r from-slate-950 via-slate-900 to-red-900 rounded-3xl shadow-xl p-8 text-white">

          <p className="text-sm font-bold uppercase text-red-300 mb-3">
            Administración
          </p>

          <h1 className="text-4xl font-black">
            Usuarios
          </h1>

          <p className="text-slate-300 mt-3">
            Gestioná usuarios, roles y permisos del sistema.
          </p>

        </div>

        {/* FORM EDIT */}
        {editingId &&
          can(
            user,
            "user:update"
          ) && (

            <form
              onSubmit={handleSubmit(
                submitHandler
              )}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >

              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Editar usuario
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* USERNAME */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Usuario
                  </label>

                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    {
                      ...register(
                        "username",
                        {
                          required:
                            "El usuario es obligatorio",
                        }
                      )
                    }
                  />

                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.username
                          .message
                      }
                    </p>
                  )}

                </div>

                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    {
                      ...register(
                        "email",
                        {
                          required:
                            "El email es obligatorio",
                        }
                      )
                    }
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.email
                          .message
                      }
                    </p>
                  )}

                </div>

                {/* ROLE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Rol
                  </label>

                  <select
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    {
                      ...register(
                        "role",
                        {
                          required:
                            "Debes seleccionar un rol",
                        }
                      )
                    }
                  >

                    <option value="">
                      Seleccionar rol
                    </option>

                    <option value="6a15f3e4e38ac597447ac117">
                      Usuario
                    </option>

                    <option value="6a15f3e5e38ac597447ac118">
                      Entrenador
                    </option>

                    <option value="6a15f3e5e38ac597447ac119">
                      Administrador
                    </option>

                  </select>

                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        errors.role
                          .message
                      }
                    </p>
                  )}

                </div>

              </div>

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                {can(
                  user,
                  "user:update"
                ) && (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                  >
                    Guardar cambios
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setEditingId(null)
                  }
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl transition"
                >
                  Cancelar
                </button>

              </div>

            </form>

          )}

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-xl font-bold text-slate-800">
              Usuarios registrados
            </h2>

          </div>

          {loading ? (

            <p className="p-6 text-slate-500">
              Cargando usuarios...
            </p>

          ) : users.length === 0 ? (

            <p className="p-6 text-slate-500">
              No hay usuarios registrados.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50 text-slate-600 uppercase text-sm">

                  <tr>

                    <th className="px-6 py-4">
                      Usuario
                    </th>

                    <th className="px-6 py-4">
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Rol
                    </th>

                    <th className="px-6 py-4 text-right">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-200">

                  {users.map(
                    (selectedUser) => (

                      <tr
                        key={
                          selectedUser._id
                        }
                        className="hover:bg-slate-50"
                      >

                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {
                            selectedUser.username
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {
                            selectedUser.email
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600">

                          {selectedUser.role
                            ?.name ||
                            "Sin rol"}

                        </td>

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            {can(
                              user,
                              "user:update"
                            ) && (
                              <button
                                onClick={() =>
                                  handleEdit(
                                    selectedUser
                                  )
                                }
                                className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-semibold transition"
                              >
                                Editar
                              </button>
                            )}

                            {can(
                              user,
                              "user:delete"
                            ) && (
                              <button
                                onClick={() =>
                                  handleDelete(
                                    selectedUser._id
                                  )
                                }
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold transition"
                              >
                                Eliminar
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </section>
  );
};

export default Users;