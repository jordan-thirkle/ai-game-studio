'use client';

import { useState, useEffect } from 'react';

type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
  avatar: string;
};

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'ai-game-studio',
    text: 'This game was built entirely by Hermes Agent. Each iteration is scored and documented. What should we add next?',
    date: '2026-07-14',
    avatar: '🎮',
  },
];

function getStorageKey(gameSlug: string) {
  return `aigs-comments-${gameSlug}`;
}

function loadComments(gameSlug: string): Comment[] {
  if (typeof window === 'undefined') return INITIAL_COMMENTS;
  try {
    const stored = localStorage.getItem(getStorageKey(gameSlug));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return INITIAL_COMMENTS;
}

function saveComments(gameSlug: string, comments: Comment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(gameSlug), JSON.stringify(comments));
  } catch {
    // ignore quota errors
  }
}

export function Comments({ gameSlug }: { gameSlug: string }) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setComments(loadComments(gameSlug));
    setMounted(true);
  }, [gameSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: author.trim(),
      text: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      avatar: '👤',
    };

    const updated = [...comments, comment];
    setComments(updated);
    saveComments(gameSlug, updated);
    setNewComment('');
  };

  const handleDelete = (id: number) => {
    const updated = comments.filter((c) => c.id !== id);
    setComments(updated);
    saveComments(gameSlug, updated);
  };

  if (!mounted) {
    return (
      <div className="bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] p-6">
        <div className="space-y-4 mb-6">
          {INITIAL_COMMENTS.map((comment) => (
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
      </div>
    );
  }

  return (
    <div className="bg-[#1a2e1a]/30 rounded-xl border border-[#2a3a22] p-6">
      {/* Existing comments */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#0a0f0a] flex items-center justify-center text-sm flex-shrink-0">
              {comment.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="text-[#606060]">{comment.date}</span>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="ml-auto text-[#606060] hover:text-[#c44a2a] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete comment"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-[#a0a090] mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-sm text-[#606060] text-center py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="border-t border-[#2a3a22] pt-4">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="flex-1 px-3 py-2 bg-[#0a0f0a] border border-[#2a3a22] rounded-lg text-sm focus:outline-none focus:border-[#4a8a3a] transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="flex-1 px-3 py-2 bg-[#0a0f0a] border border-[#2a3a22] rounded-lg text-sm resize-none focus:outline-none focus:border-[#4a8a3a] transition-colors"
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

      <p className="text-xs text-[#606060] mt-4 text-center">
        💡 Comments are saved in your browser. Coming soon: GitHub Discussions integration.
      </p>
    </div>
  );
}
