import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './components/timer/timer.component';
import { SettingsComponent } from './components/settings/settings.component';

/**
 * Componente raíz de la aplicación Pomodoro Timer
 * Componente standalone que estructura la aplicación
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, TimerComponent, SettingsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Pomodoro Timer';
}
