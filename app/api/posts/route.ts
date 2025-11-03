import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Order = 'asc' | 'desc';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = (searchParams.get('order') as Order) || 'desc';

  let orderByClause = {};
  if (sortBy === 'title') {
    orderByClause = { title: order };
  } else {
    orderByClause = { createdAt: order };
  }

 const posts = await prisma.post.findMany({
  orderBy: orderByClause,
 });
 return NextResponse.json(posts);
}

export async function POST(request: Request) {
 const { title, content, author } = await request.json();
 const newPost = await prisma.post.create({
  data: {
   title,
   content,
   author,
  },
 });
 return NextResponse.json(newPost, { status: 201 });
}
