interface Props {
  nombre: string;
  cantidad: number;
}

export default function BoxTareas({nombre, cantidad}: Props){

    return(
        <div className="flex flex-col justify-between rounded-lg shadow-2xl h-30 w-30 md:h-30 md:w-40 p-5 border border-secondary">
            <h3 className="font-bold">{nombre}</h3>
            <div className="flex justify-between">
            <h3 className="font-bold text-xl md:text-3xl">{cantidad}</h3>
            <img src="/check.svg" alt="check"/>
            </div>
        </div>
    )
}