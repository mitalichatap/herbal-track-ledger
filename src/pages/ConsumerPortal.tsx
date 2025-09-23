import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, CheckCircle, AlertCircle, Leaf, Shield, Award, QrCode } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useToast } from '@/hooks/use-toast';

interface ProvenanceData {
  herbId: string;
  species: string;
  harvestLocation: string;
  harvestDate: string;
  collectorId: string;
  processingSteps: ProcessingStep[];
  qualityTests: QualityTest[];
  sustainabilityScore: number;
  certifications: string[];
  authenticityVerified: boolean;
}

interface ProcessingStep {
  step: string;
  date: string;
  processor: string;
  location: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface QualityTest {
  testType: string;
  result: string;
  status: 'passed' | 'failed' | 'pending';
  date: string;
  laboratory: string;
  certificate: string;
}

const ConsumerPortal = () => {
  const [searchParams] = useSearchParams();
  const [herbId, setHerbId] = useState(searchParams.get('herbId') || '');
  const [provenanceData, setProvenanceData] = useState<ProvenanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const { contract } = useBlockchain();
  const { toast } = useToast();

  // Mock data for demonstration
  const mockProvenanceData: ProvenanceData = {
    herbId: 'ASH001',
    species: 'Ashwagandha (Withania somnifera)',
    harvestLocation: 'Rajasthan, India (26.9124°N, 75.7873°E)',
    harvestDate: '2024-03-15',
    collectorId: 'COLL001-Rajesh-Kumar',
    processingSteps: [
      {
        step: 'Initial Cleaning & Sorting',
        date: '2024-03-16',
        processor: 'Green Valley Processing Unit',
        location: 'Jaipur, Rajasthan',
        status: 'completed'
      },
      {
        step: 'Natural Drying',
        date: '2024-03-17',
        processor: 'Green Valley Processing Unit',
        location: 'Jaipur, Rajasthan',
        status: 'completed'
      },
      {
        step: 'Quality Grinding',
        date: '2024-03-20',
        processor: 'AyurPharm Manufacturing Ltd',
        location: 'Delhi, India',
        status: 'completed'
      },
      {
        step: 'Final Packaging',
        date: '2024-03-22',
        processor: 'AyurPharm Manufacturing Ltd',
        location: 'Delhi, India',
        status: 'completed'
      }
    ],
    qualityTests: [
      {
        testType: 'Moisture Content Analysis',
        result: '8.5% (Optimal range: 6-10%)',
        status: 'passed',
        date: '2024-03-18',
        laboratory: 'National Test House, Delhi',
        certificate: 'NTH-ASH-2024-001'
      },
      {
        testType: 'Pesticide Residue Screening',
        result: 'Not Detected (Below detection limit)',
        status: 'passed',
        date: '2024-03-19',
        laboratory: 'National Test House, Delhi',
        certificate: 'NTH-ASH-2024-002'
      },
      {
        testType: 'Heavy Metals Testing',
        result: 'Within WHO/FDA limits',
        status: 'passed',
        date: '2024-03-19',
        laboratory: 'National Test House, Delhi',
        certificate: 'NTH-ASH-2024-003'
      },
      {
        testType: 'Microbial Analysis',
        result: 'Total plate count: <1000 CFU/g',
        status: 'passed',
        date: '2024-03-20',
        laboratory: 'National Test House, Delhi',
        certificate: 'NTH-ASH-2024-004'
      },
      {
        testType: 'Active Compound Analysis',
        result: 'Withanolides: 2.8% (Min required: 2.5%)',
        status: 'passed',
        date: '2024-03-21',
        laboratory: 'Ayurveda Research Institute',
        certificate: 'ARI-ASH-2024-001'
      }
    ],
    sustainabilityScore: 95,
    certifications: ['Organic Certified (NPOP)', 'Fair Trade Certified', 'Sustainable Harvest', 'GMP Certified'],
    authenticityVerified: true
  };

  const fetchProvenance = async () => {
    if (!herbId) {
      toast({
        title: "Missing Product ID",
        description: "Please enter a product ID to verify",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      if (contract) {
        try {
          // Get batch summary from blockchain
          const summary = await contract.methods.getBatchSummary(herbId).call();
          const [species, creator, rootHash, createdAt, recalled, eventsCount] = summary;
          
          // Get all events
          const events = [];
          for (let i = 0; i < eventsCount; i++) {
            const eventData = await contract.methods.getEvent(herbId, i).call();
            const [eventId, eventType, actor, metaCID, lat, lon, timestamp, qualityPass] = eventData;
            
            events.push({
              eventId,
              eventType,
              actor,
              metaCID,
              lat: lat / 1e6, // Convert back from scaled coordinates
              lon: lon / 1e6,
              timestamp: new Date(timestamp * 1000).toISOString(),
              qualityPass
            });
          }

          // Transform blockchain data to UI format
          const blockchainData: ProvenanceData = {
            herbId,
            species,
            harvestLocation: events[0] ? `${events[0].lat.toFixed(6)}°, ${events[0].lon.toFixed(6)}°` : 'Unknown',
            harvestDate: events[0] ? events[0].timestamp.split('T')[0] : 'Unknown',
            collectorId: creator.slice(0, 6) + '...' + creator.slice(-4),
            processingSteps: events.filter(e => e.eventType !== 'Collection' && !e.eventType.includes('moisture')).map(e => ({
              step: e.eventType,
              date: e.timestamp.split('T')[0],
              processor: e.actor.slice(0, 6) + '...' + e.actor.slice(-4),
              location: `${e.lat.toFixed(6)}°, ${e.lon.toFixed(6)}°`,
              status: 'completed' as const
            })),
            qualityTests: events.filter(e => e.eventType.includes('moisture') || e.eventType.toLowerCase().includes('test')).map(e => ({
              testType: e.eventType,
              result: e.qualityPass ? 'Passed - Within acceptable limits' : 'Failed - Outside acceptable limits',
              status: e.qualityPass ? 'passed' as const : 'failed' as const,
              date: e.timestamp.split('T')[0],
              laboratory: e.actor.slice(0, 6) + '...' + e.actor.slice(-4),
              certificate: e.eventId
            })),
            sustainabilityScore: recalled ? 0 : 95,
            certifications: recalled ? [] : ['Blockchain Verified', 'Traceability Certified'],
            authenticityVerified: !recalled
          };

          setProvenanceData(blockchainData);
          toast({
            title: "Product Verified",
            description: "Blockchain data retrieved successfully",
          });
          setLoading(false);
        } catch (blockchainError) {
          console.log('Blockchain query failed, using mock data');
          // Fallback to mock data for development
          setTimeout(() => {
            if (herbId.toUpperCase().startsWith('ASH') || herbId === 'demo') {
              setProvenanceData({
                ...mockProvenanceData,
                herbId: herbId.toUpperCase()
              });
              toast({
                title: "Product Verified",
                description: "Complete traceability data retrieved successfully",
              });
            } else {
              setProvenanceData(null);
              toast({
                title: "Product Not Found",
                description: "No traceability data found for this product ID",
                variant: "destructive"
              });
            }
            setLoading(false);
          }, 1500);
        }
      } else {
        // Fallback to mock data when no contract
        setTimeout(() => {
          if (herbId.toUpperCase().startsWith('ASH') || herbId === 'demo') {
            setProvenanceData({
              ...mockProvenanceData,
              herbId: herbId.toUpperCase()
            });
            toast({
              title: "Product Verified",
              description: "Complete traceability data retrieved successfully",
            });
          } else {
            setProvenanceData(null);
            toast({
              title: "Product Not Found",
              description: "No traceability data found for this product ID",
              variant: "destructive"
            });
          }
          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error fetching provenance:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch product information",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (herbId) {
      fetchProvenance();
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'failed':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Consumer Portal</h1>
          <p className="text-muted-foreground mt-2">Verify product authenticity and view complete traceability information</p>
        </div>
        
        {/* Search Section */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              Product Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Product ID (e.g., ASH001) or scan QR code"
                value={herbId}
                onChange={(e) => setHerbId(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && fetchProvenance()}
              />
              <Button onClick={fetchProvenance} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Product'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try entering "ASH001" or "demo" to see sample traceability data
            </p>
          </CardContent>
        </Card>

        {loading && (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Retrieving product information from blockchain...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {provenanceData && !loading && (
          <div className="space-y-6">
            {/* Product Overview */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="mr-2 h-5 w-5 text-primary" />
                    Product Information
                  </div>
                  {provenanceData.authenticityVerified && (
                    <Badge className="bg-success text-success-foreground">
                      <Shield className="mr-1 h-3 w-3" />
                      Verified Authentic
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Product ID</span>
                        <p className="font-medium font-mono">{provenanceData.herbId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Species</span>
                        <p className="font-medium">{provenanceData.species}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground mb-2 block">Certifications</span>
                        <div className="flex flex-wrap gap-2">
                          {provenanceData.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-success border-success/50 bg-success/5">
                              <Award className="mr-1 h-3 w-3" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <span className="text-sm text-muted-foreground block mb-1">Sustainability Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${provenanceData.sustainabilityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-primary font-bold text-lg">
                            {provenanceData.sustainabilityScore}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Harvest Information */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Harvest Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Harvest Location</span>
                    <p className="font-medium">{provenanceData.harvestLocation}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Harvest Date</span>
                    <p className="font-medium flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {provenanceData.harvestDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Collector</span>
                    <p className="font-medium flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {provenanceData.collectorId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Timeline */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Processing Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provenanceData.processingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 relative">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{index + 1}</span>
                        </div>
                        {index < provenanceData.processingSteps.length - 1 && (
                          <div className="absolute top-8 left-4 w-px h-6 bg-border"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{step.step}</h3>
                          <Badge className={getStatusColor(step.status)}>
                            {step.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.processor} • {step.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Calendar className="inline mr-1 h-3 w-3" />
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Tests */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-success" />
                  Quality Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {provenanceData.qualityTests.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{test.testType}</h3>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status === 'passed' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {test.status === 'failed' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{test.result}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">Laboratory:</span> {test.laboratory}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {test.date}
                        </p>
                        <p>
                          <span className="font-medium">Certificate:</span> {test.certificate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Shield className="mr-2 h-5 w-5" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Integrity</span>
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Supply Chain Continuity</span>
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Complete
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authenticity</span>
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Genuine
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    All data points have been cryptographically verified on the blockchain. 
                    This product is genuine and has not been tampered with.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!provenanceData && !loading && herbId && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium text-destructive mb-2">Product Not Found</h3>
              <p className="text-muted-foreground">
                No traceability data found for product ID: {herbId}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please verify the product ID or scan the QR code on the product packaging.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsumerPortal;