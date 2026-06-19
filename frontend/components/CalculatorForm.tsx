import Button from "./Button";
import Input from "./Input";


export default function CalculatorForm() {
    return (
        <>
            <div>
                <h2 className="mb-4 mt-6">Calcular estimación de horas </h2>
                <Input
                    title="Optimista (El menor tiempo posible si todo sale perfecto)"
                    type="number"
                />

                <Input
                    title="Más probable (El tiempo realista considerando imprevistos menores)"
                    type="number" />

                <Input
                    title="Pesimista (El tiempo máximo si ocurren complicaciones graves o bloqueos)"
                    type="number" />

                <div className="mb-8">
                    <Button
                        title="Calcular" type="submit" ></Button>
                </div>

            </div>
        </>
    )
}