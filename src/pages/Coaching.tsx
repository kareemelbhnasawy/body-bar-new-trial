import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Loader2, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { BookingModal } from '../components/ui/BookingModal';
import { useState } from 'react';

export default function Coaching() {
    const { products, loading, error } = useProducts('coaching');
    const { addToCart } = useCart();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedCoachForModal, setSelectedCoachForModal] = useState('Bassem');

    const handleAddToCart = (product: any) => {
        addToCart({
            ...product,
            quantity: 1
        });
    };

    const openBooking = (coachName: string) => {
        setSelectedCoachForModal(coachName);
        setIsBookingModalOpen(true);
    };

    // The explicit roster of trainers with biographical info matching Light Mode Layout
    const LOCAL_COACHES = [
        {
            name: "Alyona",
            title: "Fitness Coach",
            intro: `Transform<br/>your body, unlock your potential!`,
            bio: `Alyona: Certified<br/>trainer with 9 years of sculpting<br/>physiques.<br/><br/>Specializations<br/><br/>Tailored<br/>programs: Fitness level, needs, health – she's got you covered.<br/><br/>Master of all trades: General<br/>fitness, strength, bodybuilding, mobility – the list goes on!<br/><br/>Nutrition<br/>& lifestyle coaching: Fuel your body, optimize your habits.`,
            image: "/coaches_images/alyona.webp"
        },
        {
            name: "Ingy Sweid",
            title: "General Fitness",
            intro: ``,
            bio: `A qualified and experienced coach with a wide and diverse client<br/><br/>based in Dubai, UAE<br/><br/>Trainer and Nutritionist.<br/><br/>My approach is integrating strength / cardio and yoga along with a<br/><br/>holistic nutrition approach to reach a well balanced and functional<br/><br/>healthy life.`,
            image: "/coaches_images/ingy_sweid.webp"
        },
        {
            name: "Coach Ramzy",
            title: "Personal Trainer",
            intro: `Dubai's leading certified personal trainer, is here to guide you every<br/>step of the<br/>way. AE`,
            bio: `With over 10<br/>years of experience, he's helped countless individuals:<br/><br/>Why choose<br/>Coach Ramzy?<br/><br/>Expertise you can trust: Certified in personal training, CrossFit, and<br/>group<br/>exercise.<br/><br/>Results-driven approach: Tailored plans for your unique goals and<br/>needs.`,
            image: "/coaches_images/ramzy.webp"
        },
        {
            name: "Nikoleta",
            title: "Personal Trainer",
            intro: `Your transformation guru and cheerleader!`,
            bio: `Specializes in Weight loss, Strength & conditioning, Muscle building, and Postural correction.<br/><br/>With years of experience helping clients achieve their dream bodies.`,
            image: "/coaches_images/nikoleta.webp"
        },
        {
            name: "Khaled",
            title: "Coach",
            intro: `Certified trainer with 12 years of performance coaching.`,
            bio: `Professional athlete and certified nutritionist.<br/><br/>Expertise in functional training, athletic performance and bodybuilding.`,
            image: "/coaches_images/khaled.webp"
        },
        {
            name: "Elena",
            title: "Holistic Coach",
            intro: `Holistic Health Coach & Hypnotherapist.`,
            bio: `Tailored sessions blending movement, breath, & visualization.<br/><br/>5+ Years Experience. Tai Chi & Qi Gong Master.`,
            image: "/coaches_images/elena.webp"
        },
        {
            name: "Someyah",
            title: "Personal Trainer",
            intro: `Dedicated to helping others achieve their goals.`,
            bio: `Certified trainer with 6 years of experience, specializing in personalized, effective programs.`,
            image: "/coaches_images/someyah.webp"
        },
        {
            name: "Ibrahim",
            title: "Fitness Coach",
            intro: `Crafting nutrition plans for top athletes.`,
            bio: `12 years of experience. I will work on your weight loss, diet plan and endurance to maximize your true potential.`,
            image: "/coaches_images/ibrahim.webp"
        },
        {
            name: "Diana",
            title: "Personal Trainer",
            intro: `Sculpting Bodies for 7 years.`,
            bio: `Certified personal trainer & Crossfit coach.<br/><br/>If you are looking to reach your dream body, definitely the call for diana.`,
            image: "/coaches_images/diana.webp"
        }
    ];

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
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Our Coaches</h1>
                    <p className="text-body-accent font-medium max-w-2xl mx-auto">
                        Expert guidance to help you smash your goals. Choose your mentor.
                    </p>
                </motion.div>

                {(() => {
                    const bassemPlans = products.filter(p => p.name.toLowerCase().includes('bassem') || p.name.toLowerCase().includes('coaching') || p.name.toLowerCase().includes('one-to-one'));
                    const otherPrograms = products.filter(p => !bassemPlans.includes(p));

                    return (
                        <>
                            {bassemPlans.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="mb-20 bg-gradient-to-br from-body-card to-black rounded-3xl p-8 md:p-12 border border-body-accent/20 shadow-[0_0_40px_rgba(255,100,42,0.1)] flex flex-col lg:flex-row gap-12"
                                >
                                    <div className="lg:w-1/3 flex flex-col items-center">
                                        <div className="relative w-full max-w-[350px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-body-accent/50 shadow-[0_0_30px_rgba(255,100,42,0.15)] bg-body-dark">
                                            <img src="/coaches_images/bassem.webp" alt="Coach Bassem" className="w-full h-full object-cover" />
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h2 className="text-4xl font-black text-white">COACH BASSEM</h2>
                                            <p className="text-body-accent font-bold tracking-widest uppercase text-sm mb-4">Head Trainer & Founder</p>
                                            <div className="flex justify-center gap-4">
                                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-body-accent transition-colors">
                                                    <Instagram className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-2/3 flex flex-col justify-center">
                                        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase leading-tight">
                                            Transform Your Physique Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-body-accent to-orange-500">Expert Guidance</span>
                                        </h3>
                                        <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed font-light">
                                            With over a decade of elite training experience, Coach Bassem has helped hundreds of athletes and beginners alike shatter their plateaus and build bodies they never thought possible. His evidence-based approach to hypertrophy, strength, and nutrition guarantees results.
                                        </p>
                                        <h4 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 uppercase tracking-widest text-body-muted">His Exclusive Programs</h4>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {bassemPlans.map(plan => (
                                                <div key={plan.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-body-accent hover:bg-body-accent/5 transition-all duration-300 flex flex-col group">
                                                    <h5 className="font-bold text-white text-xl mb-2">{plan.name}</h5>
                                                    <p className="text-gray-400 text-sm mb-4">Starts at 1 Session</p>
                                                    <p className="text-body-accent font-black text-2xl mb-6">AED 375.00</p>
                                                    <Button 
                                                        className="mt-auto bg-body-accent text-body-dark hover:bg-white w-full font-black uppercase tracking-wider"
                                                        onClick={() => openBooking('Bassem')}
                                                    >
                                                        <Calendar className="w-5 h-5 mr-2" /> Book Now
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {LOCAL_COACHES.length > 0 && (
                                <div className="mt-32 -mx-4 md:-mx-8 lg:-mx-32 bg-[#e5e5e5] pt-16 pb-24 px-4 md:px-8 lg:px-32">
                                    <h2 className="text-4xl font-black text-gray-900 mb-16 text-center uppercase tracking-tight">Our Elite Roster</h2>
                                    <div className="flex flex-col gap-12">
                                        {LOCAL_COACHES.map((coach, i) => (
                                            <motion.div
                                                key={coach.name}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                transition={{ duration: 0.6 }}
                                                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden rounded-md items-stretch min-h-[500px]`}
                                            >
                                                {/* Left (or Right) Image Side */}
                                                <div className="w-full md:w-1/2 relative bg-gray-900 h-96 md:h-auto shrink-0">
                                                    <img src={coach.image} alt={coach.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                                                </div>
                                                
                                                {/* Right (or Left) Text Side */}
                                                <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center text-center">
                                                    <p className="text-gray-500 font-bold tracking-widest text-xs uppercase mb-4">{coach.title}</p>
                                                    <h3 className="text-3xl lg:text-4xl font-black text-gray-800 uppercase mb-8">{coach.name}</h3>
                                                    
                                                    {coach.intro && (
                                                        <p className="text-gray-700 text-sm md:text-base leading-relaxed font-semibold mb-6" dangerouslySetInnerHTML={{ __html: coach.intro }} />
                                                    )}
                                                    
                                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium mb-10 max-w-sm mx-auto" dangerouslySetInnerHTML={{ __html: coach.bio }} />
                                                    
                                                    <div className="mt-auto">
                                                        <Button 
                                                            className="w-full max-w-xs mx-auto bg-gray-900 text-white hover:bg-body-accent hover:text-black flex items-center justify-center font-bold tracking-wider uppercase border border-transparent shadow-md"
                                                            onClick={() => openBooking(coach.name)}
                                                        >
                                                            <Calendar className="w-4 h-4 mr-2" /> Book {coach.name.split(' ')[0]}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}

                {/* Corporate / Group Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 bg-body-card rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-body-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="md:flex items-center justify-between gap-12 relative z-10">
                        <div className="flex-1 mb-8 md:mb-0">
                            <h2 className="text-4xl font-black text-white mb-4">Corporate Wellness</h2>
                            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                                Boost your team's productivity and health with our customized corporate programs.
                                We offer group sessions, health talks, and team building activities out of our premier facilities.
                            </p>
                            <Button size="xl" className="bg-body-accent text-body-dark hover:bg-white shadow-[0_0_20px_rgba(255,100,42,0.3)]">
                                Inquire Now
                            </Button>
                        </div>
                        <div className="flex-1 bg-black/50 h-72 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Corporate Wellness" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" />
                        </div>
                    </div>
                </motion.div>

                {/* The global booking modal for the page */}
                <BookingModal 
                    isOpen={isBookingModalOpen} 
                    onClose={() => setIsBookingModalOpen(false)} 
                    baseProduct={products[0]} 
                    initialCoach={selectedCoachForModal}
                />
            </div>
        </div>
    );
}
