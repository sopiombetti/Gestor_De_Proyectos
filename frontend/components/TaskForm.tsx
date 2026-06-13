import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Calculator from "./Calculator";

export default function TaskForm() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [usuario, setUsuario] = useState("");
  const [estimacion, setEstimacion] = useState(0);

  return (
    <div className="py-8 px-8">

      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">
          Crear tarea
        </h1>

        <h2 className="text-sm ">
          Empezá a organizar tus proyectos y tareas
        </h2>
      </div>

      <Input
        title="Título de la tarea"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <Input
        title="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <Input
        title="Proyecto"
        type="text"
        value={proyecto}
        onChange={(e) => setProyecto(e.target.value)}
      />

      <Select
        title="Prioridad"
        options={[
          { value: "", label: "Seleccione prioridad" },
          { value: 1, label: "Baja" },
          { value: 2, label: "Media" },
          { value: 3, label: "Alta" },
        ]}
        value={prioridad}
        onChange={(value) => setPrioridad(String(value))}
      />

      <Input
        title="Fecha límite"
        type="date"
        value={fechaLimite}
        onChange={(e) => setFechaLimite(e.target.value)}
      />

      <Select
        title="Asignado a"
        options={[
          
        ]}
        value={usuario}
        onChange={(value) => setUsuario(String(value))}
      />

    

      <Button
        title="Crear tarea"
        type="submit"
      />

    </div>
  );
}