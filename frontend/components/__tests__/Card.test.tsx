import { render, screen, fireEvent } from "@testing-library/react";
import Card from "../Card";

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const { useRouter } = require('next/router');

const mockPush = jest.fn();

const tareaMock = {
  id: 1,
  titulo: 'Tarea Test',
  descripcion: 'Tarea de prueba',
  prioridad: { id: 1, nombre: 'Baja' },
  estado: { id: 2, nombre: 'Asignada' },
  proyectoid: 1
};

describe('Card', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

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

  it('navega a la página de detalle al clickear el título', () => {
    render(<Card tarea={tareaMock} />);
    fireEvent.click(screen.getByText('Tarea Test'));
    expect(mockPush).toHaveBeenCalledWith('/task-detail?id=1');
  });

  describe('Estilos de prioridad', () => {

    it('aplica estilos de prioridad alta', () => {
      render(<Card tarea={{ ...tareaMock, prioridad: { id: 3, nombre: 'Alta' } }} />);
      expect(screen.getByText('Alta')).toHaveClass('text-red-700', 'bg-red-300');
    });

    it('aplica estilos de prioridad media', () => {
      render(<Card tarea={{ ...tareaMock, prioridad: { id: 2, nombre: 'Media' } }} />);
      expect(screen.getByText('Media')).toHaveClass('text-orange-800', 'bg-orange-200');
    });

    it('aplica estilos de prioridad baja', () => {
      render(<Card tarea={tareaMock} />);
      expect(screen.getByText('Baja')).toHaveClass('text-yellow-800', 'bg-yellow-200');
    });

  });

});