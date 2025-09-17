# Setup Instructions for AprovaJá AI

## Quick Start

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Version 18+ required

2. **Install PostgreSQL** (if not already installed)
   - Download from https://www.postgresql.org/download/
   - Create a database named `aprova_ja_ai`

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Setup Environment Variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/aprova_ja_ai"
   
   # NextAuth.js
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # AI API (choose one)
   OPENAI_API_KEY="sk-..."
   GOOGLE_AI_API_KEY="..."
   
   # Stripe (optional for development)
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

5. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open http://localhost:3000
   - Create an account
   - Start taking simulations!

## AI API Setup

### OpenAI Setup
1. Go to https://platform.openai.com/
2. Create an account and get your API key
3. Add the key to your `.env.local` file

### Google Gemini Setup
1. Go to https://makersuite.google.com/
2. Create an account and get your API key
3. Add the key to your `.env.local` file

## Stripe Setup (Optional)

1. Go to https://stripe.com/
2. Create an account
3. Get your test keys from the dashboard
4. Add them to your `.env.local` file
5. Create a product and price in Stripe dashboard
6. Update the price ID in the pricing page

## Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
1. Set up PostgreSQL database (Supabase, Railway, etc.)
2. Configure environment variables
3. Run `npm run build && npm run start`

## Troubleshooting

### Database Issues
- Make sure PostgreSQL is running
- Check your DATABASE_URL format
- Run `npx prisma db push` to sync schema

### Authentication Issues
- Make sure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

### AI API Issues
- Verify your API key is correct
- Check if you have credits/quota available
- Make sure the API key has the right permissions

## Features

✅ User authentication and registration
✅ Dashboard with exam selection
✅ AI-powered question generation
✅ Simulation interface with timer
✅ Results page with explanations
✅ Subscription system (Stripe integration)
✅ Responsive design
✅ Modern UI with Shadcn/UI

## Next Steps

1. Add more exam types
2. Implement advanced analytics
3. Add social features
4. Create mobile app
5. Add more AI features

Happy coding! 🚀
