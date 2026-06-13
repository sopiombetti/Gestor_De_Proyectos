import { render, screen } from "@testing-library/react";
import Card from "../Card";

const tareaMock = {
  id: 1,
  titulo: 'Tarea Test',
  descripcion: 'Tarea de prueba',
  prioridad: {
    id: 1,
    nombre: 'Baja'
  },
  estado: {
    id: 2,
    nombre: 'Asignada'
  },
  proyectoid: 1
};

describe('Card', () => {
    it('renderiza el título de la tarea', () => {
        render(<Card tarea={tareaMock} />);
        expect(screen.getByText('Tarea Test')).toBeInTheDocument();
      });
    
      it('renderiza la prioridad de la tarea', () => {
        render(<Card tarea={tareaMock} />);
        expect(screen.getByText('Baja')).toBeInTheDocument();
      });

      it('renderiza el estado de la tarea', () => {
        render(<Card tarea={tareaMock} />);
        expect(screen.getByText('Asignada')).toBeInTheDocument();
      });
})