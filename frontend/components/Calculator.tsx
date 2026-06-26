import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface CalculatorProps {
  devolverResultado: (estimacion: number) => void;
}

export default function Calculator({
 devolverResultado,
}: CalculatorProps) {

  const [optimista, setOptimista] = useState(0);
  const [probable, setProbable] = useState(0);
  const [pesimista, setPesimista] = useState(0);

  const [resultado, setResultado] = useState<number | null>(null);

  const calcularPERT = () => {
    const estimacion =
      (optimista + 4 * probable + pesimista) / 6;

    setResultado(estimacion);
    const redondeo = Math.round(estimacion);
    console.log(redondeo);
    devolverResultado(redondeo);
  };

  return (
    <div className="mt-6 border border-secondary p-3 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Calcular estimación de horas (PERT):
      </h2>

      <Input
        title="Optimista"
        type="number"
        value={optimista}
        onChange={(e) => setOptimista(Number(e.target.value))}
      />

      <Input
        title="Más probable"
        type="number"
        value={probable}
        onChange={(e) => setProbable(Number(e.target.value))}
      />

      <Input
        title="Pesimista"
        type="number"
        value={pesimista}
        onChange={(e) => setPesimista(Number(e.target.value))}
      />

      <div className="mt-4">
        <Button
          title="Calcular"
          type="button"
          onClick={calcularPERT}
        />
      </div>

      {resultado !== null && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="font-semibold">
            Estimación PERT: {resultado.toFixed(2)} horas
          </p>
        </div>
      )}

    </div>
  );
}