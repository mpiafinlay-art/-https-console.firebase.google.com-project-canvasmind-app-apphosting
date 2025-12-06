# Instrucciones para Deploy Limpio

**Fecha**: 6 de Diciembre 2024

## 🧹 Limpiar Hosting Actual

```bash
# 1. Verificar sitio actual
firebase hosting:sites:list

# 2. Limpiar archivos del sitio (si es necesario)
# Nota: Firebase Hosting no tiene comando directo para limpiar
# Se sobrescribirán los archivos con el nuevo deploy
```

## 🚀 Deploy

```bash
# 1. Build (ya completado)
npm run build

# 2. Verificar que out/ existe
ls -la out/

# 3. Deploy a Firebase Hosting
firebase deploy --only hosting:app-micerebro

# 4. Verificar deploy
firebase hosting:channel:list
```

## ✅ Verificaciones Post-Deploy

1. **URL**: https://app-micerebro.web.app/
2. **Página de inicio**: Debe mostrar logo y botones
3. **Login invitado**: Debe funcionar
4. **Redirección**: Debe llevar a tablero

## 📝 Notas

- El deploy sobrescribirá todos los archivos existentes
- No es necesario limpiar manualmente (Firebase lo hace automáticamente)
- El build ya está completo y listo

