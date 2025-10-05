# 🏍️ Motorcycle Rental Management System

A comprehensive web-based motorcycle rental management system built with modern technologies. This system helps rental businesses manage their fleet, customers, bookings, and finances efficiently.

## 🌟 Features

### 🏍️ **Motorcycle Fleet Management**

- Complete motorcycle inventory management
- Track motorcycle details (brand, model, year, color, plate number, engine size)
- Real-time status tracking (Available, Rented, Maintenance, Out of Service)
- Condition notes and maintenance history
- Dynamic pricing with daily rates in Indonesian Rupiah (Rp)

### 👥 **Customer Management**

- Customer registration and profile management
- License number verification
- Contact information and address tracking
- Rental history for each customer

### 📋 **Rental Management**

- Easy booking creation with customer and motorcycle selection
- Rental status tracking (Active, Completed, Cancelled, Overdue)
- Deposit management and payment tracking
- Planned vs actual return date monitoring
- Rental notes and special requirements

### 💰 **Financial Management**

- **Income Tracking**: Rental payments, deposits, late fees, damage fees
- **Expense Tracking**: Fuel, maintenance, insurance, repairs, spare parts
- **Asset Management**: Track business assets and their values
- **Financial Reports**: Income vs expense analysis with visual charts

### 🤖 **AI-Powered Insights**

- Automated business intelligence using Google's Gemini AI
- Financial trend analysis and predictions
- Maintenance alerts and recommendations
- Revenue optimization suggestions
- Risk warnings and cost optimization tips

### 🔐 **Authentication & Authorization**

- Secure user authentication with NextAuth.js
- Role-based access control (Owner, Manager, Employee)
- Password-based and OAuth provider support

### 📊 **Dashboard & Analytics**

- Real-time business overview dashboard
- Interactive charts and graphs
- Key performance indicators (KPIs)
- Revenue and expense visualizations

## 🛠️ Technology Stack

### **Frontend**

- **Next.js 15.3.3** - React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Lucide React** - Modern icon library

### **Backend**

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication solution

### **AI Integration**

- **Google Gemini AI** - Business insights and analytics
- **AI-powered reporting** - Automated business intelligence

### **Development Tools**

- **Turbopack** - Fast development bundler
- **ESLint** - Code linting and formatting
- **Vitest** - Unit testing framework
- **Prisma Studio** - Database management GUI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd project_iseng

# Install dependencies
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/motorcycle_rental"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google AI
GOOGLE_AI_API_KEY="your-gemini-api-key"
```

### 3. Database Setup

```bash
# Run database migrations
pnpm run db:migrate

# Seed the database with sample data
pnpm run db:seed

# Open Prisma Studio (optional)
pnpm run db:studio
```

### 4. Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Default Login Credentials

After seeding, you can login with:

- **Email**: `owner@sjrent.com`
- **Password**: `password`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (landing)/         # Landing page
│   ├── api/               # API routes
│   └── dashboard/         # Main application dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── motorcycle/       # Motorcycle-related components
│   ├── customer/         # Customer management components
│   ├── rental/           # Rental management components
│   └── shared/           # Shared components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
├── actions/              # Server actions
└── hooks/                # Custom React hooks
```

## 🎨 Key Features Explained

### **Motorcycle Management**

- Add new motorcycles with complete specifications
- Update motorcycle status in real-time
- Track maintenance schedules and conditions
- Set dynamic pricing per motorcycle

### **Smart Booking System**

- Intuitive rental creation workflow
- Automatic availability checking
- Deposit calculation and tracking
- Status updates throughout rental lifecycle

### **Financial Intelligence**

- Automated income categorization
- Expense tracking by category and motorcycle
- Profit/loss analysis with visual reports
- AI-powered financial insights

### **AI Business Insights**

- Revenue optimization recommendations
- Maintenance scheduling suggestions
- Customer behavior analysis
- Market trend predictions

## 📊 Database Schema

The system uses a comprehensive PostgreSQL database with the following main entities:

- **Motorcycles** - Fleet management
- **Customers** - Customer information
- **Rentals** - Booking and rental tracking
- **Income/Expenses** - Financial transactions
- **Assets** - Business asset tracking
- **AI Insights** - Business intelligence data
- **Users** - System user management

## 🔧 Available Scripts

```bash
# Development
pnpm run dev          # Start development server with Turbopack
pnpm run build        # Build for production
pnpm run start        # Start production server

# Database
pnpm run db:migrate   # Run database migrations
pnpm run db:seed      # Seed database with sample data
pnpm run db:studio    # Open Prisma Studio
pnpm run db:generate  # Generate Prisma client

# Code Quality
pnpm run lint         # Run ESLint
pnpm run test         # Run tests with Vitest
```

## 🌐 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fyour-repo%2F&showOptionalTeamCreation=false)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### **Docker Deployment**

```bash
# Build Docker image
docker build -t motorcycle-rental .

# Run container
docker run -p 3000:3000 motorcycle-rental
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Performance Features

- **Server-Side Rendering** - Fast initial page loads
- **Static Generation** - Optimized build performance
- **Database Connection Pooling** - Efficient database usage
- **Image Optimization** - Automatic image compression
- **Bundle Optimization** - Minimized JavaScript bundles

## 🔒 Security Features

- **Authentication** - Secure user sessions
- **Authorization** - Role-based access control
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM safeguards
- **XSS Protection** - Built-in Next.js security

## 📚 API Documentation

The system provides RESTful API endpoints for:

- `/api/motorcycles` - Motorcycle management
- `/api/customers` - Customer operations
- `/api/rentals` - Rental management
- `/api/financial` - Income and expense tracking
- `/api/insights` - AI-powered analytics

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced reporting features
- [ ] Multi-location support
- [ ] SMS notifications
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Customer mobile app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Google Gemini](https://gemini.google.com/) - AI-powered insights
- [Vercel](https://vercel.com/) - Deployment platform

---

**Built with ❤️ for motorcycle rental businesses**
