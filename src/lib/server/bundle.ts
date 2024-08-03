"use server"

import { bundle } from "bundler"

async function bundleAction() {
  await bundle()
}

export { bundleAction }
