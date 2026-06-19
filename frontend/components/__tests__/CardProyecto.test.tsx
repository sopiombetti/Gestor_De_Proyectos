import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardProyecto from '@/components/CardProyecto';
import { ApiGetReporte, ApiGetTareasProyecto } from '@/utils/api';
import { useUserContext } from '@/utils/userContext';

jest.mock('@/utils/api');
jest.mock('@/utils/userContext');

jest.mock('@/components/ModalEditTarea', () => ({
  __esModule: true,
  default: ({ tarea, onClose, onGuardado }: { tarea: any; onClose: () => void; onGuardado: () => void }) => (
    <div data-testid="modal-editar">
      <span>{tarea.titulo}</span>
      <button onClick={onClose}>Cerrar modal</button>
      <button onClick={onGuardado}>Guardar modal</button>
    </div>
  ),
}));

jest.mock('@/components/ModalEditProyecto', () => ({
  __esModule: true,
  default: ({ proyecto, onClose, onGuardado }: { proyecto: any; onClose: () => void; onGuardado: (p: any) => void }) => (
    <div data-testid="modal-editar-proyecto">
      <span>{proyecto.titulo}</span>
      <button onClick={onClose}>Cerrar modal proyecto</button>
      <button onClick={() => onGuardado({ ...proyecto, titulo: 'Proyecto Editado' })}>
        Guardar modal proyecto
      </button>
    </div>
  ),
}));

const mockApiGetReporte = ApiGetReporte as jest.MockedFunction<typeof ApiGetReporte>;
const mockApiGetTareasProyecto = ApiGetTareasProyecto as jest.MockedFunction<typeof ApiGetTareasProyecto>;
const mockUseUserContext = useUserContext as jest.MockedFunction<typeof useUserContext>;

beforeAll(() => {
  global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/fake-url');
  global.URL.revokeObjectURL = jest.fn();
});

const proyectoMock = {
  id: 1,
  titulo: 'Proyecto Test',
  descripcion: 'Proyecto de prueba',
  fechaCreacion: '2024-03-15T10:00:00Z',
  lider: {
    id: 1,
    nombre: 'Sofia',
    apellido: 'Piombetti',
    email: 'sofia@gmail.com',
    rol_admin: true,
  },
};

const tareasMock = [
  { id: 1, titulo: 'Tarea 1', usuario: { nombre: 'Sofia', apellido: 'Piombetti' } },
  { id: 2, titulo: 'Tarea 2', usuario: null },
];

describe('CardProyecto', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/fake-url');
    global.URL.revokeObjectURL = jest.fn();
    mockUseUserContext.mockReturnValue({
      token: 'fake-token',
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza el título del proyecto', () => {
    render(<CardProyecto proyecto={proyectoMock} />);
    expect(screen.getByText('Proyecto Test')).toBeInTheDocument();
  });

  it('renderiza la descripción del proyecto', () => {
    render(<CardProyecto proyecto={proyectoMock} />);
    expect(screen.getByText('Proyecto de prueba')).toBeInTheDocument();
  });

  it('renderiza la fecha recortada a 10 caracteres', () => {
    render(<CardProyecto proyecto={proyectoMock} />);
    expect(screen.getByText('Creado el: 2024-03-15')).toBeInTheDocument();
  });

  it('renderiza el botón de generar informe', () => {
    render(<CardProyecto proyecto={proyectoMock} />);
    expect(screen.getByRole('button', { name: /generar informe/i })).toBeInTheDocument();
  });

  it('llama a ApiGetReporte con el id del proyecto y el token al hacer click', async () => {
    mockApiGetReporte.mockResolvedValue({ ok: true, blob: async () => new Blob() } as Response);

    render(<CardProyecto proyecto={proyectoMock} />);
    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(mockApiGetReporte).toHaveBeenCalledWith(1, 'fake-token');
    });
  });

  it('crea y clickea un link de descarga cuando la respuesta es ok', async () => {
    const blob = new Blob(['pdf content'], { type: 'application/pdf' });
    mockApiGetReporte.mockResolvedValue({ ok: true, blob: async () => blob } as Response);

    const mockClick = jest.fn();
    const mockAnchor = { href: '', download: '', click: mockClick };

    render(<CardProyecto proyecto={proyectoMock} />);
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);

    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(mockAnchor.href).toBe('blob:http://localhost/fake-url');
      expect(mockAnchor.download).toBe('informe.pdf');
      expect(mockClick).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/fake-url');
    });
  });

  it('loguea el error cuando la respuesta no es ok', async () => {
    mockApiGetReporte.mockResolvedValue({ ok: false } as Response);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CardProyecto proyecto={proyectoMock} />);
    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('loguea el error cuando ApiGetReporte lanza una excepción', async () => {
    mockApiGetReporte.mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CardProyecto proyecto={proyectoMock} />);
    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Mostrar tareas', () => {

    it('llama a ApiGetTareasProyecto con el id y el token al hacer click', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(mockApiGetTareasProyecto).toHaveBeenCalledWith(1, 'fake-token');
      });
    });

    it('renderiza las tareas después de una respuesta exitosa', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();
      });
    });

    it('muestra el nombre del usuario cuando la tarea tiene uno asignado', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Sofia Piombetti')).toBeInTheDocument();
      });
    });

    it('muestra "Sin asignar" cuando la tarea no tiene usuario', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Sin asignar')).toBeInTheDocument();
      });
    });

    it('cambia el texto del botón a "Ocultar tareas" después de mostrarlas', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ocultar tareas/i })).toBeInTheDocument();
      });
    });

    it('oculta las tareas al clickear "Ocultar tareas" sin volver a pedir al backend', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /ocultar tareas/i }));

      expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
      expect(mockApiGetTareasProyecto).toHaveBeenCalledTimes(1);
    });

    it('loguea el error cuando la respuesta no es ok', async () => {
      mockApiGetTareasProyecto.mockResolvedValue({ ok: false } as Response);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
    });

    it('loguea el error cuando ApiGetTareasProyecto lanza una excepción', async () => {
      mockApiGetTareasProyecto.mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
    });

  });

  describe('Modal de edición de tarea', () => {

    beforeEach(() => {
      mockApiGetTareasProyecto.mockResolvedValue({
        ok: true,
        json: async () => tareasMock,
      } as Response);
    });

    it('no muestra el modal inicialmente', () => {
      render(<CardProyecto proyecto={proyectoMock} />);
      expect(screen.queryByTestId('modal-editar')).not.toBeInTheDocument();
    });

    it('abre el modal al clickear editar en una tarea', async () => {
      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      });

      const botonesEditar = screen.getAllByRole('button', { name: /editar tarea/i });
      fireEvent.click(botonesEditar[0]);

      expect(screen.getByTestId('modal-editar')).toBeInTheDocument();
    });

    it('pasa la tarea correcta al modal', async () => {
      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      });

      const botonesEditar = screen.getAllByRole('button', { name: /editar tarea/i });
      fireEvent.click(botonesEditar[0]);

      expect(screen.getByTestId('modal-editar')).toHaveTextContent('Tarea 1');
    });

    it('cierra el modal al llamar onClose', async () => {
      render(<CardProyecto proyecto={proyectoMock} />);
      fireEvent.click(screen.getByRole('button', { name: /mostrar tareas/i }));

      await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      });

      const botonesEditar = screen.getAllByRole('button', { name: /editar tarea/i });
      fireEvent.click(botonesEditar[0]);
      expect(screen.getByTestId('modal-editar')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /cerrar modal/i }));
      expect(screen.queryByTestId('modal-editar')).not.toBeInTheDocument();
    });

  });

  describe('Modal de edición de proyecto', () => {

    it('no muestra el modal de proyecto inicialmente', () => {
      render(<CardProyecto proyecto={proyectoMock} />);
      expect(screen.queryByTestId('modal-editar-proyecto')).not.toBeInTheDocument();
    });

    it('abre el modal de proyecto al clickear el ícono de editar', () => {
      render(<CardProyecto proyecto={proyectoMock} />);

      const iconoEditarProyecto = screen.getByAltText(/editar proyecto/i);
      fireEvent.click(iconoEditarProyecto);

      expect(screen.getByTestId('modal-editar-proyecto')).toBeInTheDocument();
    });

    it('cierra el modal de proyecto al llamar onClose', () => {
      render(<CardProyecto proyecto={proyectoMock} />);

      fireEvent.click(screen.getByAltText(/editar proyecto/i));
      expect(screen.getByTestId('modal-editar-proyecto')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /cerrar modal proyecto/i }));
      expect(screen.queryByTestId('modal-editar-proyecto')).not.toBeInTheDocument();
    });

    it('actualiza el título mostrado cuando se guarda la edición del proyecto', async () => {
      render(<CardProyecto proyecto={proyectoMock} />);

      fireEvent.click(screen.getByAltText(/editar proyecto/i));
      fireEvent.click(screen.getByRole('button', { name: /guardar modal proyecto/i }));

      await waitFor(() => {
        expect(screen.getByText('Proyecto Editado')).toBeInTheDocument();
      });
    });

  });

});