import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';

interface InstagramPost {
  id: number;
  image_url: string;
  link: string;
  caption: string;
}

export default function InstagramFeed() {
  const [feeds, setFeeds] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch('/api/instagram-feeds')
      .then(r => r.json())
      .then(setFeeds)
      .catch(() => {});
  }, []);

  if (feeds.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Instagram className="w-5 h-5 text-pink-600" />
          <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">Social Feed</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Follow Us on Instagram</h2>
        <p className="text-black/50 mt-3 text-sm">Tag <strong>@NexusStore</strong> to get featured</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {feeds.map((post, idx) => (
          <motion.a
            key={post.id}
            href={post.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-xl overflow-hidden bg-black/5 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <img
              src={post.image_url}
              alt={post.caption || 'Instagram post'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Instagram'; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
