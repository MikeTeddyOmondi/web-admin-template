import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function NotFound() {
  const notFoundImageSrc = `/404.gif`
  
  return (
    <div className="container flex h-[100vH] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="container flex flex-col items-center justify-center">
        <Image 
          alt="404.gif" 
          src={notFoundImageSrc} 
          width={1024}
          height={720}
        />
        <span className="text-2xl m-2">Oops!... Cant seem to found this page...</span>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>Go Back</Link>
      </div>  
    </div>
  )
}