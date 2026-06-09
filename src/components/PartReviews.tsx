import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';

interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

// Mock initial reviews
const initialReviews: Record<string, Review[]> = {
    '1': [
        { id: 'r1', productId: '1', userName: 'Chinedu O.', rating: 5, comment: 'Excellent brake pads! Fit perfectly on my Camry.', date: '2023-11-12' },
        { id: 'r2', productId: '1', userName: 'Amina S.', rating: 4, comment: 'Good quality, but shipping took a day longer than expected.', date: '2023-10-28' }
    ]
};

export const PartReviews: React.FC<{ productId: string }> = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newRating, setNewRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        // Load reviews for the specific product, fallback to some mock ones if none exist
        const loadedReviews = initialReviews[productId] || [
            { id: 'default1', productId, userName: 'Guest User', rating: 4, comment: 'Solid replacement part. Does the job well.', date: '2023-09-15' }
        ];
        setReviews(loadedReviews);
    }, [productId]);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) return;

        const newReview: Review = {
            id: Date.now().toString(),
            productId,
            userName: user?.displayName || 'Anonymous User',
            rating: newRating,
            comment: newComment.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        setReviews([newReview, ...reviews]);
        setNewRating(0);
        setNewComment('');
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a]">
            {/* Reviews Summary */}
            <div className="flex items-center gap-6 p-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-black dark:text-white">{averageRating}</span>
                    <div className="flex text-amber-500 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? 'fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                        ))}
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">{reviews.length} reviews</span>
                </div>
                <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                                <span className="w-2 font-medium text-zinc-600 dark:text-zinc-400">{star}</span>
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="w-6 text-right text-zinc-500">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Leave a Review Form */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800">
                <h4 className="text-sm font-bold text-black dark:text-white mb-4">Write a Review</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setNewRating(star)}
                                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star className={`w-6 h-6 ${(hoveredRating || newRating) >= star ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience with this part..."
                            className="w-full h-24 p-3 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none text-black dark:text-white placeholder:text-zinc-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!newRating || !newComment.trim()}
                            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Post Review
                        </button>
                    </div>
                </form>
            </div>

            {/* Reviews List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <AnimatePresence>
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-black dark:text-white">{review.userName}</div>
                                        <div className="text-xs text-zinc-500">{review.date}</div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-10">
                                {review.comment}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {reviews.length === 0 && (
                    <div className="text-center py-8 text-zinc-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No reviews yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
