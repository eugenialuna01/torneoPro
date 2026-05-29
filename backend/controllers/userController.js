import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    )
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};