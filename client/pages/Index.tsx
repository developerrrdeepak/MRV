import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TreePine,
  Wheat,
  Satellite,
  Smartphone,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  MapPin,
  Target,
  Database,
  Cpu,
  Activity,
  Network,
  GitBranch,
  Eye,
  AlertTriangle,
  IndianRupee,
  Globe,
  Mic,
  WifiOff,
  CreditCard,
  Users,
  Award,
  BarChart3,
  TrendingUp,
  Languages,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const hackathonChallenges = [
    {
      icon: TreePine,
      title: "Agroforestry MRV Gap",
      description:
        "Complex carbon sequestration measurement across fragmented smallholder farms",
      impact: "Critical",
      affected: "146 million farmers in India",
      color: "green",
    },
    {
      icon: Wheat,
      title: "Rice Methane Emissions",
      description:
        "Lack of affordable monitoring for rice-based carbon reduction projects",
      impact: "High",
      affected: "44 million hectares rice cultivation",
      color: "amber",
    },
    {
      icon: Eye,
      title: "Transparency & Trust",
      description:
        "Farmers can't track their carbon impact or earnings in real-time",
      impact: "Medium",
      affected: "89% smallholder farmers",
      color: "blue",
    },
  ];

  const mrv4allFeatures = [
    {
      icon: Smartphone,
      title: "Farmer-Friendly Mobile App",
      subtitle: "Voice + Local Language Interface",
      description:
        "Mobile app in Hindi + 15 regional languages with voice-based input for low literacy farmers. Works offline and syncs when connected.",
      features: [
        "Voice commands in local languages",
        "Offline data collection mode",
        "Simple photo-based reporting",
        "UPI-linked carbon wallet",
      ],
      tech: ["Flutter", "Speech Recognition", "Offline SQLite", "UPI SDK"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Satellite,
      title: "Remote Sensing & AI Pipeline",
      subtitle: "Google Earth Engine + ML Models",
      description:
        "Satellite imagery from Sentinel/Planet Labs combined with drone data for automated biomass estimation and rice methane tracking.",
      features: [
        "Google Earth Engine integration",
        "TensorFlow crop modeling",
        "Automated yield estimation",
        "Real-time emission tracking",
      ],
      tech: ["Google Earth Engine", "TensorFlow", "PyTorch", "Planet Labs API"],
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: GitBranch,
      title: "Blockchain Carbon Registry",
      subtitle: "Transparent + Interoperable Credits",
      description:
        "Hyperledger-based transparent reporting ledger with integration to Verra, Gold Standard, and Indian carbon registries.",
      features: [
        "Immutable carbon credit tracking",
        "Smart contract automation",
        "Multi-registry integration",
        "Transparent verification",
      ],
      tech: ["Hyperledger", "Polygon", "Smart Contracts", "IPFS"],
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const targetUsers = [
    {
      icon: Users,
      title: "Primary: Indian Smallholders",
      description: "1-3 acre farmers across India",
      count: "146M farmers",
      color: "emerald",
    },
    {
      icon: Network,
      title: "Secondary: FPOs & NGOs",
      description: "Farmer Producer Organizations & agri-enterprises",
      count: "7,000+ FPOs",
      color: "blue",
    },
    {
      icon: Globe,
      title: "Global: Smallholder Landscapes",
      description: "Africa, Southeast Asia, Latin America",
      count: "500M+ farmers",
      color: "amber",
    },
  ];

  const techStack = [
    {
      name: "Google Earth Engine",
      category: "Remote Sensing",
      usage: "Satellite data processing",
    },
    {
      name: "TensorFlow/PyTorch",
      category: "AI/ML",
      usage: "Crop & emission modeling",
    },
    {
      name: "Hyperledger/Polygon",
      category: "Blockchain",
      usage: "Transparent credit ledger",
    },
    {
      name: "Flutter/React Native",
      category: "Mobile",
      usage: "Multilingual farmer apps",
    },
    {
      name: "IoT Sensors",
      category: "Hardware",
      usage: "Low-cost methane monitoring",
    },
    {
      name: "OpenMRV/ISO 14064",
      category: "Standards",
      usage: "Global interoperability",
    },
  ];

  const outcomes = [
    "Automated carbon credit calculation & verification",
    "Farmer-friendly data collection in local languages",
    "Integration with global carbon registries",
    "Scalable solution for 1-3 acre smallholder farms",
    "Real-time transparent earnings dashboard",
    "Low-cost IoT sensors for rice methane monitoring",
    "Open APIs for agri-platform integration",
    "Blockchain-based transparent reporting",
  ];

  const hackathonMetrics = [
    {
      label: "Target Farmers",
      value: "146M",
      description: "Indian smallholders (1-3 acres)",
    },
    {
      label: "Carbon Potential",
      value: "50Mt",
      description: "CO2e annually from agroforestry",
    },
    {
      label: "Tech Stack",
      value: "6+",
      description: "Cutting-edge technologies",
    },
    {
      label: "Global Reach",
      value: "500M",
      description: "Smallholder farmers worldwide",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section - Hackathon Theme */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-amber-500/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 text-lg px-6 py-3 font-bold tracking-wide shadow-lg">
              🏆 Kisan CarbonTech Challenge - MRV4All Hackathon
            </Badge>
            <h1 className="text-hero font-display font-black text-gray-900 leading-none mb-8">
              <span className="text-green-600">Scalable MRV Solutions</span> <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
                Agroforestry & Rice Carbon Projects
              </span>
            </h1>
            <p className="text-subtitle text-gray-700 font-medium mb-8 max-w-4xl mx-auto">
              Identifying{" "}
              <span className="font-bold text-emerald-600">
                scalable and affordable MRV prototypes with high accuracy
              </span>{" "}
              that facilitate automated carbon credit calculation, verification, and reporting
              for agroforestry and rice-based carbon projects across India's{" "}
              <span className="font-bold text-amber-600">
                smallholder-dominated landscapes.
              </span>
            </p>

            {/* Key Challenge Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto">
              {hackathonMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur"
                >
                  <CardContent className="p-4 text-center">
                    <div className="stat-number text-3xl text-emerald-600 mb-1">
                      {metric.value}
                    </div>
                    <div className="stat-label text-gray-900 mb-1 text-sm">
                      {metric.label}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                View MRV Prototype
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
              >
                Join Hackathon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Overview */}
      <section className="py-20 bg-red-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              The <span className="text-red-600">MRV Challenge</span> 🎯
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              Current MRV systems are expensive, complex, and poorly adapted to
              India's smallholder-dominated landscapes
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {hackathonChallenges.map((challenge, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-16 h-16 bg-${challenge.color}-100 rounded-xl flex items-center justify-center`}
                    >
                      <challenge.icon
                        className={`h-8 w-8 text-${challenge.color}-600`}
                      />
                    </div>
                    <Badge
                      variant={
                        challenge.impact === "Critical"
                          ? "destructive"
                          : challenge.impact === "High"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {challenge.impact}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {challenge.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 font-medium leading-relaxed text-lg">
                    {challenge.description}
                  </p>
                  <div className={`bg-${challenge.color}-50 p-4 rounded-lg`}>
                    <p className={`text-${challenge.color}-800 font-bold`}>
                      {challenge.affected}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MRV4All Solution Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              <span className="text-emerald-600">MRV4All</span> Solution
              Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Comprehensive tech stack designed specifically for smallholder
              farmers with global scalability
            </p>
          </div>

          <div className="space-y-12">
            {mrv4allFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <feature.icon className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-display font-bold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-emerald-600 font-bold text-lg tracking-wide">
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-8 text-xl leading-relaxed font-medium">
                      {feature.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Key Features
                        </h4>
                        <div className="space-y-3">
                          {feature.features.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-start space-x-3"
                            >
                              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 font-medium">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Technology Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {feature.tech.map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="outline"
                              className="border-emerald-600 text-emerald-600 font-semibold"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-8 flex items-center">
                    <div className="w-full">
                      <h4 className="text-white font-bold mb-4 text-lg">
                        Implementation
                      </h4>
                      <div className="font-mono text-sm space-y-2">
                        <div className="text-green-400">
                          # {feature.title} Pipeline
                        </div>
                        <div className="text-white">
                          farmer_data = mobile_app.collect()
                        </div>
                        <div className="text-blue-400">
                          satellite_data = earth_engine.fetch()
                        </div>
                        <div className="text-yellow-400">
                          ai_analysis = model.predict(data)
                        </div>
                        <div className="text-purple-400">
                          carbon_credits = calculate(analysis)
                        </div>
                        <div className="text-green-300">
                          blockchain.verify_and_pay(farmer)
                        </div>
                        <div className="text-gray-400 mt-4">
                          # Real-time processing
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              Target <span className="text-emerald-600">Users</span> 🌍
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              From Indian smallholders to global farming communities
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {targetUsers.map((user, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl text-center hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-20 h-20 bg-${user.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <user.icon className={`h-10 w-10 text-${user.color}-600`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {user.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">
                    {user.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`bg-${user.color}-50 p-4 rounded-lg`}>
                    <div
                      className={`text-3xl font-bold text-${user.color}-600 mb-2`}
                    >
                      {user.count}
                    </div>
                    <div className={`text-${user.color}-700 font-semibold`}>
                      Impact Scale
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-gray-900 mb-6 leading-tight">
              Technology <span className="text-emerald-600">Stack</span> 🛠️
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Cutting-edge tools for scalable MRV implementation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {tech.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {tech.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 font-medium">{tech.usage}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-tight">
              Hackathon <span className="text-yellow-300">Outcomes</span> 🎯
            </h2>
            <p className="text-xl text-green-100 font-medium max-w-3xl mx-auto">
              Expected deliverables from the MRV4All prototype development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white/10 backdrop-blur rounded-lg p-6"
              >
                <CheckCircle className="h-6 w-6 text-yellow-300 mt-1 flex-shrink-0" />
                <span className="text-white font-medium text-lg">
                  {outcome}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-white mb-6">
              Ready to Build the Future of Carbon Farming?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-green-50 text-lg px-8 font-bold tracking-wide shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                View MRV Prototype
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 font-semibold tracking-wide hover:shadow-lg transition-all duration-200"
              >
                Download Tech Specs
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
