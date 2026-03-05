# Verbandsbuch-ui

## Environment-Variablen

- `NUXT_SESSION_PASSWORD`: Geheimer Schlüssel (min. 32 Zeichen), den das Modul `nuxt-auth-utils` verwendet, um die
  Session-Cookies zu verschlüsseln und zu signieren.
- `NUXT_PUBLIC_MS_EXTERNAL_BASE_URL`: Nuxt betreibt standardmäßig SSR (Server-Side Rendering). Somit sollte es zwei
  verschiedene Microservice-URLs geben. Eine externe, die vom Client (Browser) aufgerufen werden kann.
- `NUXT_MS_INTERNAL_BASE_URL`: Und eine interne URL, die nur für den Server gültig ist.
- `NUXT_PUBLIC_IS_DEV`:
    - `true`: Beim Login kann man beliebige Werte eingeben, da der Nutzer aus einer `devUser.json` gelesen wird.
- `NUXT_PUBLIC_DEV_USER_INDEX`: Angabe, welcher User aus der `devUser.json` gelesen werden soll (z.B. `0` für den
  ersten Eintrag). Nur relevant, wenn `NUXT_PUBLIC_IS_DEV=true` gesetzt ist.