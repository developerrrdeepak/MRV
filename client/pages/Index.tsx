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
  Star,
  Sparkles,
  Play,
  Phone,
  MessageCircle,
  Camera,
  Wifi,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector, { useLanguage } from "@/components/LanguageSelector";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function Index() {
  const { language, changeLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: Smartphone,
      title: "सरल मोबाइल ऐप",
      description: "आसान interface के साथ हिंदी में carbon farming track करें",
      color: "blue",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: IndianRupee,
      title: "कार्बन आय",
      description: "अपनी farming practices से carbon credits earn करें",
      color: "green",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      icon: TreePine,
      title: "पेड़ लगाएं",
      description: "Agroforestry projects में participate करें",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      icon: Wheat,
      title: "Rice Farming",
      description: "Rice cultivation में methane reduction से income पाएं",
      color: "amber",
      gradient: "from-amber-500 to-orange-400",
    },
    {
      icon: Shield,
      title: "सुरक्षित",
      description: "Blockchain technology से transparent payments",
      color: "purple",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      icon: Globe,
      title: "Global Market",
      description: "अपने carbon credits को international market में बेचें",
      color: "teal",
      gradient: "from-teal-500 to-cyan-400",
    },
  ];

  const benefits = [
    "प्रति एकड�� ₹5,000-15,000 अतिरिक्त आय",
    "Sustainable farming practices",
    "Government incentives के साथ support",
    "Free training और technical guidance",
    "Real-time income tracking",
    "Community support network",
  ];

  const stats = [
    {
      number: "1,46,000+",
      label: "किसान साझीदार",
      description: "भारत भर में",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      number: "₹50 करोड़+",
      label: "Carbon Income",
      description: "किसानों को मिली",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      number: "15+",
      label: "भाषाएं",
      description: "Local language support",
      icon: Languages,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      number: "24/7",
      label: "सहायता",
      description: "Customer support",
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "रजिस्ट्रेशन कर���ं",
      description: "अपने mobile से 2 मिनट में account बनाएं",
      icon: Phone,
      color: "from-green-400 to-emerald-500",
    },
    {
      step: "02", 
      title: "खेती की फोटो लें",
      description: "अपनी farming activities की photos upload करें",
      icon: Camera,
      color: "from-blue-400 to-cyan-500",
    },
    {
      step: "03",
      title: "Carbon Credits पाएं",
      description: "AI से calculate होकर credits मिलेंगे",
      icon: Award,
      color: "from-amber-400 to-orange-500",
    },
    {
      step: "04",
      title: "पैसे कमाएं",
      description: "Direct bank account में payment मिलेगी",
      icon: DollarSign,
      color: "from-purple-400 to-pink-500",
    },
  ];

  const testimonials = [
    {
      name: "राज कुमार शर्मा",
      location: "पंजाब",
      text: "मैंने पिछले साल ₹12,000 extra कमाए सिर्फ अपनी धान की खेती से!",
      rating: 5,
      image: "https://images.pexels.com/photos/6457626/pexels-photo-6457626.jpeg",
    },
    {
      name: "सुनीता देवी",
      location: "उत्तर प्रदेश", 
      text: "Carbon farming से हमारी आय दोगुनी हो गई। बहुत आसान है!",
      rating: 5,
      image: "https://images.pexels.com/photos/6457528/pexels-photo-6457528.jpeg",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Enhanced Hero Section with Background Images */}
      <section className="relative overflow-hidden py-16 lg:py-24 min-h-screen">
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Main Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg')`
            }}
          ></div>

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/90"></div>

          {/* Additional farming elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <img
              src="https://images.pexels.com/photos/20527463/pexels-photo-20527463.jpeg"
              alt="Farmer with wheat"
              className="absolute top-10 right-10 w-48 h-48 object-cover rounded-full opacity-20 animate-float"
            />
            <img
              src="https://images.pexels.com/photos/20527455/pexels-photo-20527455.jpeg"
              alt="Female farmer with vegetables"
              className="absolute bottom-20 left-10 w-56 h-56 object-cover rounded-full opacity-20 animate-float animation-delay-2000"
            />
            <img
              src="https://images.pexels.com/photos/7782861/pexels-photo-7782861.jpeg"
              alt="Seeds in hands"
              className="absolute top-1/2 left-1/4 w-40 h-40 object-cover rounded-full opacity-15 animate-float animation-delay-4000"
            />
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 text-6xl opacity-10 animate-float">🌾</div>
            <div className="absolute top-40 right-32 text-5xl opacity-15 animate-float animation-delay-2000">🚜</div>
            <div className="absolute bottom-40 right-20 text-4xl opacity-10 animate-float animation-delay-4000">🌱</div>
            <div className="absolute bottom-60 left-32 text-5xl opacity-15 animate-float">🌿</div>
            <div className="absolute top-60 left-1/2 text-3xl opacity-10 animate-float animation-delay-4000">🌍</div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Enhanced Badge */}
            <div className="mb-8 flex justify-center">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 text-lg px-8 py-4 font-bold tracking-wide shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full">
                <Sparkles className="mr-2 h-5 w-5" />
                🌱 Carbon Farming India - नया युग
              </Badge>
            </div>

            {/* Enhanced Hero Title */}
            <h1 className="text-6xl lg:text-7xl font-display font-black text-gray-900 leading-none mb-8">
              <span className="block text-green-600 mb-4">किसानों के लि��</span>
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent animate-pulse">
                Carbon Income
              </span>
              <span className="block text-4xl lg:text-5xl mt-4 text-gray-700 font-semibold">
                का नया रास्ता 🚀
              </span>
            </h1>

            {/* Enhanced Subtitle */}
            <div className="max-w-5xl mx-auto mb-12">
              <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-6 leading-relaxed">
                अप��ी farming practices से{" "}
                <span className="font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  carbon credits earn करें
                </span>{" "}
                और महीने में{" "}
                <span className="font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  ₹5,000-15,000 extra income
                </span>{" "}
                पाएं। सबसे आसान तरीका sustainable farming का।
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  100% सुरक्षित
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                  <Wifi className="h-4 w-4 text-blue-500 mr-2" />
                  ऑफलाइन भी काम करता है
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  किसानों द्वारा बनाया गया
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-xl bg-white/90 backdrop-blur-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-2"
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-4`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="stat-number text-3xl font-black mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="stat-label text-gray-900 mb-1 text-sm font-bold">
                        {stat.label}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 text-xl px-12 py-6 font-bold tracking-wide shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
              >
                <Play className="mr-3 h-6 w-6" />
                आज ही शुरू करें
                <ArrowRight className="ml-3 h-6 w-6 animate-bounce" />
              </Button>
              <Link to="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-xl px-12 py-6 font-semibold tracking-wide hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur"
                >
                  <Leaf className="mr-3 h-6 w-6" />
                  और जानें
                </Button>
              </Link>
            </div>

            {/* Enhanced Hero Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.pexels.com/photos/20527463/pexels-photo-20527463.jpeg"
                  alt="भारतीय महिला किसान गेहूं की फसल के साथ"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <p className="font-bold text-xl">पारंपरिक ज्ञान</p>
                  </div>
                  <p className="text-green-300 font-semibold">+ आधुनिक तकनीक = सफलता</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.pexels.com/photos/20527455/pexels-photo-20527455.jpeg"
                  alt="भारतीय महिला किसान हरी सब्जियों के साथ"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center mb-2">
                    <Heart className="h-5 w-5 text-pink-400 mr-2" />
                    <p className="font-bold text-xl">महिला किसान</p>
                  </div>
                  <p className="text-pink-300 font-semibold">बदलाव की मुख्य शक्ति</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.pexels.com/photos/7782861/pexels-photo-7782861.jpeg"
                  alt="हाथों में बीज - कृषि और विकास का प्रतीक"
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                    <p className="font-bold text-xl">बदलाव के बीज</p>
                  </div>
                  <p className="text-amber-300 font-semibold">भविष्य की खुशहाली</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 text-lg px-6 py-3 font-bold tracking-wide">
              <Zap className="mr-2 h-5 w-5" />
              कैस��� काम करता है?
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6">
              सिर्फ <span className="text-blue-600">4 आसान</span> स्टेप्स
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              हमारा AI-powered system आपकी farming को track करके automatic carbon credits calculate करता है
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center group">
                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200"></div>
                  )}
                  
                  <div className="relative">
                    <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-r ${step.color} text-white shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <span className="text-lg font-black text-gray-700">{step.step}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Language Selector Section */}
      <section className="py-16 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md max-w-4xl mx-auto overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                  <Languages className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  अपनी भाषा चुनें
                </h3>
              </div>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                हम <span className="font-bold text-green-600">15+ भारतीय भाषाओं</span> में support करते हैं।
                किसानों के लिए - अपनी सुविधाजनक भाषा में जानकारी पाएं
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                <LanguageSelector
                  selectedLanguage={language}
                  onLanguageChange={changeLanguage}
                  showModal={showLanguageModal}
                  onModalChange={setShowLanguageModal}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-lg px-6 py-3 font-bold tracking-wide">
              <Star className="mr-2 h-5 w-5" />
              खासियतें
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6">
              क्यों चुनें <span className="text-emerald-600">Carbon Roots?</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-white hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 text-lg px-6 py-3 font-bold tracking-wide">
              <Heart className="mr-2 h-5 w-5" />
              किसानों की राय
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-6">
              सफलता की <span className="text-green-300">कहानियां</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-2xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-green-300"
                    />
                    <div>
                      <h4 className="text-xl font-bold">{testimonial.name}</h4>
                      <p className="text-green-300">{testimonial.location}</p>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg italic leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700 hover:bg-green-200 text-lg px-6 py-3 font-bold tracking-wide">
              <TrendingUp className="mr-2 h-5 w-5" />
              फायदे
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6">
              आपको <span className="text-green-600">क्या मिलेगा?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-l-4 border-green-500"
              >
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-gray-800 font-semibold">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl lg:text-6xl font-display font-black mb-8">
            तैयार हैं <span className="text-yellow-300">कमाने के लिए?</span>
          </h2>
          <p className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
            आज ही join करें और अपनी farming को profitable बनाएं।
            हजारों किसान पहले से ही कमा रहे हैं!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-green-600 hover:bg-gray-100 text-2xl px-16 py-8 font-bold tracking-wide shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
            >
              <Sparkles className="mr-4 h-8 w-8" />
              अभी शुरू करें
              <ArrowRight className="ml-4 h-8 w-8 animate-bounce" />
            </Button>
            
            <div className="text-center">
              <p className="text-yellow-200 text-lg font-semibold mb-2">
                📞 तुरंत सहायता चाहिए?
              </p>
              <p className="text-2xl font-bold">
                1800-CARBON-HELP
              </p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
