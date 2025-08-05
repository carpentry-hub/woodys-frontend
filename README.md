# woodys-frontend

<div align="center">
  <img src="/public/woodys-workshop.png" alt="Woody's Workshop Logo" width="200"/>
</div>

Web application for exploring, creating, and saving woodworking projects. Built with Next.js to deliver a fast and responsive user experience.

## 🏗️ Architecture

The application is built using:
- **Next.js 13** - React framework with server-side rendering
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling
- **Context API** - For state management

Project structure:
```
woodys-frontend/
├── app/              # Next.js 13 app directory
├── components/       # Reusable UI components
├── context/         # React Context providers
├── public/          # Static assets
└── styles/         # Global styles
```

## 📄 Pages

- **Home** (`/`) - Landing page with featured projects
- **Projects** (`/projects`) - Browse all woodworking projects
- **Create** (`/create`) - Create new woodworking projects
- **Profile** (`/profile`) - User profile and saved projects
- **Project Details** (`/projects/[id]`) - Detailed view of a project

## 🚀 Deployment

The application is deployed on Vercel and can be accessed at:

➡️ [Woody's Workshop](https://woodys-frontend.vercel.app/)