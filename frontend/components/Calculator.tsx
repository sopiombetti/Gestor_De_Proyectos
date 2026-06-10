import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

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

   
    devolverResultado(estimacion);
  };

  return (
    <div className="mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Calcular estimación de horas (PERT)
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

      <div className="mt-6">
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