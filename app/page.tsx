import Link from 'next/link';

type Post = {
 id: number;
 title: string;
 createdAt: string;
};

async function getPosts(sortBy: string = 'createdAt', order: string = 'desc') {
 const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
 url.searchParams.append('sortBy', sortBy);
 url.searchParams.append('order', order);

 const res = await fetch(url.toString(), {
  cache: 'no-store',
 });

 if (!res.ok) {
  console.error("Failed to fetch posts");
  return [];
 }
 return res.json();
}

export default async function Home({ searchParams: searchParamsPromise }: {
  searchParams: Promise<{ sortBy?: string; order?: string }>
}) {

  const searchParams = await searchParamsPromise;
   const posts: Post[] = await getPosts(searchParams.sortBy || 'createdAt', searchParams.order || 'desc');

 return (
  <main className="container mt-4">
   <h1>Blog Posts</h1>
   <Link href="/create" className="btn btn-primary mb-3">
    Create Post
   </Link>
   <div className="mb-3 d-flex align-items-center flex-wrap">
    <strong className="me-2">Sort by:</strong>
    <Link href="/?sortBy=title&order=asc" className="btn btn-outline-secondary btn-sm me-2 mb-1">
     Title (A-Z)
    </Link>
    <Link href="/?sortBy=title&order=desc" className="btn btn-outline-secondary btn-sm me-2 mb-1">
     Title (Z-A)
    </Link>
    <Link href="/?sortBy=createdAt&order=desc" className="btn btn-outline-secondary btn-sm me-2 mb-1">
     Date (Newest)
    </Link>
    <Link href="/?sortBy=createdAt&order=asc" className="btn btn-outline-secondary btn-sm me-2 mb-1">
     Date (Oldest)
    </Link>
   </div>
      {/* ...sisa kode Anda (sudah benar)... */}
   {posts.length === 0 ? (
    <p>No posts yet.</p>
   ) : (
    <ul className="list-group">
     {posts.map((post) => (
      <li key={post.id} className="list-group-item">
       <Link href={`/post/${post.id}`}>
        {post.title}
       </Link>
       <span className="text-muted float-end">
        {new Date(post.createdAt).toLocaleDateString('id-ID')}
       </span>
      </li>
     ))}
    </ul>
   )}
  </main>
 );
}
