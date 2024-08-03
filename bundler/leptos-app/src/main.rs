#![deny(clippy::all)]
#![allow(unused)]

use leptos::*;

#[component]
pub fn SimpleCounter(initial_value: i32) -> impl IntoView {
  // create a reactive signal with the initial value
  let (value, set_value) = create_signal(initial_value);

  // create event handlers for our buttons
  // note that `value` and `set_value` are `Copy`, so it's super easy to move them into closures
  // let clear = move |_| set_value(0);
  let clear = move |_| set_value.set(0);
  let decrement = move |_| set_value.update(|value| *value -= 1);
  let increment = move |_| set_value.update(|value| *value += 1);

  // create user interfaces with the declarative `view!` macro
  view! {
      <div>
          <button on:click=clear>Clear</button>
          <button on:click=decrement>-1</button>
          // text nodes can be quoted or unquoted
          <span>"Value: " {value} "!"</span>
          <button on:click=increment>+1</button>
      </div>
  }
}

// we also support a builder syntax rather than the JSX-like `view` macro
// #[component]
// pub fn SimpleCounterWithBuilder(initial_value: i32) -> impl IntoView {
//   use leptos::html::*;

//   let (value, set_value) = create_signal(initial_value);
//   let clear = move |_| set_value(0);
//   let decrement = move |_| set_value.update(|value| *value -= 1);
//   let increment = move |_| set_value.update(|value| *value += 1);

//   // the `view` macro above expands to this builder syntax
//   div().child((
//     button().on(ev::click, clear).child("Clear"),
//     button().on(ev::click, decrement).child("-1"),
//     span().child(("Value: ", value, "!")),
//     button().on(ev::click, increment).child("+1"),
//   ))
// }

// Easy to use with Trunk (trunkrs.dev) or with a simple wasm-bindgen setup
pub fn main() {
  // enable console stack traces (WASM)
  console_error_panic_hook::set_once();
  mount_to_body(|| {
    view! {
        <SimpleCounter initial_value=3 />
    }
  })
}

// fn main() {
//   // enable console stack traces (WASM)
//   console_error_panic_hook::set_once();
//   mount_to_body(|| view! { <p>"Hello, world!"</p> })
// }
