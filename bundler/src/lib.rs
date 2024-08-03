#![deny(clippy::all)]
#![allow(unused)]

#[macro_use]
extern crate napi_derive;

use napi::bindgen_prelude::*;
use dagger_sdk::{Container, Directory, Query};
// use eyre::Result;

#[napi]
async fn bundle() -> Result<()> {
  let client = dagger_sdk::connect().await.expect("Error connecting to Dagger Engine!");
  let build_directory = build_frontend(&client).await;
  let image = build_prod_image(&client, build_directory).await;
  let image_reference = push_image(image).await?; //.expect("Error pushing image to OCI Registry!");
  println!("Image published at: {}", image_reference);
  Ok(())
}

// docker image: docker.io/clux/muslrust:stable //rust:1.77.2
async fn build_frontend(client: &Query) -> Directory {
  let backend_directory = client.host().directory("./leptos-app");
  client
    .container()
    .from("clux/muslrust:stable") 
    //.with_exec(vec!["apt-get", "update"])
    .with_exec(vec!["apt-get", "install", "-y", "nodejs", "npm"])
    .with_exec(vec!["rustup", "target", "add", "wasm32-unknown-unknown"])
    .with_exec(vec!["cargo", "install", "trunk"])
    .with_directory("./frontend", backend_directory)
    .with_workdir("/frontend")
    .with_exec(vec!["trunk", "build", "--release"])
    .directory("./dist")
}

async fn build_prod_image(client: &Query, build_directory: Directory) -> Container {
  client
    .container()
    .from("nginx:1.24.0-alpine3.17")
    .with_directory("/usr/share/nginx/html", build_directory)
}

async fn push_image(image: Container) -> Result<String> {
  let tag_uuid = uuid::Uuid::new_v4().to_string();
  let address = format!("ttl.sh/leptos-app-{}", tag_uuid);
  println!("OCI Image: {}", &address);
  let image_reference = image.publish(address).await.expect("Error pushing image to OCI Registry!");
  Ok(image_reference)
}
