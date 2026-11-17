# Verificación del respaldo · 2026-11-16

## Código preservado

HEAD de origen: `50bbba4e6e84502d921ca5a6785eaec54096e06b`; 17 commits previos.

Se copiaron los archivos actuales, incluidos cambios sin commit y archivos nuevos del proyecto. Se excluyeron dependencias, compilaciones y archivos privados; el código funcional no fue modificado para conseguir la compilación. README, reglas de exclusión y documentación de respaldo se prepararon en una copia de trabajo independiente.

Se conserva el historial original de 17 commits y se añade un commit de respaldo/documentación. El árbol original estaba limpio.

## Controles ejecutados antes de publicar

La generación/validación de Prisma, lint, tipos y build pasaron con variables sintéticas. No se conectó una base real ni se probaron Google, login, WhatsApp, Blob o cobros. No hay suite de tests automatizados configurada.

La instalación usó `npm ci --ignore-scripts` con el lockfile y luego generación explícita del cliente Prisma. Los valores de prueba se limitaron al proceso; no se copiaron secretos productivos.

## Publicación y recuperación

El procedimiento de publicación exige revisar con Gitleaks los archivos seleccionados y todos los commits, comprobar el número de commits revisados, publicar en un repositorio público nuevo sin forzar historial y comparar el árbol remoto completo (rutas, modos y hashes Git).

Después se clona desde GitHub en una carpeta nueva, se instala desde el lockfile, se repiten los controles y se cotejan los hashes. El resultado final, commits y evidencia de recuperación se registran en el inventario local del propietario; este documento describe los controles previos y el procedimiento exigido, no anticipa sus resultados.

## Qué no certifica

No es una auditoría exhaustiva de seguridad ni una prueba de compras reales, cobros, entrega de mensajes o disponibilidad del proveedor. No se importaron bases personales. Los archivos privados y medios externos no quedan respaldados por esta publicación. No se eliminó ni movió ningún proyecto original.
