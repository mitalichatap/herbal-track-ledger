import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FlaskConical, QrCode, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '../contexts/BlockchainContext';

const ProcessorDashboard = () => {
  const [processingData, setProcessingData] = useState({
    herbId: '',
    processStep: '',
    processorId: '',
    batchId: '',
    notes: '',
    temperature: '',
    duration: ''
  });
  
  const [qualityData, setQualityData] = useState({
    herbId: '',
    testType: '',
    result: '',
    laboratory: '',
    certificateId: '',
    status: 'pending'
  });

  const [qrData, setQrData] = useState({
    herbId: '',
    productName: '',
    expiryDate: ''
  });

  const { toast } = useToast();
  const { contract, account } = useBlockchain();

  const processingSteps = [
    'Initial Cleaning',
    'Washing & Purification',
    'Natural Drying',
    'Temperature Controlled Drying',
    'Grinding & Pulverization',
    'Sieving & Grading',
    'Final Quality Check',
    'Packaging',
    'Storage & Inventory'
  ];

  const qualityTests = [
    'Moisture Content Analysis',
    'Pesticide Residue Screening',
    'Heavy Metals Testing',
    'Microbial Analysis',
    'DNA Barcoding Verification',
    'Aflatoxin Testing',
    'Active Compound Analysis',
    'Physical Characteristics',
    'Ash Content Analysis'
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'processing',
      herbId: 'ASH001',
      activity: 'Grinding completed',
      timestamp: '2024-03-20 14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'quality',
      herbId: 'TUR002',
      activity: 'Moisture content test',
      timestamp: '2024-03-20 13:15',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'qr',
      herbId: 'BRA003',
      activity: 'QR code generated',
      timestamp: '2024-03-20 12:00',
      status: 'completed'
    }
  ];

  const recordProcessingStep = async () => {
    if (!processingData.herbId || !processingData.processStep || !processingData.processorId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!contract || !account) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive"
        });
        return;
      }

      const metaCID = JSON.stringify({
        processorId: processingData.processorId,
        batchId: processingData.batchId,
        notes: processingData.notes,
        temperature: processingData.temperature,
        duration: processingData.duration,
        timestamp: Date.now()
      });

      // Add processing event to blockchain
      await contract.methods.addEvent(
        processingData.herbId, // batchId
        `PROC-${Date.now()}`, // eventId
        processingData.processStep, // eventType
        metaCID, // metaCID
        0, // lat (can be updated with facility location)
        0  // lon (can be updated with facility location)
      ).send({ from: account });

      toast({
        title: "Success",
        description: "Processing step recorded on blockchain",
      });

      setProcessingData({
        herbId: '',
        processStep: '',
        processorId: '',
        batchId: '',
        notes: '',
        temperature: '',
        duration: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record processing step",
        variant: "destructive"
      });
    }
  };

  const recordQualityTest = async () => {
    if (!qualityData.herbId || !qualityData.testType || !qualityData.result) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!contract || !account) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive"
        });
        return;
      }

      const metaCID = JSON.stringify({
        laboratory: qualityData.laboratory,
        certificateId: qualityData.certificateId,
        result: qualityData.result,
        status: qualityData.status,
        timestamp: Date.now()
      });

      // Parse numeric value if moisture test
      let numericValue = 0;
      if (qualityData.testType.toLowerCase().includes('moisture')) {
        const moistureMatch = qualityData.result.match(/(\d+\.?\d*)/);
        if (moistureMatch) {
          numericValue = Math.round(parseFloat(moistureMatch[1]) * 100); // Scale by 100
        }
      }

      // Add quality test to blockchain
      await contract.methods.addQualityTest(
        qualityData.herbId, // batchId
        `LAB-${Date.now()}`, // eventId
        qualityData.testType, // testType
        numericValue, // numericValue (scaled)
        metaCID, // metaCID
        0, // lat (can be updated with lab location)
        0  // lon (can be updated with lab location)
      ).send({ from: account });

      toast({
        title: "Success",
        description: "Quality test recorded on blockchain",
      });

      setQualityData({
        herbId: '',
        testType: '',
        result: '',
        laboratory: '',
        certificateId: '',
        status: 'pending'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record quality test",
        variant: "destructive"
      });
    }
  };

  const generateQRCode = async () => {
    if (!qrData.herbId || !qrData.productName) {
      toast({
        title: "Missing Information",
        description: "Please fill in herb ID and product name",
        variant: "destructive"
      });
      return;
    }

    try {
      const qrCodeData = {
        herbId: qrData.herbId,
        productName: qrData.productName,
        expiryDate: qrData.expiryDate,
        verificationUrl: `https://ayurchain.com/verify/${qrData.herbId}`,
        generatedAt: new Date().toISOString()
      };

      console.log('QR Code Data:', qrCodeData);

      toast({
        title: "QR Code Generated",
        description: `QR code created for product ${qrData.herbId}`,
      });

      setQrData({
        herbId: '',
        productName: '',
        expiryDate: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'processing':
        return <Package className="h-4 w-4 text-primary" />;
      case 'quality':
        return <FlaskConical className="h-4 w-4 text-success" />;
      case 'qr':
        return <QrCode className="h-4 w-4 text-accent-foreground" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-warning text-warning-foreground"><Clock className="mr-1 h-3 w-3" />In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertTriangle className="mr-1 h-3 w-3" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Processor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage processing steps, quality testing, and product documentation</p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="processing" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="processing" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Processing
                </TabsTrigger>
                <TabsTrigger value="quality" className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Quality Testing
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Generation
                </TabsTrigger>
              </TabsList>

              {/* Processing Tab */}
              <TabsContent value="processing">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Record Processing Step</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="herbId">Herb ID *</Label>
                        <Input
                          id="herbId"
                          placeholder="Enter herb ID"
                          value={processingData.herbId}
                          onChange={(e) => setProcessingData({
                            ...processingData, 
                            herbId: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="batchId">Batch ID</Label>
                        <Input
                          id="batchId"
                          placeholder="Enter batch ID"
                          value={processingData.batchId}
                          onChange={(e) => setProcessingData({
                            ...processingData, 
                            batchId: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="processStep">Processing Step *</Label>
                      <Select 
                        value={processingData.processStep} 
                        onValueChange={(value) => setProcessingData({
                          ...processingData, 
                          processStep: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select processing step" />
                        </SelectTrigger>
                        <SelectContent>
                          {processingSteps.map((step) => (
                            <SelectItem key={step} value={step}>
                              {step}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="processorId">Processor ID *</Label>
                        <Input
                          id="processorId"
                          placeholder="Enter processor ID"
                          value={processingData.processorId}
                          onChange={(e) => setProcessingData({
                            ...processingData, 
                            processorId: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <Input
                          id="temperature"
                          type="number"
                          placeholder="e.g., 60"
                          value={processingData.temperature}
                          onChange={(e) => setProcessingData({
                            ...processingData, 
                            temperature: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (hours)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="e.g., 8"
                          value={processingData.duration}
                          onChange={(e) => setProcessingData({
                            ...processingData, 
                            duration: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Processing Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Enter processing details, observations, and any special conditions"
                        value={processingData.notes}
                        onChange={(e) => setProcessingData({
                          ...processingData, 
                          notes: e.target.value
                        })}
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={recordProcessingStep}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Record Processing Step
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quality Testing Tab */}
              <TabsContent value="quality">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Record Quality Test</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qualityHerbId">Herb ID *</Label>
                        <Input
                          id="qualityHerbId"
                          placeholder="Enter herb ID"
                          value={qualityData.herbId}
                          onChange={(e) => setQualityData({
                            ...qualityData, 
                            herbId: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="testType">Test Type *</Label>
                        <Select 
                          value={qualityData.testType} 
                          onValueChange={(value) => setQualityData({
                            ...qualityData, 
                            testType: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                          <SelectContent>
                            {qualityTests.map((test) => (
                              <SelectItem key={test} value={test}>
                                {test}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="laboratory">Laboratory</Label>
                        <Input
                          id="laboratory"
                          placeholder="Enter laboratory name"
                          value={qualityData.laboratory}
                          onChange={(e) => setQualityData({
                            ...qualityData, 
                            laboratory: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="certificateId">Certificate ID</Label>
                        <Input
                          id="certificateId"
                          placeholder="Enter certificate ID"
                          value={qualityData.certificateId}
                          onChange={(e) => setQualityData({
                            ...qualityData, 
                            certificateId: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="result">Test Result *</Label>
                      <Textarea
                        id="result"
                        placeholder="Enter detailed test results, measurements, and compliance status"
                        value={qualityData.result}
                        onChange={(e) => setQualityData({
                          ...qualityData, 
                          result: e.target.value
                        })}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Test Status</Label>
                      <Select 
                        value={qualityData.status} 
                        onValueChange={(value) => setQualityData({
                          ...qualityData, 
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passed">Passed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={recordQualityTest}
                      className="w-full"
                    >
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Record Quality Test
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QR Generation Tab */}
              <TabsContent value="qr">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Generate Product QR Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qrHerbId">Herb ID *</Label>
                        <Input
                          id="qrHerbId"
                          placeholder="Enter herb ID"
                          value={qrData.herbId}
                          onChange={(e) => setQrData({
                            ...qrData, 
                            herbId: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input
                          id="productName"
                          placeholder="Enter product name"
                          value={qrData.productName}
                          onChange={(e) => setQrData({
                            ...qrData, 
                            productName: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={qrData.expiryDate}
                        onChange={(e) => setQrData({
                          ...qrData, 
                          expiryDate: e.target.value
                        })}
                      />
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">QR Code will contain:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Product identification and verification URL</li>
                        <li>• Complete traceability chain access</li>
                        <li>• Blockchain verification data</li>
                        <li>• Consumer portal access link</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={generateQRCode}
                      className="w-full"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">Processing Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">8</div>
                  <div className="text-xs text-muted-foreground">Quality Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-foreground">5</div>
                  <div className="text-xs text-muted-foreground">QR Codes Generated</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium truncate">{activity.herbId}</p>
                          {getStatusBadge(activity.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Batch Operations
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Lab Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <QrCode className="mr-2 h-4 w-4" />
                  Bulk QR Generation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorDashboard;