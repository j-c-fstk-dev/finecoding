# Configuração do Fine Coding (Netlify + Firebase)

Todo acesso ao banco agora passa pelo servidor do Next.js, usando o
**Firebase Admin SDK**. O navegador só usa o Firebase para o login do admin.
Por isso o site precisa de uma *service account* para funcionar.

## 1. Gerar a service account

1. Firebase Console → ⚙️ **Project settings** → aba **Service accounts**.
2. Clique em **Generate new private key** → **Generate key**. Um arquivo `.json` será baixado.
3. **Não** coloque esse arquivo no repositório (o `.gitignore` já bloqueia os nomes padrão).

Do JSON você vai usar dois campos: `client_email` e `private_key`.

## 2. Descobrir o seu UID de admin (opcional)

Firebase Console → **Authentication** → **Users** → copie o **User UID** da sua conta.
Você pode usar o UID (`ADMIN_UIDS`) ou o e-mail de login (`ADMIN_EMAILS`), ou os dois.

Aproveite e confira em **Authentication → Settings → User actions** se o cadastro
de novos usuários está desativado ("Enable create (sign-up)" desmarcado).

## 3. Variáveis de ambiente no Netlify

Netlify → seu site → **Site configuration** → **Environment variables**. Adicione:

| Variável | Valor |
|---|---|
| `FIREBASE_CLIENT_EMAIL` | `client_email` do JSON |
| `FIREBASE_PRIVATE_KEY` | `private_key` do JSON, inteiro, incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----` (pode colar com os `\n` literais, o código converte) |
| `ADMIN_EMAILS` | seu e-mail de login do dashboard |
| `ADMIN_UIDS` | (opcional) seu UID |

Mantenha as que já existem (`NEXT_PUBLIC_FIREBASE_*`, `GOOGLE_API_KEY`, `RESEND_API_KEY`, etc.).
A lista completa está em [`.env.example`](../.env.example).

> Dica: o Netlify limita o total de variáveis disponíveis para as *functions* a ~4 KB.
> Por isso prefira `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` em vez do JSON inteiro.

Depois de salvar, faça um novo deploy (**Deploys → Trigger deploy → Deploy site**).

> Se as credenciais estiverem faltando ou erradas, o **build falha** com uma
> mensagem clara. Isso é proposital: antes, o site ia ao ar sem nenhum post.

## 4. Publicar as novas regras do Firestore

As regras em [`firestore.rules`](../firestore.rules) agora bloqueiam qualquer escrita
vinda do navegador (o servidor e o n8n usam service account e não são afetados).

```sh
npx firebase login
npx firebase use --add      # só na primeira vez: escolha o projeto do blog
npm run deploy:rules
```

## 5. Rodar localmente

```sh
cp .env.example .env.local   # e preencha os valores
npm install
npm run dev                  # http://localhost:9003
```

## Como as atualizações aparecem no site

- Ao criar, editar ou excluir um post no dashboard, a home, `/posts` e a página do
  post são atualizadas na hora.
- Fora isso, as páginas públicas buscam dados novos no Firestore a cada 5 minutos.
- Editar o título de um post **não muda mais o slug (URL)**, então links já compartilhados continuam funcionando.

## Backup do conteúdo

```sh
npm run backup                   # salva em backups/<data-hora>/
npm run backup -- ~/meu-backup   # ou numa pasta à sua escolha
```

Usa as mesmas credenciais do `.env.local` (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
`NEXT_PUBLIC_FIREBASE_PROJECT_ID`). Gera:

- `posts/<slug>.md`: um arquivo Markdown por post, com título, data, tags etc. no
  cabeçalho (front matter). Abre em qualquer editor e serve para importar em outras
  plataformas (Supabase, Astro, Hugo, Ghost...).
- `data.json`: tudo (posts com comentários, recursos, inscritos da newsletter e wishlist).

A pasta `backups/` fica fora do Git porque contém e-mails de inscritos. Guarde o
backup num lugar seguro (Google Drive, HD externo etc.).

## Versões

- Node.js **22** ou mais novo (o Netlify já usa 22 via `netlify.toml`).
- Next.js 16 + React 19. A sugestão de tags usa o modelo `gemini-flash-latest`
  (sempre o Flash atual do Google), com a chave em `GOOGLE_API_KEY` ou `GEMINI_API_KEY`.
