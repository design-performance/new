# Hub IA

Plataforma pessoal para usar Claude, ChatGPT e Gemini num lugar só.

## Estrutura
- `index.html`: a plataforma
- `api/chat.js`: servidor que guarda as chaves e conversa com as IAs

## Variáveis de ambiente (Vercel → Settings → Environment Variables)
| Nome | Valor |
|---|---|
| ANTHROPIC_API_KEY | chave do Claude (console.anthropic.com) |
| OPENAI_API_KEY | chave do ChatGPT (platform.openai.com/api-keys) |
| GEMINI_API_KEY | chave do Gemini (aistudio.google.com/apikey) |
| APP_SENHA | uma senha sua, para ninguém mais usar suas chaves |

Opcionais: `CLAUDE_MODEL`, `OPENAI_MODEL`, `GEMINI_MODEL` para trocar o modelo.

Nunca coloque as chaves dentro dos arquivos do GitHub.
