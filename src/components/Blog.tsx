import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Tag, ChevronRight } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  created_at: string;
}

export const BlogPage = ({ onNavigate }: { onNavigate: (v: string, slug?: string) => void }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(setBlogs);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <div className="mb-10 sm:mb-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">Nexus Insights</h1>
        <p className="text-black/50 text-base sm:text-xl">The latest in technology, lifestyle, and commerce.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {blogs.map((blog) => (
          <motion.div 
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => onNavigate('blog-post', blog.slug)}
          >
            <div className="aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 bg-zinc-100">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                {blog.category}
              </span>
              <span className="text-xs font-bold text-black/40 uppercase tracking-widest">
                {new Date(blog.created_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors">{blog.title}</h2>
            <p className="text-black/50 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base line-clamp-3">{blog.excerpt}</p>
            <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
              Read More <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const BlogPostPage = ({ slug, onNavigate }: { slug: string, onNavigate: (v: string) => void }) => {
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(res => res.json())
      .then(setBlog);
  }, [slug]);

  if (!blog) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
      <button 
        onClick={() => onNavigate('blog')}
        className="flex items-center gap-2 text-sm font-bold mb-8 sm:mb-12 hover:-translate-x-1 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Insights
      </button>

      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-black text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">
            {blog.category}
          </span>
          <span className="text-xs sm:text-sm font-bold text-black/40 uppercase tracking-widest">
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight">{blog.title}</h1>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600">
            {blog.author[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{blog.author}</p>
            <p className="text-xs text-black/40 font-bold uppercase tracking-widest">Lead Contributor</p>
          </div>
        </div>
      </div>

      <div className="aspect-[21/9] rounded-2xl sm:rounded-[40px] overflow-hidden mb-10 sm:mb-16 shadow-2xl">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="prose prose-lg sm:prose-xl max-w-none">
        <div className="text-black/70 leading-relaxed text-lg sm:text-xl space-y-6 sm:space-y-8">
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <div className="mt-20 pt-12 border-t border-black/5 flex justify-between items-center">
        <div className="flex gap-4">
          {['#Ecommerce', '#Future', '#Tech'].map(tag => (
            <span key={tag} className="text-sm font-bold text-black/30 hover:text-black cursor-pointer transition-colors">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
