import { DataBaseService } from 'src/app/services/data-base.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showToast } from 'src/app/tools/message-routines';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  private currentUser: any;
  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);
  Asistencia = new BehaviorSubject<string>('codigoqr');
  primerInicioSesion = new BehaviorSubject<boolean>(false);
  qrCodeData = new BehaviorSubject<string>('');
  authUser = new Usuario();
  selectedComponent = new BehaviorSubject<string>('welcome');

  constructor(private router: Router, private databaseService: DataBaseService, private storage: Storage, ) {
    this.currentUser = {
      role: 'admin', // Cambia esto según tu lógica real
      name: 'Admin User'
    };
   }
   isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  private usuarios: Usuario[] =[];

  getUsers(): Usuario[] {
    return this.usuarios;
  }

  deleteUser(cuenta: string): void {
    this.usuarios = this.usuarios.filter(usuario => usuario.cuenta !== cuenta);
  }

  async inicializarAutenticacion() {
    await this.storage.create();
  }

  async iniciarSesion(cuenta: string, password: string): Promise<void> {
    try {
      // Llama al método del servicio de base de datos para buscar el usuario
      const usuario = await this.databaseService.buscarUsuarioValido(cuenta, password);

      if (usuario) {
        // Si el usuario existe, establece el usuario actual
        this.usuarioActual.next(usuario);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    const usuario: any = await this.storage.get(this.keyUsuario);
    
    if (usuario) {
      // Asegúrate de verificar y convertir la fecha correctamente
      usuario.fechaNacimiento = this.stringToDate(usuario.fechaNacimiento);
      this.usuarioAutenticado.next(usuario);
    } else {
      this.usuarioAutenticado.next(null);
    }
  
    return usuario;
  }

  guardarUsuarioAutenticado(usuario: Usuario) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

  eliminarUsuarioAutenticado(usuario: Usuario) {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }

  async login(cuenta: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.primerInicioSesion.next(false); // Avisar que no es el primer inicio de sesión
        this.router.navigate(['/inicio']);
      } else {
        await this.databaseService.buscarUsuarioValido(cuenta, password).then(async (usuario: Usuario | undefined) => {
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
            this.guardarUsuarioAutenticado(usuario);
            this.primerInicioSesion.next(true); // Avisar que es el primer inicio de sesión
            this.router.navigate(['/inicio']);
          } else {
            showToast(`El correo o la password son incorrectos`);
            this.router.navigate(['/ingreso']);
          }
        });
      }
    });
  }
  async irAPregunta(correo: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.router.navigate(['/pregunta']);
      } else {
        const usuario = await this.databaseService.buscarUsuarioPorCorreo(correo);
        if (usuario) {
          this.guardarUsuarioAutenticado(usuario);
          showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
          this.router.navigate(['/pregunta']);
        } else {
          showToast(`El correo proporcionado no está registrado.`);
          this.router.navigate(['/ingreso']);
        }
      }
    });
  }
  

  async logout() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
        this.eliminarUsuarioAutenticado(usuario);
      }
      this.router.navigate(['/ingreso']);
    })
  }

  formatDateToDDMMYYYY(date: Date | undefined): string {
    if (date) {
      const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día y lo convierte en 2 dígitos
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (los meses empiezan en 0) y lo convierte en 2 dígitos
      const year = date.getFullYear(); // Obtiene el año
    
      return `${day}/${month}/${year}`; // Formato dd/mm/yyyy
    } else {
      return '01/01/2000';
    }
  }

  stringToDate(dateString: any): Date | null {
    // Verifica si dateString ya es un objeto Date
    if (dateString instanceof Date) {
      return dateString;
    }
    
    // Si dateString no es un string, devuelve null
    if (typeof dateString !== 'string') {
      return null;
    }
  
    // Continuamos con la conversión solo si dateString es un string
    const [day, month, year] = dateString.split('/').map(Number); // Separamos por '/' y convertimos a número
  
    // Validamos si el formato es correcto
    if (!day || !month || !year || day > 31 || month > 12 || year < 1000) {
      return null; // Devuelve null si el formato es inválido
    }
  
    // Restamos 1 al mes porque en JavaScript los meses están basados en 0 (enero = 0, diciembre = 11)
    return new Date(year, month - 1, day);
  }
  

  stringToDate2(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number); // Separamos por '/' y convertimos a número
  
    // Validamos si el formato es correcto
    if (!day || !month || !year || day > 31 || month > 12 || year < 1000) {
      return new Date(); // Devuelve null si el formato es inválido
    }
  
    // Restamos 1 al mes porque en JavaScript los meses están basados en 0 (enero = 0, diciembre = 11)
    return new Date(year, month - 1, day);
  }
}
