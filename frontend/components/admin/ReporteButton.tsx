import { ApiGetReporte } from "@/utils/api";
import { useUserContext } from "@/utils/userContext";

type ReporteProps = {
    proyectoId: number;
    setError: React.Dispatch<React.SetStateAction<string>>;
};

export default function ReporteButton({ proyectoId, setError }: ReporteProps) {
    
    const { token } = useUserContext();

    const handleDownload = async () => {
        try {
            const response = await ApiGetReporte(proyectoId, token);

            if (!response.ok) {
                setError("No se puede obtener el reporte.")
                throw new Error("No se puede obtener el reporte");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `informe.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <button onClick={handleDownload} className="flex items-center mt-6 justify-center w-[200px] rounded-full bg-primary p-3 space-x-2 py-1.5 font-semibold leading-6 text-gray-900 shadow-sm cursor-pointer hover:bg-violet-400">
            <img src="/report.svg" className="h-5" />
            <p>Generar Informe</p>
        </button>
    )
}