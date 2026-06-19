import type { APIContext } from 'astro';

export const prerender = false;

export const POST = async (context: APIContext) => {
  // @ts-ignore - Astro v6+ Cloudflare adapter provides env directly on locals
  const { DB, BUCKET } = context.locals.env;
  const formData = await context.request.formData();
  
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const image = formData.get("heroImage") as File;

  if (!image) {
    return new Response("Missing hero image", { status: 400 });
  }

  // 1. Upload Hero Image to R2
  // We use a unique ID to prevent filename collisions
  const imageKey = `posts/${crypto.randomUUID()}-${image.name}`;
  await BUCKET.put(imageKey, await image.arrayBuffer());

  // 2. Save metadata and MDXL body to D1
  const postUrl = `https://your-r2-bucket-url.com/${imageKey}`;
  const postId = crypto.randomUUID();
  
  await DB.prepare(
    "INSERT INTO posts (id, title, hero_image_url, body_mdxl, pub_date) VALUES (?, ?, ?, ?, ?)"
  )
  .bind(postId, title, postUrl, body, new Date().toISOString())
  .run();

  return new Response(JSON.stringify({ 
    success: true, 
    postId: postId 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};