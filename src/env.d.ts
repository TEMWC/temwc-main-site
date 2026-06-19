interface Env {
  DB: D1Database;
}

declare namespace App {
  interface Locals {
    env?: Env;
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}
