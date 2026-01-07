import { useTranslations } from "next-intl"

export default function About() {
  const t = useTranslations()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-lg mb-8">
        This is a simple Next.js app that demonstrates how to use the `next-i18next` library for internationalization.
      </p>
      <p className="text-lg mb-8">
    
        The app is currently in development and will be updated with new features and improvements in the future.
      </p>
      <p className="text-lg mb-8">
        If you have any questions or suggestions, please feel free to contact me at <a href="mailto:your-email@example.com">your-email@example.com</a>.
      </p>
      <p className="text-lg mb-8">
        Thank you for visiting my app!
      </p>
    </div>
  )
}