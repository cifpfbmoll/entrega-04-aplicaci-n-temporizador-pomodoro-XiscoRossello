[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c6IViGy8)

# 🍅 Aplicación Temporizador Pomodoro

Una aplicación moderna de temporizador Pomodoro construida con **Angular 18**, utilizando **componentes standalone** y **Signals** para la gestión de estado reactivo.

![Angular](https://img.shields.io/badge/Angular-18-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Standalone](https://img.shields.io/badge/Components-Standalone-green)
![Signals](https://img.shields.io/badge/State-Signals-purple)

## 📋 Descripción

Esta aplicación implementa la técnica Pomodoro, un método de gestión del tiempo que utiliza intervalos de trabajo focalizados seguidos de breves descansos. La aplicación permite:

- ⏱️ Temporizador con sesiones de trabajo y descansos configurables
- 🎨 Interfaz moderna y responsiva con animaciones fluidas
- 🔔 Notificaciones del navegador al finalizar cada sesión
- 🎵 Sonidos de alerta personalizados
- ⚙️ Configuración personalizable de duraciones
- 📊 Contador de sesiones completadas
- 🎯 Arquitectura limpia con separación de responsabilidades

## 🏗️ Arquitectura

### Separación de Responsabilidades

La aplicación sigue el principio de separación de responsabilidades:

#### **Service Layer** (`PomodoroService`)
- ✅ Gestión completa de la lógica de negocio
- ✅ Manejo del estado mediante Signals
- ✅ Control del temporizador y transiciones entre sesiones
- ✅ Gestión de notificaciones y sonidos
- ✅ Actualización de configuración

#### **Presentation Layer** (Components)
- ✅ `TimerComponent`: Visualización y controles del temporizador
- ✅ `SettingsComponent`: Configuración de parámetros
- ✅ `App`: Componente raíz que estructura la aplicación

### Signals de Angular

La aplicación utiliza **Signals** para gestionar el estado de forma reactiva:

#### Signals Privados (Estado Interno)
```typescript
private configSignal = signal<PomodoroConfig>({...});
private stateSignal = signal<PomodoroState>({...});
```

#### Computed Signals (Solo Lectura)
```typescript
public config = computed(() => this.configSignal());
public state = computed(() => this.stateSignal());
public formattedTime = computed(() => {...});
public progress = computed(() => {...});
public currentSessionTypeLabel = computed(() => {...});
```

### Componentes Standalone

Todos los componentes utilizan la nueva arquitectura standalone de Angular:

```typescript
@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  protected pomodoroService = inject(PomodoroService);
  // ...
}
```

## 🚀 Características

### Configuración del Temporizador

- **Sesión de Trabajo**: Duración personalizable (1-60 minutos)
- **Descanso Corto**: Duración personalizable (1-60 minutos)
- **Descanso Largo**: Duración personalizable (1-60 minutos)
- **Sesiones antes del descanso largo**: Configurable (1-10 sesiones)

### Controles Disponibles

| Control | Función |
|---------|---------|
| ▶️ **Iniciar** | Inicia el temporizador |
| ⏸️ **Pausar** | Pausa el temporizador actual |
| ⏹️ **Detener** | Detiene y reinicia la sesión actual |
| ⏭️ **Saltar** | Salta a la siguiente sesión |
| 🔄 **Reiniciar** | Reinicia todo (sesiones y configuración) |

### Notificaciones

La aplicación solicita permisos para mostrar notificaciones del navegador que te alertan cuando:
- ✅ Una sesión de trabajo termina
- ✅ Un descanso termina
- ✅ Es momento de volver a trabajar

### Diseño Responsivo

La interfaz se adapta perfectamente a diferentes tamaños de pantalla:
- 📱 **Móvil**: Interfaz optimizada con controles táctiles
- 💻 **Tablet/Desktop**: Vista expandida con todos los controles visibles

## 🎨 Interfaz de Usuario

### Indicadores Visuales

- **Colores por tipo de sesión**:
  - 🟣 Morado: Sesión de trabajo
  - 🔵 Azul: Descanso corto
  - 🟢 Verde: Descanso largo

- **Barra de progreso**: Visualización del tiempo transcurrido
- **Contador de sesiones**: Muestra sesiones completadas
- **Tiempo restante**: Formato MM:SS con fuente monoespaciada

### Accesibilidad

- ✅ Atributos ARIA para lectores de pantalla
- ✅ Navegación por teclado (ESC para cerrar modales)
- ✅ Estados de botones claramente diferenciados
- ✅ Alto contraste y tamaños de fuente legibles

## 📦 Instalación y Desarrollo

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## 🛠️ Scripts Disponibles

```bash
npm start       # Inicia servidor de desarrollo
npm run build   # Construye la aplicación para producción
npm test        # Ejecuta las pruebas unitarias
npm run watch   # Construye en modo watch
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── timer/              # Componente del temporizador
│   │   │   ├── timer.component.ts
│   │   │   ├── timer.component.html
│   │   │   └── timer.component.scss
│   │   └── settings/           # Componente de configuración
│   │       ├── settings.component.ts
│   │       ├── settings.component.html
│   │       └── settings.component.scss
│   ├── services/
│   │   └── pomodoro.service.ts # Servicio con lógica de negocio
│   ├── app.ts                  # Componente raíz
│   ├── app.html
│   ├── app.scss
│   └── app.config.ts
├── styles.scss                 # Estilos globales
├── index.html
└── main.ts
```

## 🔧 Tecnologías Utilizadas

- **Angular 18**: Framework principal
- **TypeScript 5.9**: Lenguaje de programación
- **Signals**: Gestión de estado reactivo
- **Standalone Components**: Nueva arquitectura de componentes
- **Lucide Angular**: Iconos
- **SCSS**: Preprocesador CSS
- **Web Audio API**: Sonidos de notificación
- **Notifications API**: Notificaciones del navegador

## 💡 Uso de Signals

### Ventajas en esta Aplicación

1. **Reactividad Granular**: Solo se actualizan los componentes que dependen de los valores cambiados
2. **Rendimiento Óptimo**: Sin necesidad de detección de cambios manual
3. **Código Más Limpio**: Sintaxis declarativa y legible
4. **Type Safety**: Tipos TypeScript completamente integrados

### Ejemplo de Uso

```typescript
// Definir signal privado
private stateSignal = signal<PomodoroState>({...});

// Exponer como computed (solo lectura)
public state = computed(() => this.stateSignal());

// Actualizar el estado
this.stateSignal.update((state: PomodoroState) => ({
  ...state,
  isRunning: true
}));

// Usar en template
{{ pomodoroService.state().timeRemaining }}
```

## 🎯 Técnica Pomodoro

### ¿Qué es la Técnica Pomodoro?

La Técnica Pomodoro es un método de gestión del tiempo desarrollado por Francesco Cirillo a finales de los años 80. 

### Funcionamiento

1. 🍅 Trabaja enfocado durante 25 minutos (1 Pomodoro)
2. ☕ Toma un descanso corto de 5 minutos
3. 🔄 Repite el ciclo
4. 🎉 Después de 4 Pomodoros, toma un descanso largo de 15-30 minutos

### Beneficios

- ✅ Mejora la concentración y el enfoque
- ✅ Reduce la fatiga mental
- ✅ Aumenta la productividad
- ✅ Ayuda a gestionar mejor el tiempo
- ✅ Previene el agotamiento (burnout)

## 📚 Recursos Adicionales

Para más información sobre Angular CLI, visita la [documentación oficial de Angular](https://angular.dev/tools/cli).

---

**¿Listo para mejorar tu productividad? ¡Empieza tu primer Pomodoro ahora! 🍅**
