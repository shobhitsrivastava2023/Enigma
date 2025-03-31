import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"

function StackedCircularFooter() {
  const router = useRouter()

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const confirmed = window.confirm("Contact me on shobhitsrivastava729@gmail.com?")
    if (confirmed) {
      console.log("User confirmed contact.")
    } else {
      console.log("User cancelled contact.")
    }
  }

  const handleSocialClickTwitter = () => { 
    router.push("https://x.com/Shobhit_Talks")
  }
  
  const handleSocialClickInstagram = () => {
    router.push("https://www.instagram.com/shobhit_729/")
  }
  
  const handleSocialClickLinkedin = () => {
    router.push("https://www.linkedin.com/in/shobhit-srivastava-s1323/")
  }

  return (
    <footer className="bg-[#000000] text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8">
            This is shobhit.
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <a href="#" onClick={handleContactClick} className="hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button 
              variant="outline" 
              onClick={handleSocialClickTwitter} 
              size="icon" 
              className="rounded-full bg-black"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon"  
              onClick={handleSocialClickInstagram} 
              className="rounded-full bg-black"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSocialClickLinkedin} 
              className="rounded-full bg-black"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Made by Shobhit. For Fun. 
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }