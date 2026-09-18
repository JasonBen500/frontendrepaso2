import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import {
  listarVehiculosActivos,
  agregarVehiculo,
  modificarVehiculo,
  anularVehiculo,
} from "../services/vehiculoService";
import type { Vehiculos } from "../types/vehiculos";

const formInicial: Vehiculos = {
  idVehiculo: null,
  placa: "",
  marca: "",
  modelo: "",
  color: "",
  precioDia: 0,
};

function VehiculoPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculos[]>([]);
  const [form, setForm] = useState<Vehiculos>(formInicial);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarVehiculos = async () => {
    try {
      const respuesta = await listarVehiculosActivos();
      setVehiculos(respuesta.data);
    } catch (error) {
      console.error("Error al listar los vehiculos", error);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "precioDia" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (modoEdicion && form.idVehiculo !== null) {
        await modificarVehiculo(form.idVehiculo, form);
        setMensaje("Vehiculo actualizado correctamente");
      } else {
        await agregarVehiculo(form);
        setMensaje("Vehiculo creado correctamente");
      }
      setForm(formInicial);
      setModoEdicion(false);
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al guardar vehiculo", error);
    }
  };

  const handleModificar = (vehiculos: Vehiculos) => {
    setForm(vehiculos);
    setModoEdicion(true);
  };

  const handleAnular = async (idVehiculo: number) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas anular este vehiculo?",
    );
    if (!confirmar) return;
    try {
      await anularVehiculo(idVehiculo);
      setMensaje("Vehiculo anulado correctamente");
      cargarVehiculos();
    } catch (error) {
      setMensaje(obtenerMensajeError(error));
      console.error("Error al anular el vehiculo", error);
    }
  };

  const obtenerMensajeError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.mensaje ?? error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Ocurrió un error inesperado";
  };

  return (
    <div>
      <h2>Ingresar/Modificar Vehiculo</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="placa">Placa:</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={form.placa}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={form.modelo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="color">Color:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="precioDia">PrecioDia:</label>
          <input
            type="number"
            id="precioDia"
            name="precioDia"
            value={form.precioDia}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
      <h2>Listado de Vehiculos</h2>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Color</th>
            <th>PrecioDia</th>
            <th>Modificar</th>
            <th>Anular</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.idVehiculo}>
              <td>{vehiculo.placa}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.color}</td>
              <td>{vehiculo.precioDia}</td>
              <td>
                <button onClick={() => handleModificar(vehiculo)}>
                  Modificar
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    vehiculo.idVehiculo !== null &&
                    handleAnular(vehiculo.idVehiculo)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default VehiculoPage;
