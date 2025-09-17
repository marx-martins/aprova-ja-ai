# AprovaJá AI - Simulados Inteligentes para Concursos

Uma plataforma moderna de simulados para concursos públicos brasileiros, alimentada por inteligência artificial.

## 🚀 Funcionalidades

- **Simulados com IA**: Questões geradas automaticamente por IA baseadas nos editais mais recentes
- **Explicações Detalhadas**: Entenda cada questão com explicações personalizadas
- **Múltiplos Concursos**: Acesso a simulados dos principais concursos públicos
- **Sistema de Assinatura**: Plano gratuito e Pro com recursos avançados
- **Interface Moderna**: Design responsivo e intuitivo

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Next-Auth.js v5
- **AI Integration**: OpenAI GPT / Google Gemini
- **Payments**: Stripe

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- Conta OpenAI ou Google AI (para geração de questões)

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd aprova-ja-ai
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/aprova_ja_ai"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # AI API (escolha uma)
   OPENAI_API_KEY="sk-..."
   GOOGLE_AI_API_KEY="..."
   
   # Stripe (opcional para desenvolvimento)
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Configure o banco de dados**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard do usuário
│   ├── simulation/        # Páginas de simulado
│   └── results/           # Páginas de resultados
├── components/            # Componentes React
│   └── ui/               # Componentes Shadcn/UI
├── lib/                  # Utilitários e configurações
│   ├── auth.ts          # Configuração Next-Auth
│   ├── db.ts            # Cliente Prisma
│   ├── ai.ts            # Integração com IA
│   └── utils.ts         # Funções utilitárias
└── types/               # Definições TypeScript
```

## 🎯 Funcionalidades Principais

### Para Usuários Gratuitos
- 3 simulados por mês
- Acesso a todos os concursos
- Resultados básicos

### Para Usuários Pro
- Simulados ilimitados
- Explicações detalhadas com IA
- Análise de performance
- Suporte prioritário

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa o servidor de produção
- `npm run lint` - Executa o linter
- `npm run db:push` - Aplica mudanças no schema do banco
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio

## 🤖 Integração com IA

O sistema suporta duas APIs de IA:

### OpenAI
```env
OPENAI_API_KEY="sk-..."
```

### Google Gemini
```env
GOOGLE_AI_API_KEY="..."
```

## 💳 Integração com Stripe

Para habilitar pagamentos:

1. Crie uma conta no Stripe
2. Configure as chaves no `.env.local`
3. Configure os webhooks no dashboard do Stripe

## 📊 Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. Principais entidades:

- **User**: Usuários e assinaturas
- **Exam**: Concursos disponíveis
- **Simulation**: Simulados realizados
- **SimulationQuestion**: Questões dos simulados

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- Configure PostgreSQL (Supabase, Railway, etc.)
- Configure as variáveis de ambiente
- Execute `npm run build && npm run start`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: suporte@aprova-ja-ai.com
- GitHub Issues

---

Desenvolvido com ❤️ para ajudar candidatos a concursos públicos brasileiros.
