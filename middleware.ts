import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    "/",
    "/productos",
    "/productos/(.*)",
    "/comidas",
    "/comidas/(.*)",
    "/boutique",
    "/boutique/(.*)",
    "/api/webhooks(.*)"
  ],
  ignoredRoutes: [
    "/api/webhooks(.*)"
  ]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};