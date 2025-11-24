'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // <-- 1. Import toast

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}


export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) router.push('/not-found');
      else setPost(await res.json());
    });
  }, [id, router]);

  const handleDelete = async () => {
    // await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    // router.push('/');
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

        if (res.ok) {
          // 2. Tampilkan toast sukses
          toast.success('Post deleted successfully!');
          router.refresh();

          // 3. Beri jeda agar toast terlihat sebelum redirect
          setTimeout(() => {
            router.push('/');
          }, 1000); // 1 detik jeda

        } else {
          toast.error('Failed to delete post.');
        }
      } catch (error) {
        console.log("this is error: ", error);
        toast.error('An error occurred.');
      }
    }
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <h1>{post?.title}</h1>
      <p className="text-muted">
        {new Date((post as { createdAt: string }).createdAt).toLocaleDateString('id-ID')}
        {' · '} By: {post.author || 'Anonymous'}
      </p>

      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <hr />

      <Link href={`/edit/${id}`} className="btn btn-primary me-2">
        Edit
      </Link>
      <button onClick={handleDelete} className="btn btn-danger">
        Delete
      </button>
    </main>
  );
}
