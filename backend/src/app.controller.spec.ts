import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('getHello devuelve el saludo del AppService', () => {
    const controller = new AppController(new AppService());
    expect(controller.getHello()).toBe('Hello World!');
  });
});
