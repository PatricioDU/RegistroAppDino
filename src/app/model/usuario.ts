import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { Asistencia } from '../interfaces/asistencia';
import { DataBaseService } from '../services/data-base.service';
import { Optional } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export class Usuario extends Persona {
  static jsonDinoExample(jsonDinoExample: any) {
      throw new Error('Method not implemented.');
  }

  public cuenta: string;
  public correo: string;
  public password: string;
  public confirmarPassword: string;
  public preguntaSecreta: string;
  public respuestaSecreta: string;
  public asistencia: Asistencia;
  public listaUsuarios: Usuario[];

  constructor(@Optional() private db?: DataBaseService) {
    super();
    this.cuenta = '';
    this.correo = '';
    this.password = '';
    this.confirmarPassword = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.fechaNacimiento = undefined;
    this.direccion = '';
    this.asistencia = this.asistenciaVacia();
    this.listaUsuarios = [];
  }

  public asistenciaVacia(): Asistencia {
    return {  
      bloqueInicio: 0,
      bloqueTermino: 0,
      dia: '',
      horaFin: '',
      horaInicio: '',
      idAsignatura: '',
      nombreAsignatura: '',
      nombreProfesor: '',
      seccion: '',
      sede: ''
    };
  }

  public static getNewUsuario(
    cuenta: string,
    correo: string,
    password: string,
    confirmarPassword: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaNacimiento: Date | undefined,
    direccion: string
  ) {
    let usuario = new Usuario();
    usuario.cuenta = cuenta;
    usuario.correo = correo;
    usuario.password = password;
    usuario.confirmarPassword = confirmarPassword;
    usuario.preguntaSecreta = preguntaSecreta;
    usuario.respuestaSecreta = respuestaSecreta;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.nivelEducacional = nivelEducacional;
    usuario.fechaNacimiento = fechaNacimiento;
    usuario.direccion = direccion;
    return usuario;
  }

  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    return await this.db!.buscarUsuarioValido(cuenta, password);
  }

  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined>  {
    return await this.db!.buscarUsuarioPorCuenta(cuenta);
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    this.db!.guardarUsuario(usuario);
  }

  async eliminarUsuario(cuenta: string): Promise<void>  {
    this.db!.eliminarUsuarioUsandoCuenta(cuenta);
  }

  public override toString(): string {
    return `
      ${this.cuenta}
      ${this.correo}
      ${this.password}
      ${this.confirmarPassword}
      ${this.preguntaSecreta}
      ${this.respuestaSecreta}
      ${this.nombre}
      ${this.apellido}
      ${this.nivelEducacional.getEducacion()}
      ${this.getFechaNacimiento()}
      ${this.direccion}`;
  }

  navegarEnviandousuario(router: Router, pagina: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        cuenta: this.cuenta,
        password: this.password,
      }
    }
    router.navigate([pagina], navigationExtras);
  }
}