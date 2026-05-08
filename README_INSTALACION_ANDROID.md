# Plan Alimenticio 2070–2150 kcal — App v4

Esta es una app web progresiva (PWA) lista para instalar en Android desde Chrome y también lista para envolver como APK con Capacitor.

## Qué incluye

- Dashboard diario 2070/2150 kcal.
- Entrada rápida: alimento + gramos pesados.
- Cálculo de kcal, proteína, carbohidratos, grasas y fibra.
- Base de alimentos editable.
- Recetas por lote.
- Módulo especial para batch de trutros de pollo.
- Seguimiento de peso, cintura, hambre, energía, sueño y entrenamiento.
- Gráficos.
- Exportar CSV y respaldo JSON.
- Funciona offline después de instalarse.

## Instalación rápida como app en Android

La forma más rápida es publicarla como PWA:

1. Sube la carpeta completa `plan_alimenticio_app_v4` a GitHub Pages, Netlify, Vercel o cualquier hosting HTTPS.
2. Abre la URL en Chrome desde tu teléfono.
3. Toca menú ⋮.
4. Toca **Agregar a pantalla principal** o **Instalar app**.
5. Se instalará como app y funcionará offline.

Nota: Android/Chrome exige HTTPS para instalar PWAs correctamente. Abrir `index.html` directamente como archivo local puede permitir ver la app, pero normalmente no permite instalarla como app completa.

## Convertir a APK con Capacitor

Desde VS Code en la carpeta del proyecto:

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init Plan2150 com.mario.plan2150 --web-dir .
npx cap add android
npx cap copy android
npx cap open android
```

En Android Studio:

1. Espera que Gradle sincronice.
2. Conecta tu teléfono con depuración USB activada o usa emulador.
3. Build > Build Bundle(s) / APK(s) > Build APK(s).
4. Instala el APK generado en el teléfono.

## Importante

Los alimentos incluidos son una base inicial aproximada. Para productos de marca, usa la etiqueta nutricional y edita/agrega el alimento en la sección **Base de alimentos**.
