# 🎯 Canvas 2D · Interactividad con Gráficos

Proyecto desarrollado para la unidad **2.4 Interactividad con gráficos 2D**, cuyo objetivo es implementar algoritmos que permitan la interacción del usuario con animaciones dentro de un entorno gráfico utilizando **HTML5 Canvas**.

---

## 📌 Objetivo

Desarrollar algoritmos que permitan a las aplicaciones interactuar con animaciones en escenarios gráficos 2D, integrando eventos del usuario y lógica dinámica.

---

## 🚀 Características principales

Este proyecto implementa las siguientes reglas de negocio:

### 🎨 Interacción con el usuario
- Cambio de color al detectar las coordenadas `mouseX` y `mouseY` sobre un objeto.
- Eliminación de elementos mediante clic.
- Desaparición progresiva (fade out) al eliminar un objeto.

### 🔄 Movimiento de objetos
- Los objetos:
  - Inician **fuera del canvas (parte inferior)**.
  - Se desplazan **de abajo hacia arriba**.
  - Terminan fuera del área visible.
- Movimiento con comportamiento:
  - **Aleatorio (wander)**.
  - Trayectorias dinámicas y naturales.

### 📊 Sistema de niveles
- Cada nivel contiene **10 elementos**.
- Se contabilizan:
  - Elementos eliminados (numérico).
  - Porcentaje de progreso.
- Al completar un nivel:
  - Se incrementa la velocidad.
  - Se genera un nuevo grupo de objetos.
  - Se muestra una animación de **"Level Up"**.

### ⚡ Escalabilidad
- Incremento progresivo de velocidad por nivel.
- Indicadores visuales de velocidad.

---

## 🧩 Tecnologías utilizadas

- **HTML5 Canvas**
- **JavaScript (ES6+)**
- **CSS3**
- **Bootstrap 5**

---

## 🖥️ Interfaz

La interfaz fue diseñada bajo un enfoque moderno:

- 🎯 Layout con **Navbar + Sidebar + Canvas + Footer**
- 🎨 Estilo visual tipo **Glass / Neon UI**
- 📱 Diseño responsivo
- 📊 Panel lateral con estadísticas en tiempo real:
  - Nivel actual
  - Eliminados
  - Progreso
  - Velocidad

---

## 🕹️ Controles

| Acción | Descripción |
|------|------------|
| 🖱️ Hover | Resalta el objeto |
| 🖱️ Click | Elimina el objeto |
| 📊 Automático | Actualiza estadísticas en tiempo real |

---

## 📂 Estructura del proyecto
INTERACTIVIDAD-CANVAS-2D/
│
├── assets/
│ ├── css/
│ │ └── style.css
│ │
│ ├── img/
│ │ └── (recursos gráficos si se utilizan)
│ │
│ └── js/
│ └── main.js
│
├── index.html
└── README.md
## 📂 CREADO POR
NICOLAS VITE JESUS