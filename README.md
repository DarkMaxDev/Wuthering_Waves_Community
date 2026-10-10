# Wuwa Hub

App full-stack (Next.js 15 App Router + TypeScript + Tailwind + MongoDB/Mongoose) para builds, ecos, comunidad y noticias de Wuthering Waves.

## Puesta en marcha
```bash
pnpm install            # o: npm install
cp .env.example .env.local   # edita MONGODB_URI y JWT_SECRET
pnpm seed               # carga personajes, builds oficiales y un admin de ejemplo
pnpm dev                # http://localhost:3000
```
Requiere MongoDB (local o Atlas). El correo en `ADMIN_EMAIL` obtiene rol **admin** (puede publicar noticias).
El seed crea ese admin con contraseña `ChangeMe123!`: cámbiala o regístrate tú con ese correo antes de ejecutar el seed.

## Seguridad
- Contraseñas con bcryptjs (12 rondas). JWT en cookie HTTP-only, SameSite=Lax (Secure en producción).
- Todas las entradas de la API se validan con Zod (`src/lib/validators.ts`); Mongoose escapa los tipos.
- Roles: `user` y `admin`. Noticias solo por admin.

## API
`POST /api/auth/{register,login,logout}` · `GET /api/auth/me` · `GET /api/characters[?element=]` · `GET /api/characters/:slug`
`GET|POST /api/builds` · `GET|POST /api/comments` · `GET|POST /api/posts` · `GET|POST /api/news`

Los datos de personajes están en `src/data/characters.ts`: ajústalos al parche vigente.
