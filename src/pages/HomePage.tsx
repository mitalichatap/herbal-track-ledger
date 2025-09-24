import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Shield, Eye, Smartphone, QrCode, MapPin, Users, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/hero-ayutrace.jpg';
import supplyChainImage from '@/assets/supply-chain.jpg';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-6xl font-bold mb-6">
              AYURCHAIN
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Blockchain-powered traceability for Ayurvedic herbal supply chains
            </p>
            <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto">
              Track herbs from harvest to consumer with immutable records, GPS tracking, 
              and complete transparency in the Ayurvedic medicine supply chain.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/scanner">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <QrCode className="mr-2 h-5 w-5" />
                  Scan QR Code
                </Button>
              </Link>
              <Link to="/consumer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Consumer Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete Supply Chain Transparency
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From harvest to final product, every step is recorded on the blockchain
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-medium transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">End-to-End Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Track herbs from harvest to final product with immutable blockchain records and GPS tracking
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-success">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Automated quality validations and lab certificate verification at every step
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-accent-foreground">Full Transparency</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Complete visibility into sourcing, processing, and distribution for consumers
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-warning" />
                </div>
                <CardTitle className="text-warning">Consumer Access</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Scan QR codes to access complete product history and authenticity verification
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supply Chain Visualization */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Blockchain-Secured Supply Chain
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Every transaction, from harvest to final sale, is recorded on an immutable 
                blockchain ledger, ensuring complete traceability and preventing counterfeiting.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>GPS-tracked harvest locations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-success" />
                  <span>Quality testing at every stage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-accent-foreground" />
                  <span>Verified processor credentials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-warning" />
                  <span>Real-time analytics and reporting</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={supplyChainImage} 
                alt="Herbal supply chain visualization" 
                className="rounded-lg shadow-strong w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Links */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">
            Access Portals
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Choose your role to access the appropriate dashboard
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link to="/collector" className="group">
              <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer bg-primary/5 border-primary/20 group-hover:border-primary/40">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Collector Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Record harvest events with GPS tracking and initial quality assessments
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/processor" className="group">
              <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer bg-accent/10 border-accent/30 group-hover:border-accent/50">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-all">
                    <Shield className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-accent-foreground">Processor Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Manage processing steps, quality testing, and generate QR codes
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin" className="group">
              <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer bg-warning/10 border-warning/30 group-hover:border-warning/50">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/30 transition-all">
                    <BarChart3 className="h-8 w-8 text-warning" />
                  </div>
                  <CardTitle className="text-warning">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Network management, analytics, and compliance reporting
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;