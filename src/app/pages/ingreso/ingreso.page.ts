import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent       // CGV-Lista de idiomas
  ]
})




export class ingresoPage {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;
  password: string;
  correo: string;

  constructor( 
    private authService: AuthService
   , private router: Router,
   private translate: TranslateService) 
  {
    this.correo = 'atorres';
    this.password = '1234';
  }

  Ingresar() {
    this.authService.login(this.correo, this.password);
  }

  Navegar(){
    this.router.navigate(['/home']);
  }
  navegarcorreo() {
    this.router.navigate(['/correo']);
  }

  navigateTheme() {
    this.router.navigate(['/theme']);
  }
  navegarRegistrar() {
    this.router.navigate(['/registrarme'])
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

}
