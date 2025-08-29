import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TreePine,
  Wheat,
  Smartphone,
  Shield,
  ArrowRight,
  CheckCircle,
  MapPin,
  IndianRupee,
  Globe,
  Mic,
  CreditCard,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  Languages,
  Leaf,
  Zap,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector, { useLanguage } from "@/components/LanguageSelector";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Index() {
  const { language, changeLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Features section parallax
  const featuresY = useTransform(scrollY, [300, 800], [0, -100]);
  const featuresOpacity = useTransform(scrollY, [300, 800], [0.3, 1]);

  const features = [
    {
      icon: Smartphone,
      title: "सरल मोबाइल ऐप",
      description: "��सान interface के साथ हिंदी में carbon farming track कर��ं",
      color: "blue",
    },
    {
      icon: IndianRupee,
      title: "कार्बन आय",
      description: "अपनी farming practices से carbon credits earn करें",
      color: "green",
    },
    {
      icon: TreePine,
      title: "पेड़ लगाएं",
      description: "Agroforestry projects में participate करे��",
      color: "emerald",
    },
    {
      icon: Wheat,
      title: "Rice Farming",
      description: "Rice cultivation में methane reduction से income पाएं",
      color: "amber",
    },
    {
      icon: Shield,
      title: "सुरक्षित",
      description: "Blockchain technology से transparent payments",
      color: "purple",
    },
    {
      icon: Globe,
      title: "Global Market",
      description: "अपने carbon credits को international market में बेचें",
      color: "teal",
    },
  ];

  const benefits = [
    "प्रति एकड़ ₹5,000-15,000 अतिरिक्त आय",
    "Sustainable farming practices",
    "Government incentives के साथ support",
    "Free training औ��� technical guidance",
    "Real-time income tracking",
    "Community support network",
  ];

  const stats = [
    {
      number: "1,46,000+",
      label: "किसान साझीदार",
      description: "भारत भर में",
    },
    {
      number: "₹5 करोड",
      label: "Carbon Income",
      description: "किसानों को मिली",
    },
    {
      number: "15+",
      label: "भाषाएं",
      description: "Local language support",
    },
    {
      number: "24/7",
      label: "सहायता",
      description: "Customer support",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 min-h-screen">
        {/* Parallax Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2909065/pexels-photo-2909065.jpeg')`,
            y: heroY,
            scale: heroScale,
          }}
        ></motion.div>

        {/* Animated Overlay Gradients */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-green-800/40 to-teal-900/35"
          style={{ opacity: heroOpacity }}
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/50 to-transparent"></div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-300/30 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-emerald-100/90 to-teal-100/90 text-emerald-800 hover:from-emerald-200/90 hover:to-teal-200/90 text-lg px-8 py-4 font-bold tracking-wide shadow-2xl border border-emerald-200/50 backdrop-blur-sm">
                🌱 Carbon Farming India - AI Powered
              </Badge>
            </motion.div>
            <motion.h1
              className="text-hero font-display font-black text-gray-900 leading-none mb-8"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
              }}
            >
              <motion.span
                className="text-green-600 inline-block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                किसानों&nbsp; के&nbsp;लिए
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                Carbon Income
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                का नया&nbsp;रास्ता
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-subtitle text-gray-700 font-medium mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              अपनी farming practices से&nbsp;{" "}
              <motion.span
                className="font-bold text-emerald-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                whileHover={{ scale: 1.05, color: "#059669" }}
              >
                carbon credits earn करें&nbsp;
              </motion.span>{" "}
              और महीने में{" "}
              <motion.span
                className="font-bold text-amber-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                whileHover={{ scale: 1.1 }}
              >
                &nbsp; ₹5,000-15,000&nbsp; &nbsp; &nbsp; &nbsp;
                <br />
                &nbsp;extra income&nbsp; &nbsp;
              </motion.span>{" "}
              पाएं। सबसे आसान&nbsp;
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="grid md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 2 + index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-100/95 to-teal-100/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:from-emerald-200/95 hover:to-teal-200/95 group overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                    <CardContent className="p-4 text-center relative z-10">
                      <motion.div
                        className="stat-number text-3xl text-emerald-600 mb-1"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="stat-label text-gray-900 mb-1 text-sm font-bold">
                        {stat.label}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Language Selector */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-2 border-green-200/50 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 backdrop-blur-md max-w-2xl mx-auto shadow-2xl overflow-hidden relative">
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div
                      className="flex items-center justify-center space-x-2 mb-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <Languages className="h-5 w-5 text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-green-800">
                        अपनी भाषा चुनें / Choose Your Language
                      </h3>
                    </motion.div>
                    <motion.p
                      className="text-green-700 mb-4 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8 }}
                    >
                      किसानों के लिए - अपनी सुविधाजनक भाषा में जानकारी पाएं
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3 }}
                    >
                      <LanguageSelector
                        selectedLanguage={language}
                        onLanguageChange={changeLanguage}
                        showModal={showLanguageModal}
                        onModalChange={setShowLanguageModal}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-700 hover:via-emerald-700 hover:to-green-700 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">आज ही शुरू करें</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="relative z-10"
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <Link to="/solutions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-teal-600/70 text-teal-600 hover:bg-gradient-to-r hover:from-teal-100/90 hover:to-emerald-100/90 text-lg px-8 font-semibold tracking-wide hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 hover:border-teal-500"
                  >
                    और जानें
                  </Button>
                </motion.div>
              </Link>
              <Link to="/estimator">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-emerald-600/70 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100/90 hover:to-teal-100/90 text-lg px-8 font-semibold tracking-wide hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 hover:border-emerald-500"
                  >
                    Carbon Estimator
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Hero Images - Modern AI Generated */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.5 }}
            >
              {[
                {
                  src: "https://images.pexels.com/photos/7299994/pexels-photo-7299994.jpeg",
                  alt: "Sustainable greenhouse farming with modern technology",
                  title: "स्मार्ट फार्मिंग",
                  subtitle: "आधुनिक तकनीक से खेती",
                  badge: "AI Powered",
                  gradientFrom: "emerald-900/90",
                  gradientVia: "emerald-500/30",
                  badgeColor: "emerald-500/90",
                },
                {
                  src: "https://images.pexels.com/photos/28270760/pexels-photo-28270760.jpeg",
                  alt: "Technology-enabled farming in green paddy fields",
                  title: "डिजि���ल कृ��ि",
                  subtitle: "तकनीक से बेहतर फसल",
                  badge: "Carbon Income",
                  gradientFrom: "green-900/90",
                  gradientVia: "green-500/30",
                  badgeColor: "green-500/90",
                },
                {
                  src: "https://images.pexels.com/photos/9799712/pexels-photo-9799712.jpeg",
                  alt: "Solar panels showcasing renewable energy and sustainability",
                  title: "नवीकरणीय ऊर्जा",
                  subtitle: "सस्टेनेबल भविष्य",
                  badge: "Green Tech",
                  gradientFrom: "blue-900/90",
                  gradientVia: "blue-500/30",
                  badgeColor: "blue-500/90",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 3.7 + index * 0.2,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                >
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                  <motion.img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-72 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-${item.gradientFrom} via-${item.gradientVia} to-transparent`}
                  ></div>

                  {/* Content overlay */}
                  <motion.div
                    className="absolute bottom-6 left-6 text-white z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4 + index * 0.2 }}
                  >
                    <motion.p
                      className="font-bold text-xl mb-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.title}
                    </motion.p>
                    <p className="text-sm opacity-90 font-medium">
                      {item.subtitle}
                    </p>
                  </motion.div>

                  <motion.div
                    className="absolute top-4 right-4 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 4.2 + index * 0.2 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge
                      className={`bg-${item.badgeColor} text-white border-0 backdrop-blur-sm shadow-lg`}
                    >
                      {item.badge}
                    </Badge>
                  </motion.div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{ width: "50%" }}
                  ></motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg')`,
            y: featuresY,
          }}
        ></motion.div>

        {/* Animated Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-emerald-200/40 rounded-full"
              animate={{
                y: [0, -80, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Enhanced Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 via-white/90 to-green-50/95"
          style={{ opacity: featuresOpacity }}
        ></motion.div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              क्यों चुनें{" "}
              <span className="text-emerald-600">Carbon Farming?</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              आसान, फायदेमंद, और पर्यावरण केलिए बेहतर
            </p>
          </div>
          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-gradient-to-br from-white/95 via-emerald-50/20 to-emerald-50/95 backdrop-blur-md h-full relative overflow-hidden">
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-emerald-200 to-teal-200"></div>

                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-transparent to-teal-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                  <CardHeader className="relative z-10">
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                    >
                      <feature.icon
                        className={`h-10 w-10 text-${feature.color}-600`}
                      />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 font-medium leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-bl-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1605270/pexels-photo-1605270.jpeg')`,
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/90 via-emerald-50/85 to-green-50/90"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
                <span className="text-emerald-600">फायदे</span> जो आपको मिलेंगे
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                Carbon farming से न केवल आपकी आय बढ़ेगी, बल्कि पर्यावरण भी बेहतर
                होगा।
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-lg">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  अभी Registration करें
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-200 to-teal-200 rounded-3xl p-8">
                <div className="h-full bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center text-center">
                  <TrendingUp className="h-20 w-20 text-emerald-600 mb-6" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    ₹12,000
                  </h3>
                  <p className="text-lg text-gray-600 font-medium">
                    औसत मास��क अतिर��क्त आ���
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold mt-2">
                    प्र���ि एकड़ carbon farming से
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Sustainability Showcase */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2909065/pexels-photo-2909065.jpeg')`,
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-teal-50/90 to-emerald-50/95"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                भविष्��� की तकनीक
              </span>{" "}
              <br />
              आज ही अपना��ं
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              AI और IOT से जुड़ी आधुनिक तकनीक के ���ाथ carbon farming करें
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-gradient-to-r from-teal-100 to-emerald-100 hover:shadow-2xl transition-all duration-300 hover:from-teal-200 hover:to-emerald-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      AI-Powered Monitoring
                    </h3>
                  </div>
                  <p className="text-gray-700 font-medium">
                    रियल-टाइम monitoring से अपनी carbon credits track करें और
                    optimized farming ���रे��
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-100 to-green-100 hover:shadow-2xl transition-all duration-300 hover:from-emerald-200 hover:to-green-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Smart Analytics
                    </h3>
                  </div>
                  <p className="text-gray-700 font-medium">
                    Advanced analytics से बेहतर yield और higher carbon income
                    पाएं
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <img
                    src="https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg"
                    alt="AI technology illustration for smart farming"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-sm">AI Technology</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 mt-8">
                  <img
                    src="https://images.pexels.com/photos/17827016/pexels-photo-17827016.jpeg"
                    alt="Wind turbine in green landscape for sustainable energy"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-sm">Green Energy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Enhanced gradient background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-emerald-600 to-green-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-teal-500/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/10 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.h2
            className="text-4xl lg:text-6xl font-display font-black text-white mb-8 leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent bg-[length:200%_100%]"
            >
              शुरू करने के लिए तैयार हैं?
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl text-green-100 font-medium max-w-3xl mx-auto mb-12 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            आज ही carbon farming की शुरुआत करें और sustainable income पाना शुरू
            कर���ं
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-teal-900 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-xl px-10 py-4 font-bold tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group border-2 border-yellow-300/50"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">अभी Sign Up करें</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="relative z-10"
                >
                  <ArrowRight className="ml-3 h-6 w-6" />
                </motion.div>
              </Button>
            </motion.div>

            <Link to="/about-us">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/80 text-white hover:bg-white/20 hover:border-white text-xl px-10 py-4 font-semibold tracking-wide hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/10"
                >
                  हमारे बारे में जानें
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
