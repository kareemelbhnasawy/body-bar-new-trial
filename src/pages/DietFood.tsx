import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

export default function DietFood() {
    const { products, loading, error } = useProducts('diet-food');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handlePurchase = (product: any) => {
        addToCart({
            ...product,
            quantity: 1
        });
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-body-accent animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Fine-Dine Healthy Meals</h1>
                    <p className="text-body-accent font-medium max-w-2xl mx-auto">
                        Gourmet meals designed for athletes. Delicious flavor meets essential nutrients.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.length === 0 ? (
                        <div className="col-span-full py-12 text-center border border-white/5 rounded-2xl bg-white/5">
                            <p className="text-gray-400">No diet plans available at the moment.</p>
                        </div>
                    ) : (
                        products.map((plan, i) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-body-card rounded-2xl p-8 border-t-4 border-body-accent flex flex-col relative overflow-hidden group`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="w-32 h-32 rounded-full bg-body-accent blur-2xl" />
                                </div>

                                <div className="mb-6 h-40 rounded-xl overflow-hidden border border-white/5 relative bg-body-dark">
                                    <img src={plan.image} alt={plan.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{plan.name}</h3>
                                <div className="text-body-accent font-mono text-xl font-bold mb-4">AED {plan.price.toFixed(2)}</div>
                                
                                <div className="text-gray-400 text-sm mb-6 line-clamp-3 overflow-hidden flex-1" dangerouslySetInnerHTML={{ __html: plan.description || 'Premium meal plan balanced for absolute performance.' }} />

                                <div className="mt-auto pt-4">
                                    <Button 
                                        className="w-full bg-body-accent text-body-dark hover:bg-white flex justify-center items-center font-bold"
                                        onClick={() => handlePurchase(plan)}
                                    >
                                        <Utensils size={18} className="mr-2" /> Purchase Plan
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
