"use client"

import { bundleAction } from "@/lib/server/bundle"
import { Button } from "@/components/ui/button"

export default function BundlerExec() {
  return (
    <>
      <Button className="mt-4"
        onClick={() => bundleAction()}
      >
        Bundle
      </Button>
    </>
  )
}
