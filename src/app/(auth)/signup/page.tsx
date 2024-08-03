import { useActionState } from "react"
import { redirect } from "next/navigation"
import { signupUser } from "@/lib/server/actions";
import { validateRequest } from "@/lib/lucia"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"

export default async function Signup() {
  const { user } = await validateRequest()

  if (user) {
    return redirect("/")
  }
  
  // const [state, action, isPending] = useActionState(signupUser, null)

  async function signupAction(formData: FormData) {
    "use server"
    let data = Object.fromEntries(formData)
    console.log({data})
    const res = await signupUser(data)
    console.log({res: res})
  } 
  
  return (
    <div className="container flex h-[100vH] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signupAction}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    name="username"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm Password" 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button> */}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
