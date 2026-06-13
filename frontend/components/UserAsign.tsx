import Button from "@/components/Button";
import { useEffect, useState } from "react";
import Select from "./Select";
import {ApiEditarTarea, ApiGetUsuarios} from "@/utils/api"
import { useUserContext } from "@/utils/userContext";


interface TaskDetailProps {
   id: number;
  title: string;
  description: string;
}

export default function TaskDetail({
  id,
  title,
  description,
}: TaskDetailProps) {

  const { user, token } = useUserContext();

  const [showAssign, setShowAssign] = useState(false);
const [usuarios, setUsuarios] = useState<
  { value: number; label: string }[]
>([])
const [idUsuario, setIdUsuario] = useState<number>(0);


useEffect(() => {
  const cargarUsuarios = async () => {
    const response = await ApiGetUsuarios(token);
    const data = await response.json();

    setUsuarios(
      data.map((usuario: any) => ({
        value: usuario.id,
        label: `${usuario.nombre} ${usuario.apellido}`,
      }))
    );
  };

  cargarUsuarios();
}, []);

const handleGuardar = async () => {
  if (!token) return;

  const response = await ApiEditarTarea(
    id,
    {
      idUsuario,
    },
    token
  );


  
  if (response.ok) {
    alert("Usuario asignado correctamente");
    setShowAssign(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    
    
      <div>
        <Button title="Asignar tarea" type="submit"  onClick={() => setShowAssign(true)}></Button>
      </div>

      {showAssign && (
        <>
  <Select
    title="Asignar usuario"
    options={usuarios}
    value={idUsuario}
    onChange={(value) => setIdUsuario(Number(value))}
  />

  <Button
  title="Guardar"
  type="button"
  onClick={handleGuardar}
/>
</>
      
)}
    </div>
  );

  



}