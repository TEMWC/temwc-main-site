import { defineMiddleware } from "astro:middleware";
import { createAuth } from "./auth";

export const onRequest = defineMiddleware(async(context, next) => {
  const protectedRoutes = ["/dashboard", "/settings", "/admin"]; //Todo: move admin to zero trust.
  
  // 1. Check if the current route is protected
  if (protectedRoutes.some(route => context.url.pathname.startsWith(route))) {
    // Get D1 database from Cloudflare context (Astro v6+)
    // @ts-ignore - Cloudflare Workers env
    const D1Database = context.locals.env?.DB;
    
    if (!D1Database) {
      console.error("D1 database not found in context");
      return context.redirect("/login");
    }
    
    // Create auth instance with D1 database
    const auth = createAuth(D1Database);
    
     const isAuthed = await auth.api
        .getSession({
            headers: context.request.headers,
        })
    if (isAuthed) {
        context.locals.user = isAuthed.user;
        context.locals.session = isAuthed.session;
    } else {
        context.locals.user = null;
        context.locals.session = null;
        return context.redirect("/login");
    }
  }

  // Otherwise, proceed with the request
  return next();
});