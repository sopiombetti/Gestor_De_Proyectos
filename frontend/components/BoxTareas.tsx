interface Props {
  nombre: string;
  cantidad: number;
}

export default function BoxTareas({nombre, cantidad}: Props){

    return(
        <div className="flex flex-col justify-between rounded-lg shadow-lg h-28 w-28 sm:h-30 sm:w-36 md:h-30 md:w-40 p-4 sm:p-5 border border-secondary bg-white dark:bg-gray-800 dark:border-blue-400">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
            {nombre}
        </h3>
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl md:text-3xl text-gray-900 dark:text-white">
                {cantidad}
            </h3>
            <img src="/check.svg" alt="check" className="w-7 h-7 sm:w-8 sm:h-8 dark:invert" />
        </div>
    </div>
    )
}