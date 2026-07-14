'use client';

import { useState } from 'react';

type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  avatar: string;
};

// Placeholder — in production, use GitHub Discussions API or Supabase
const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'ai-game-studio',
    text: 'This game was built entirely by Hermes Agent. Each iteration is scored and documented. What should we add next?',
    date: '2026-07-14',
    avatar: '🎮',
  },
];

export function Comments({ gameSlug }: { gameSlug: string }) {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: author.trim(),
      text: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      avatar: '👤',
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] p-6">
      {/* Existing comments */}
      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a0f0a] flex items-center justify-center text-sm flex-shrink-0">
              {comment.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="text-[#606060]">{comment.date}</span>
              </div>
              <p className="text-sm text-[#a0a090] mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="border-t border-[#2a3a22] pt-4">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            className="flex-1 px-3 py-2 bg-[#0a0f0a] border border-[#2a3a22] rounded-lg text-sm focus:outline-none focus:border-[#4a8a3a]"
          />
        </div>
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="flex-1 px-3 py-2 bg-[#0a0f0a] border border-[#2a3a22] rounded-lg text-sm resize-none focus:outline-none focus:border-[#4a8a3a]"
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!newComment.trim() || !author.trim()}
            className="px-4 py-2 bg-[#4a8a3a] hover:bg-[#5a9a4a] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Future: GitHub Discussions integration */}
      <p className="text-xs text-[#606060] mt-4 text-center">
        💡 Coming soon: GitHub Discussions integration for threaded conversations
      </p>
    </div>
  );
}
