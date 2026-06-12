import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardProyecto from '@/components/CardProyecto';
import { ApiGetReporte } from '@/utils/api';
import { useUserContext } from '@/utils/userContext';

jest.mock('@/utils/api');
jest.mock('@/utils/userContext');

const mockApiGetReporte = ApiGetReporte as jest.MockedFunction<typeof ApiGetReporte>;
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

describe('CardProyecto', () => {

beforeEach(() => {
  mockUseUserContext.mockReturnValue({
    token: 'fake-token',
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  });
  jest.clearAllMocks();
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

    const mockObjectUrl = 'blob:http://localhost/fake-url';
    global.URL.createObjectURL = jest.fn().mockReturnValue(mockObjectUrl);
    global.URL.revokeObjectURL = jest.fn();

    const mockClick = jest.fn();
    const mockAnchor = { href: '', download: '', click: mockClick };
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);

    render(<CardProyecto proyecto={proyectoMock} />);
    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(mockAnchor.href).toBe(mockObjectUrl);
      expect(mockAnchor.download).toBe('informe.pdf');
      expect(mockClick).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl);
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

    consoleSpy.mockRestore();
  });

  it('loguea el error cuando ApiGetReporte lanza una excepción', async () => {
    mockApiGetReporte.mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<CardProyecto proyecto={proyectoMock} />);
    fireEvent.click(screen.getByRole('button', { name: /generar informe/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

});