import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroService, PomodoroConfig } from '../../services/pomodoro.service';
import { LucideAngularModule, Settings, X, Save } from 'lucide-angular';

/**
 * Componente standalone para la configuración del temporizador Pomodoro
 * Permite al usuario personalizar las duraciones de las sesiones
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  // Inyección del servicio usando inject()
  protected pomodoroService = inject(PomodoroService);
  
  // Iconos de Lucide
  protected readonly SettingsIcon = Settings;
  protected readonly XIcon = X;
  protected readonly SaveIcon = Save;

  // Signals para el estado del modal y valores de configuración
  protected isOpen = signal(false);
  protected workDuration = signal(25);
  protected shortBreakDuration = signal(5);
  protected longBreakDuration = signal(15);
  protected sessionsBeforeLongBreak = signal(4);

  constructor() {
    // Inicializar con los valores actuales del servicio
    const currentConfig = this.pomodoroService.config();
    this.workDuration.set(currentConfig.workDuration);
    this.shortBreakDuration.set(currentConfig.shortBreakDuration);
    this.longBreakDuration.set(currentConfig.longBreakDuration);
    this.sessionsBeforeLongBreak.set(currentConfig.sessionsBeforeLongBreak);
  }

  /**
   * Abre el modal de configuración y carga los valores actuales
   */
  openModal(): void {
    // Actualizar valores con la configuración actual
    const currentConfig = this.pomodoroService.config();
    this.workDuration.set(currentConfig.workDuration);
    this.shortBreakDuration.set(currentConfig.shortBreakDuration);
    this.longBreakDuration.set(currentConfig.longBreakDuration);
    this.sessionsBeforeLongBreak.set(currentConfig.sessionsBeforeLongBreak);
    
    this.isOpen.set(true);
  }

  /**
   * Cierra el modal de configuración sin guardar
   */
  closeModal(): void {
    this.isOpen.set(false);
  }

  /**
   * Guarda la configuración y cierra el modal
   */
  saveSettings(): void {
    const newConfig: PomodoroConfig = {
      workDuration: this.workDuration(),
      shortBreakDuration: this.shortBreakDuration(),
      longBreakDuration: this.longBreakDuration(),
      sessionsBeforeLongBreak: this.sessionsBeforeLongBreak()
    };

    this.pomodoroService.updateConfig(newConfig);
    this.closeModal();
  }

  // ============ Métodos de Validación ============

  /**
   * Valida que los minutos estén entre 1 y 60
   */
  validateMinutes(value: number): number {
    return Math.max(1, Math.min(60, Math.floor(value)));
  }

  /**
   * Valida que el número de sesiones esté entre 1 y 10
   */
  validateSessions(value: number): number {
    return Math.max(1, Math.min(10, Math.floor(value)));
  }

  // ============ Manejadores de Eventos ============

  /**
   * Maneja el cambio de duración de trabajo
   */
  onWorkDurationChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.workDuration.set(this.validateMinutes(value));
  }

  /**
   * Maneja el cambio de duración de descanso corto
   */
  onShortBreakChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.shortBreakDuration.set(this.validateMinutes(value));
  }

  /**
   * Maneja el cambio de duración de descanso largo
   */
  onLongBreakChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.longBreakDuration.set(this.validateMinutes(value));
  }

  /**
   * Maneja el cambio del número de sesiones antes del descanso largo
   */
  onSessionsChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.sessionsBeforeLongBreak.set(this.validateSessions(value));
  }

  /**
   * Maneja las teclas de navegación (Esc para cerrar)
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
