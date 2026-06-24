import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardProyecto from '@/components/admin/CardProyecto';
import { ApiGetTareasProyecto } from '@/utils/api';
import { useUserContext } from '@/utils/userContext';

jest.mock('@/utils/api');
jest.mock('@/utils/userContext');

jest.mock('@/components/admin/ReporteButton', () => ({
  __esModule: true,
  default: ({ proyectoId }: any) => (
    <button>
      Generar informe {proyectoId}
    </button>
  ),
}));

jest.mock('@/components/admin/ModalEditTarea', () => ({
  __esModule: true,
  default: ({ tarea, onClose }: any) => (
    <div data-testid="modal-editar">
      <span>{tarea.titulo}</span>
      <button onClick={onClose}>Cerrar modal</button>
    </div>
  ),
}));

jest.mock('@/components/admin/ModalEditProyecto', () => ({
  __esModule: true,
  default: ({ proyecto, onClose, onGuardado }: any) => (
    <div data-testid="modal-editar-proyecto">
      <span>{proyecto.titulo}</span>
      <button onClick={onClose}>Cerrar modal proyecto</button>
      <button onClick={() => onGuardado({ ...proyecto, titulo: 'Proyecto Editado' })}>
        Guardar modal proyecto
      </button>
    </div>
  ),
}));

const mockApiGetTareasProyecto = ApiGetTareasProyecto as jest.MockedFunction<typeof ApiGetTareasProyecto>;
const mockUseUserContext = useUserContext as jest.MockedFunction<typeof useUserContext>;

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

    mockUseUserContext.mockReturnValue({
      token: 'fake-token',
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it('renderiza el proyecto', () => {
    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);
    expect(screen.getByText('Proyecto Test')).toBeInTheDocument();
    expect(screen.getByText('Proyecto de prueba')).toBeInTheDocument();
  });

  it('renderiza la fecha', () => {
    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);
    expect(screen.getByText('Creado el: 2024-03-15')).toBeInTheDocument();
  });

  it('llama API al mostrar tareas', async () => {
    mockApiGetTareasProyecto.mockResolvedValue({
      ok: true,
      json: async () => tareasMock,
    } as any);

    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByText(/mostrar tareas/i));

    await waitFor(() => {
      expect(mockApiGetTareasProyecto).toHaveBeenCalledWith(1, 'fake-token');
    });
  });

  it('renderiza tareas', async () => {
    mockApiGetTareasProyecto.mockResolvedValue({
      ok: true,
      json: async () => tareasMock,
    } as any);

    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByText(/mostrar tareas/i));

    await waitFor(() => {
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });
  });

  it('muestra usuario o sin asignar', async () => {
    mockApiGetTareasProyecto.mockResolvedValue({
      ok: true,
      json: async () => tareasMock,
    } as any);

    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByText(/mostrar tareas/i));

    await waitFor(() => {
      expect(screen.getByText('Sofia Piombetti')).toBeInTheDocument();
      expect(screen.getByText('Sin asignar')).toBeInTheDocument();
    });
  });

  it('abre modal proyecto', () => {
    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByAltText(/editar proyecto/i));

    expect(screen.getByTestId('modal-editar-proyecto')).toBeInTheDocument();
  });

  it('actualiza proyecto al guardar modal', async () => {
    render(<CardProyecto proyecto={proyectoMock} setError={jest.fn()} setSuccess={jest.fn()} />);

    fireEvent.click(screen.getByAltText(/editar proyecto/i));
    fireEvent.click(screen.getByText(/guardar modal proyecto/i));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Proyecto Editado' })).toBeInTheDocument();
    });
  });
});