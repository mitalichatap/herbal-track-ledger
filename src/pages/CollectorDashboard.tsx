import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Save, Leaf, Clock, User } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const CollectorDashboard = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [harvestData, setHarvestData] = useState({
    herbId: '',
    species: '',
    collectorId: '',
    quantity: '',
    qualityNotes: '',
    weatherConditions: '',
    soilType: ''
  });
  const [recentHarvests, setRecentHarvests] = useState<any[]>([]);
  const { contract, account, isConnected } = useBlockchain();
  const { toast } = useToast();

  const herbSpecies = [
    'Ashwagandha (Withania somnifera)',
    'Turmeric (Curcuma longa)',
    'Brahmi (Bacopa monnieri)',
    'Neem (Azadirachta indica)',
    'Tulsi (Ocimum sanctum)',
    'Guduchi (Tinospora cordifolia)',
    'Ginger (Zingiber officinale)',
    'Aloe Vera (Aloe barbadensis)',
    'Amla (Emblica officinalis)',
    'Triphala herbs complex'
  ];

  useEffect(() => {
    getCurrentLocation();
    loadRecentHarvests();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: "Location Error",
            description: "Unable to get current location. Please enable location services.",
            variant: "destructive"
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const loadRecentHarvests = () => {
    // Mock recent harvests for demonstration
    setRecentHarvests([
      {
        herbId: 'ASH001',
        species: 'Ashwagandha',
        timestamp: '2024-03-20 09:30',
        status: 'Recorded',
        quantity: '2.5 kg'
      },
      {
        herbId: 'TUR002',
        species: 'Turmeric',
        timestamp: '2024-03-19 14:15',
        status: 'Verified',
        quantity: '4.0 kg'
      }
    ]);
  };

  const generateHerbId = () => {
    const prefix = harvestData.species.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const recordHarvest = async () => {
    if (!contract || !account || !location) {
      toast({
        title: "Error",
        description: "Please ensure wallet is connected and location is available",
        variant: "destructive"
      });
      return;
    }

    if (!harvestData.species || !harvestData.collectorId || !harvestData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const herbId = harvestData.herbId || generateHerbId();
      const timestamp = Math.floor(Date.now() / 1000);
      const locationString = `${location.latitude.toFixed(6)},${location.longitude.toFixed(6)}`;
      
      // Record harvest event on blockchain
      await contract.methods.recordHarvestEvent(
        herbId,
        locationString,
        timestamp,
        harvestData.collectorId,
        harvestData.species
      ).send({ from: account });

      // Create harvest event object
      const harvestEvent = {
        ...harvestData,
        herbId,
        location: locationString,
        timestamp: new Date().toISOString(),
        transactionHash: 'pending',
        eventType: 'HARVEST',
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        }
      };

      console.log('Harvest Event Recorded:', harvestEvent);

      toast({
        title: "Success",
        description: `Harvest event recorded successfully! Herb ID: ${herbId}`,
      });

      // Reset form
      setHarvestData({
        herbId: '',
        species: '',
        collectorId: '',
        quantity: '',
        qualityNotes: '',
        weatherConditions: '',
        soilType: ''
      });

      // Refresh recent harvests
      loadRecentHarvests();
    } catch (error) {
      console.error('Error recording harvest:', error);
      toast({
        title: "Error",
        description: "Failed to record harvest event",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Collector Dashboard</h1>
          <p className="text-muted-foreground mt-2">Record herb harvest events with GPS tracking and quality assessments</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Status */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  GPS Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {location ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-success border-success">
                        <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                        Location Active
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Accuracy: ±{location.accuracy.toFixed(0)}m
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Latitude:</span>
                        <p className="font-mono">{location.latitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longitude:</span>
                        <p className="font-mono">{location.longitude.toFixed(6)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={getCurrentLocation}
                      className="mt-2"
                    >
                      Refresh Location
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-destructive mb-2">Location not available</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={getCurrentLocation}
                    >
                      Enable GPS
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Harvest Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5 text-primary" />
                  Record Harvest Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="herbId">Herb ID (Optional)</Label>
                    <Input
                      id="herbId"
                      placeholder="Auto-generated if empty"
                      value={harvestData.herbId}
                      onChange={(e) => setHarvestData({...harvestData, herbId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="collectorId">Collector ID *</Label>
                    <Input
                      id="collectorId"
                      placeholder="Enter your collector ID"
                      value={harvestData.collectorId}
                      onChange={(e) => setHarvestData({...harvestData, collectorId: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="species">Herb Species *</Label>
                  <Select 
                    value={harvestData.species} 
                    onValueChange={(value) => setHarvestData({...harvestData, species: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select herb species" />
                    </SelectTrigger>
                    <SelectContent>
                      {herbSpecies.map((species) => (
                        <SelectItem key={species} value={species}>
                          {species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter quantity in kg"
                      value={harvestData.quantity}
                      onChange={(e) => setHarvestData({...harvestData, quantity: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Input
                      id="soilType"
                      placeholder="e.g., Loamy, Clay, Sandy"
                      value={harvestData.soilType}
                      onChange={(e) => setHarvestData({...harvestData, soilType: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weatherConditions">Weather Conditions</Label>
                  <Input
                    id="weatherConditions"
                    placeholder="e.g., Sunny, 25°C, Low humidity"
                    value={harvestData.weatherConditions}
                    onChange={(e) => setHarvestData({...harvestData, weatherConditions: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="qualityNotes">Quality Notes</Label>
                  <Textarea
                    id="qualityNotes"
                    placeholder="Initial quality observations, herb condition, etc."
                    value={harvestData.qualityNotes}
                    onChange={(e) => setHarvestData({...harvestData, qualityNotes: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={recordHarvest}
                  className="w-full"
                  disabled={!isConnected || !location}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Record Harvest Event
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connection Status */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Connection Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blockchain</span>
                  <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-success" : ""}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">GPS</span>
                  <Badge variant={location ? "default" : "secondary"} className={location ? "bg-success" : ""}>
                    {location ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {isConnected && account && (
                  <div className="text-xs text-muted-foreground">
                    <p>Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Harvests */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent Harvests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentHarvests.length > 0 ? (
                  <div className="space-y-3">
                    {recentHarvests.map((harvest, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{harvest.herbId}</span>
                          <Badge variant="outline" className="text-xs">
                            {harvest.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{harvest.species}</p>
                        <p className="text-xs text-muted-foreground">{harvest.quantity} • {harvest.timestamp}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Leaf className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent harvests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;