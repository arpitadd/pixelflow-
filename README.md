# PixelFlow 📸

PixelFlow is a modern, premium SaaS web application for creators to upload, share, and manage their visual portfolios. Built with Next.js 15, React, and MongoDB, it features a beautifully designed, responsive glassmorphism UI using Tailwind CSS and DaisyUI.

🌍 **Live Demo:** [https://pixelflow-neon-ten.vercel.app/](https://pixelflow-neon-ten.vercel.app/)

## 🌟 Features

- **Media Uploads:** Seamlessly upload high-quality photos (up to 10MB) and videos (up to 100MB).
- **Cloudinary Integration:** Reliable media storage and delivery directly through Cloudinary.
- **Custom Authentication:** Secure JSON Web Token (JWT) based authentication system built from scratch.
- **Interactive Feed:** Scroll through community posts, engage with likes, and leave comments.
- **Profile Management:** Fully customizable user profiles with personalized bio and username handling.
- **Premium UI/UX:** Features a sleek "Winter" theme with ambient mesh gradients, glassmorphism components, and subtle CSS micro-animations.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Media Storage:** [Cloudinary](https://cloudinary.com/)
- **Validation:** [Zod](https://zod.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB account/cluster
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arpitadd/pixelflow-.git
   cd pixelflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pixelflow?retryWrites=true&w=majority
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 📝 License

This project is open-source and available for educational purposes and portfolio building.
