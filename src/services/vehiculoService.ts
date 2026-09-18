import api from "../api/axios";
import type { Vehiculos } from "../types/vehiculos";

export const listarVehiculosActivos = () =>
  api.get<Vehiculos[]>("/vehiculos/activos");

export const agregarVehiculo = (data: Omit<Vehiculos, "idVehiculo">) =>
  api.post<Vehiculos>("/vehiculos", data);

export const modificarVehiculo = (
  id: number,
  data: Omit<Vehiculos, "idVehiculo">,
) => api.put<Vehiculos>(`/vehiculos/modificar/${id}`, data);

export const anularVehiculo = (id: number) =>
  api.put<Vehiculos>(`/vehiculos/anular/${id}`);
