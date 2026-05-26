import Input from "@/components/Input";
import Button from "@/components/Button";
import Select from "@/components/Select";
import CalculatorForm from "./CalculatorForm";


export default function TaskForm(){
    return(
        <>

        <div className="py-8 px-8">

                <div className="flex flex-col items-center text-center mb-6 pl-22">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Crea tareas para tu proyecto
            </h1>
            <h2 className="text-sm text-gray-500 max-w-xs">
                Empezá a organizar tus proyectos y tareas de forma simple
            </h2>
            </div>
                <Input
        title="Título de la tarea"
        />
            <Input
        title="Descripción"
        />
            <Input
        title="Proyecto"
        />
            <Select
        title="Prioridad"
        options={["Seleccione prioridad", "Baja", "Media", "Alta"]}
        />
            <Input
        title="Fecha límite"
        type="date"
        />
            <Select
        title="Asignado a"
        options={["Seleccione usuario"]}
        />
<div>
    <CalculatorForm></CalculatorForm>
</div>

        <Button
        title="Crear tarea"
        type="submit"
        />

        </div>


        </>
    )
}