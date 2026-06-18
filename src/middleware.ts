import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const protectedRoutes = ["/dashboard", "/settings", "/admin"]; //Todo: move admin to zero trust.
  
  // 1. Check if the current route is protected
  if (protectedRoutes.some(route => context.url.pathname.startsWith(route))) {
    
    // 2. Validate the session (e.g., check for a cookie)
    const session = context.cookies.get("session_token");
    
    if (!session) {
      // 3. Redirect to login if unauthorized
      return context.redirect("/login");
    }
  }

  // Otherwise, proceed with the request
  return next();
});