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
    "Free training और technical guidance",
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
      number: "₹50 करोड���+",
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
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2909065/pexels-photo-2909065.jpeg')`
          }}
        ></div>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-800/30 to-teal-900/25"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/40 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 hover:from-emerald-200 hover:to-teal-200 text-lg px-8 py-4 font-bold tracking-wide shadow-xl border border-emerald-200">
              🌱 Carbon Farming India - AI Powered
            </Badge>
            <h1 className="text-hero font-display font-black text-gray-900 leading-none mb-8">
              <span className="text-green-600">किसानों&nbsp; &nbsp;लिए</span> <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Carbon Income
              </span>{" "}
              का नया&nbsp;रास्ता
            </h1>
            <p className="text-subtitle text-gray-700 font-medium mb-8 max-w-4xl mx-auto">
              अपनी farming practices से&nbsp;{" "}
              <span className="font-bold text-emerald-600">
                carbon credits earn करें&nbsp;
              </span>{" "}
              और महीने में{" "}
              <span className="font-bold text-amber-600">
                &nbsp; ₹5,000-15,000&nbsp; &nbsp; &nbsp; &nbsp;
                <br />
                &nbsp;extra income&nbsp; &nbsp;
              </span>{" "}
              पाएं। सबसे आसान&nbsp;
            </p>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-gradient-to-br from-emerald-100/95 to-teal-100/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:from-emerald-200/95 hover:to-teal-200/95"
                >
                  <CardContent className="p-4 text-center">
                    <div className="stat-number text-3xl text-emerald-600 mb-1">
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
              ))}
            </div>

            {/* Language Selector */}
            <div className="mb-8">
              <Card className="border-2 border-green-200 bg-green-50/80 backdrop-blur max-w-2xl mx-auto">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Languages className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-bold text-green-800">
                      अपनी भाषा चुनें / Choose Your Language
                    </h3>
                  </div>
                  <p className="text-green-700 mb-4 text-sm">
                    किसानों के लिए - अपनी सुविधाजन��� भाषा में जानकारी पाएं
                  </p>
                  <LanguageSelector
                    selectedLanguage={language}
                    onLanguageChange={changeLanguage}
                    showModal={showLanguageModal}
                    onModalChange={setShowLanguageModal}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-700 hover:via-emerald-700 hover:to-green-700 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                आज ही शुरू करें
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-gradient-to-r hover:from-teal-100 hover:to-emerald-100 text-lg px-8 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
                >
                  और जानें
                </Button>
              </Link>
            </div>

            {/* Hero Images - Modern AI Generated */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 group">
                <img
                  src="https://images.pexels.com/photos/7299994/pexels-photo-7299994.jpeg"
                  alt="Sustainable greenhouse farming with modern technology"
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-500/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-xl mb-1">स्मार्ट फार्मिंग</p>
                  <p className="text-sm opacity-90 font-medium">
                    आधुनिक तकनीक से खेती
                  </p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500/90 text-white border-0">
                    AI Powered
                  </Badge>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 group">
                <img
                  src="https://images.pexels.com/photos/28270760/pexels-photo-28270760.jpeg"
                  alt="Technology-enabled farming in green paddy fields"
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-500/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-xl mb-1">डिजिटल कृषि</p>
                  <p className="text-sm opacity-90 font-medium">
                    तकनी�� से बेहतर फसल
                  </p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500/90 text-white border-0">
                    Carbon Income
                  </Badge>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 group">
                <img
                  src="https://images.pexels.com/photos/9799712/pexels-photo-9799712.jpeg"
                  alt="Solar panels showcasing renewable energy and sustainability"
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-500/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-xl mb-1">नवीकरणीय ऊर्जा</p>
                  <p className="text-sm opacity-90 font-medium">
                    सस्टेनेबल भविष्य
                  </p>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500/90 text-white border-0">
                    Green Tech
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/95 via-white/90 to-green-50/95"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              क्यों चुनें{" "}
              <span className="text-emerald-600">Carbon Farming?</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              आसान, फायदेमंद, और पर्यावरण के लिए बेहतर
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-sm"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon
                      className={`h-8 w-8 text-${feature.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-medium leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1605270/pexels-photo-1605270.jpeg')`
          }}
        ></div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/90 via-emerald-50/85 to-green-50/90"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                    औसत मास��क अतिर��क्त आय
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold mt-2">
                    प्र��ि एकड़ carbon farming से
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Sustainability Showcase */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                भविष्��� की तकनीक
              </span>{" "}
              <br />
              आज ही अपनाएं
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              AI और IOT स��� जुड़ी आधुनिक तकनीक के ���ाथ carbon farming करें
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
                    optimized farming ���रें
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
      <section className="py-20 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-tight">
            शुरू करने के लिए त��यार हैं?
          </h2>
          <p className="text-xl text-green-100 font-medium max-w-3xl mx-auto mb-8">
            आज ही carbon farming की शुरुआत करें और sustainable income पाना शुरू
            करें
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-amber-400 to-yellow-400 text-teal-800 hover:from-amber-500 hover:to-yellow-500 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              अभी Sign Up करें
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/about-us">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
              >
                हमारे बारे में जानें
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
