import { Injectable, computed, signal } from '@angular/core';

/**
 * Tipos de sesión del Pomodoro
 */
export type SessionType = 'work' | 'shortBreak' | 'longBreak';

/**
 * Configuración del temporizador Pomodoro
 */
export interface PomodoroConfig {
  /** Duración de la sesión de trabajo en minutos */
  workDuration: number;
  /** Duración del descanso corto en minutos */
  shortBreakDuration: number;
  /** Duración del descanso largo en minutos */
  longBreakDuration: number;
  /** Número de sesiones antes del descanso largo */
  sessionsBeforeLongBreak: number;
}

/**
 * Estado actual del temporizador Pomodoro
 */
export interface PomodoroState {
  /** Tipo de sesión actual */
  currentSessionType: SessionType;
  /** Tiempo restante en segundos */
  timeRemaining: number;
  /** Indica si el temporizador está en ejecución */
  isRunning: boolean;
  /** Indica si el temporizador está pausado */
  isPaused: boolean;
  /** Número de sesiones de trabajo completadas */
  completedSessions: number;
}

/**
 * Servicio para gestionar la lógica del temporizador Pomodoro
 * Utiliza Signals de Angular para la gestión reactiva del estado
 */
@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  // ============ Signals Privados - Estado Interno ============
  
  /**
   * Signal privado para la configuración del temporizador
   * Se actualiza mediante el método updateConfig()
   */
  private configSignal = signal<PomodoroConfig>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
  });

  /**
   * Signal privado para el estado del temporizador
   * Gestiona el tiempo, sesión actual, y estado de ejecución
   */
  private stateSignal = signal<PomodoroState>({
    currentSessionType: 'work',
    timeRemaining: 25 * 60,
    isRunning: false,
    isPaused: false,
    completedSessions: 0
  });

  // ============ Referencias Privadas ============
  
  /** Referencia al intervalo del temporizador */
  private timerInterval: any = null;
  
  /** Contexto de audio para reproducir sonidos */
  private audioContext: AudioContext | null = null;

  // ============ Computed Signals - Acceso Público de Solo Lectura ============
  
  /**
   * Computed signal que expone la configuración actual
   * @returns Configuración actual del temporizador
   */
  public config = computed(() => this.configSignal());
  
  /**
   * Computed signal que expone el estado actual
   * @returns Estado actual del temporizador
   */
  public state = computed(() => this.stateSignal());
  
  /**
   * Computed signal que devuelve la etiqueta legible del tipo de sesión actual
   * @returns Texto descriptivo del tipo de sesión
   */
  public currentSessionTypeLabel = computed(() => {
    const type = this.stateSignal().currentSessionType;
    switch(type) {
      case 'work': return 'Sesión de Trabajo';
      case 'shortBreak': return 'Descanso Corto';
      case 'longBreak': return 'Descanso Largo';
      default: return 'Sesión de Trabajo';
    }
  });

  /**
   * Computed signal que formatea el tiempo restante en formato MM:SS
   * @returns Tiempo formateado (ej: "25:00")
   */
  public formattedTime = computed(() => {
    const seconds = this.stateSignal().timeRemaining;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  });

  /**
   * Computed signal que calcula el progreso actual de la sesión (0-100%)
   * @returns Porcentaje de progreso
   */
  public progress = computed(() => {
    const state = this.stateSignal();
    const config = this.configSignal();
    let totalSeconds = 0;
    
    switch(state.currentSessionType) {
      case 'work':
        totalSeconds = config.workDuration * 60;
        break;
      case 'shortBreak':
        totalSeconds = config.shortBreakDuration * 60;
        break;
      case 'longBreak':
        totalSeconds = config.longBreakDuration * 60;
        break;
    }
    
    return ((totalSeconds - state.timeRemaining) / totalSeconds) * 100;
  });

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio(): void {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
    }
  }

  // ============ Métodos Públicos - Control del Temporizador ============

  /**
   * Inicia o reanuda el temporizador
   */
  public start(): void {
    if (this.stateSignal().isRunning && !this.stateSignal().isPaused) {
      return;
    }

    this.stateSignal.update((state: PomodoroState) => ({
      ...state,
      isRunning: true,
      isPaused: false
    }));

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  /**
   * Pausa el temporizador actual
   */
  public pause(): void {
    if (!this.stateSignal().isRunning) {
      return;
    }

    this.stateSignal.update((state: PomodoroState) => ({
      ...state,
      isPaused: true
    }));

    this.clearTimer();
  }

  /**
   * Reanuda el temporizador pausado
   */
  public resume(): void {
    if (!this.stateSignal().isPaused) {
      return;
    }

    this.start();
  }

  /**
   * Detiene el temporizador y reinicia el tiempo de la sesión actual
   */
  public stop(): void {
    this.clearTimer();
    
    const config = this.configSignal();
    const currentType = this.stateSignal().currentSessionType;
    
    let duration = config.workDuration;
    if (currentType === 'shortBreak') {
      duration = config.shortBreakDuration;
    } else if (currentType === 'longBreak') {
      duration = config.longBreakDuration;
    }

    this.stateSignal.update((state: PomodoroState) => ({
      ...state,
      timeRemaining: duration * 60,
      isRunning: false,
      isPaused: false
    }));
  }

  /**
   * Salta a la siguiente sesión
   */
  public skip(): void {
    this.clearTimer();
    this.moveToNextSession();
  }

  // ============ Métodos Privados - Lógica Interna ============

  /**
   * Método privado que se ejecuta cada segundo para decrementar el tiempo
   */
  private tick(): void {
    const currentState = this.stateSignal();
    
    if (currentState.timeRemaining > 0) {
      this.stateSignal.update((state: PomodoroState) => ({
        ...state,
        timeRemaining: state.timeRemaining - 1
      }));
    } else {
      this.playNotificationSound();
      this.sendNotification();
      this.moveToNextSession();
    }
  }

  /**
   * Método privado que gestiona la transición a la siguiente sesión
   */
  private moveToNextSession(): void {
    const config = this.configSignal();
    const currentState = this.stateSignal();
    
    let nextSessionType: SessionType;
    let nextDuration: number;
    let completedSessions = currentState.completedSessions;

    if (currentState.currentSessionType === 'work') {
      completedSessions++;
      
      if (completedSessions % config.sessionsBeforeLongBreak === 0) {
        nextSessionType = 'longBreak';
        nextDuration = config.longBreakDuration;
      } else {
        nextSessionType = 'shortBreak';
        nextDuration = config.shortBreakDuration;
      }
    } else {
      nextSessionType = 'work';
      nextDuration = config.workDuration;
    }

    this.stateSignal.set({
      currentSessionType: nextSessionType,
      timeRemaining: nextDuration * 60,
      isRunning: false,
      isPaused: false,
      completedSessions: completedSessions
    });

    this.clearTimer();
  }

  /**
   * Limpia el intervalo del temporizador
   */
  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Actualiza la configuración del temporizador
   * @param newConfig Objeto con las nuevas configuraciones
   */
  public updateConfig(newConfig: Partial<PomodoroConfig>): void {
    this.configSignal.update((config: PomodoroConfig) => ({
      ...config,
      ...newConfig
    }));

    // Si el temporizador no está en ejecución, actualizar el tiempo restante
    if (!this.stateSignal().isRunning) {
      const currentType = this.stateSignal().currentSessionType;
      const updatedConfig = this.configSignal();
      
      let duration = updatedConfig.workDuration;
      if (currentType === 'shortBreak') {
        duration = updatedConfig.shortBreakDuration;
      } else if (currentType === 'longBreak') {
        duration = updatedConfig.longBreakDuration;
      }

      this.stateSignal.update((state: PomodoroState) => ({
        ...state,
        timeRemaining: duration * 60
      }));
    }
  }

  /**
   * Reproduce un sonido de notificación al finalizar una sesión
   */
  private playNotificationSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Envía una notificación del navegador cuando termina una sesión
   */
  private sendNotification(): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const state = this.stateSignal();
      const sessionName = this.currentSessionTypeLabel();
      
      new Notification('Temporizador Pomodoro', {
        body: `¡${sessionName} completada!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'pomodoro-notification'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.sendNotification();
        }
      });
    }
  }

  /**
   * Solicita permiso para mostrar notificaciones del navegador
   */
  public requestNotificationPermission(): void {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  /**
   * Reinicia completamente el temporizador a su estado inicial
   */
  public resetAll(): void {
    this.clearTimer();
    const config = this.configSignal();
    
    this.stateSignal.set({
      currentSessionType: 'work',
      timeRemaining: config.workDuration * 60,
      isRunning: false,
      isPaused: false,
      completedSessions: 0
    });
  }
}
