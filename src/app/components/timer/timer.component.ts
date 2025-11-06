import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService } from '../../services/pomodoro.service';
import { LucideAngularModule, Play, Pause, Square, SkipForward, RefreshCw } from 'lucide-angular';

/**
 * Componente standalone para el temporizador Pomodoro
 * Gestiona la presentación y las interacciones del usuario con el temporizador
 */
@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  // Inyección del servicio usando inject()
  protected pomodoroService = inject(PomodoroService);

  // Iconos de Lucide
  protected readonly PlayIcon = Play;
  protected readonly PauseIcon = Pause;
  protected readonly SquareIcon = Square;
  protected readonly SkipForwardIcon = SkipForward;
  protected readonly RefreshCwIcon = RefreshCw;

  ngOnInit(): void {
    // Solicitar permisos de notificación al cargar el componente
    this.pomodoroService.requestNotificationPermission();
  }

  /**
   * Getter para saber si el temporizador está en ejecución
   */
  get isRunning(): boolean {
    return this.pomodoroService.state().isRunning && !this.pomodoroService.state().isPaused;
  }

  /**
   * Getter para saber si el temporizador está pausado
   */
  get isPaused(): boolean {
    return this.pomodoroService.state().isPaused;
  }

  /**
   * Getter que retorna las clases CSS según el tipo de sesión actual
   */
  get sessionTypeClass(): Record<string, boolean> {
    const type = this.pomodoroService.state().currentSessionType;
    return {
      'session-work': type === 'work',
      'session-short-break': type === 'shortBreak',
      'session-long-break': type === 'longBreak'
    };
  }

  /**
   * Maneja el evento de inicio/pausa del temporizador
   */
  onStartPause(): void {
    const state = this.pomodoroService.state();
    
    if (state.isRunning && !state.isPaused) {
      this.pomodoroService.pause();
    } else if (state.isPaused) {
      this.pomodoroService.resume();
    } else {
      this.pomodoroService.start();
    }
  }

  /**
   * Maneja el evento de detener el temporizador
   */
  onStop(): void {
    this.pomodoroService.stop();
  }

  /**
   * Maneja el evento de saltar a la siguiente sesión
   */
  onSkip(): void {
    this.pomodoroService.skip();
  }

  /**
   * Maneja el evento de reiniciar todo el temporizador
   */
  onReset(): void {
    this.pomodoroService.resetAll();
  }
}
