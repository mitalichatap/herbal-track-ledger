import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Package, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Download,
  Settings,
  Database,
  Globe,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [networkStats, setNetworkStats] = useState({
    totalHerbs: 1247,
    activeCollectors: 89,
    processingFacilities: 23,
    qualityTests: 456,
    sustainabilityScore: 92,
    totalTransactions: 3842,
    blockchainHeight: 125847
  });

  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'HARVEST',
      herbId: 'ASH001',
      status: 'Confirmed',
      timestamp: '2024-03-20 10:30:00',
      hash: '0xa1b2c3d4...'
    },
    {
      id: 'TXN002',
      type: 'QUALITY_TEST',
      herbId: 'TUR002',
      status: 'Pending',
      timestamp: '2024-03-20 09:15:00',
      hash: '0xe5f6g7h8...'
    },
    {
      id: 'TXN003',
      type: 'PROCESSING',
      herbId: 'BRA003',
      status: 'Confirmed',
      timestamp: '2024-03-20 08:45:00',
      hash: '0xi9j0k1l2...'
    },
    {
      id: 'TXN004',
      type: 'QR_GENERATION',
      herbId: 'NEE004',
      status: 'Confirmed',
      timestamp: '2024-03-20 08:20:00',
      hash: '0xm3n4o5p6...'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: '2 IoT devices offline in Rajasthan region',
      timestamp: '2024-03-20 11:00',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Weekly compliance report generated',
      timestamp: '2024-03-20 09:30',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      message: 'Blockchain sync completed successfully',
      timestamp: '2024-03-20 08:15',
      severity: 'low'
    }
  ];

  const topCollectors = [
    { id: 'COLL001', name: 'Rajesh Kumar', region: 'Rajasthan', harvests: 45, score: 98 },
    { id: 'COLL005', name: 'Priya Sharma', region: 'Karnataka', harvests: 38, score: 97 },
    { id: 'COLL012', name: 'Amit Singh', region: 'Uttarakhand', harvests: 35, score: 96 },
    { id: 'COLL008', name: 'Sunita Devi', region: 'Himachal Pradesh', harvests: 32, score: 95 }
  ];

  const processingFacilities = [
    { 
      id: 'PROC001', 
      name: 'Green Valley Processing', 
      location: 'Jaipur, Rajasthan', 
      status: 'active',
      throughput: '150 kg/day',
      qualityScore: 98
    },
    { 
      id: 'PROC002', 
      name: 'AyurPharm Manufacturing', 
      location: 'Delhi', 
      status: 'active',
      throughput: '300 kg/day',
      qualityScore: 97
    },
    { 
      id: 'PROC003', 
      name: 'Himalayan Herbs Co.', 
      location: 'Dehradun', 
      status: 'maintenance',
      throughput: '200 kg/day',
      qualityScore: 96
    }
  ];

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'HARVEST':
        return 'bg-primary text-primary-foreground';
      case 'PROCESSING':
        return 'bg-accent text-accent-foreground';
      case 'QUALITY_TEST':
        return 'bg-success text-success-foreground';
      case 'QR_GENERATION':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Confirmed</Badge>;
      case 'Pending':
        return <Badge variant="outline"><AlertTriangle className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'Failed':
        return <Badge className="bg-destructive text-destructive-foreground">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'info':
        return <Activity className="h-4 w-4 text-accent-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Network monitoring, analytics, and system management</p>
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <Card className="xl:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Herbs Tracked</p>
                  <p className="text-3xl font-bold text-primary">
                    {networkStats.totalHerbs.toLocaleString()}
                  </p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Collectors</p>
                  <p className="text-2xl font-bold text-accent-foreground">
                    {networkStats.activeCollectors}
                  </p>
                </div>
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing Facilities</p>
                  <p className="text-2xl font-bold text-success">
                    {networkStats.processingFacilities}
                  </p>
                </div>
                <Shield className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quality Tests</p>
                  <p className="text-2xl font-bold text-warning">
                    {networkStats.qualityTests}
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Blockchain Height</p>
                  <p className="text-2xl font-bold text-foreground">
                    {networkStats.blockchainHeight.toLocaleString()}
                  </p>
                </div>
                <Database className="h-6 w-6 text-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sustainability</p>
                  <p className="text-2xl font-bold text-primary">
                    {networkStats.sustainabilityScore}%
                  </p>
                </div>
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Blockchain Network</span>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Smart Contracts</span>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>IoT Devices</span>
                      <Badge className="bg-warning text-warning-foreground">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        2 Offline
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Gateway</span>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Alerts */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Top Collectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCollectors.map((collector, index) => (
                      <div key={collector.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-primary">#{index + 1}</span>
                            <span className="font-medium">{collector.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{collector.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{collector.harvests} harvests</p>
                          <p className="text-xs text-success">Score: {collector.score}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Processing Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {processingFacilities.map((facility) => (
                      <div key={facility.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{facility.name}</h4>
                          <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
                            {facility.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{facility.location}</p>
                        <div className="flex justify-between text-xs">
                          <span>Throughput: {facility.throughput}</span>
                          <span className="text-success">Quality: {facility.qualityScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Blockchain Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={getTransactionTypeColor(tx.type)}>
                          {tx.type.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="font-medium">{tx.herbId}</p>
                          <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                          <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                        </div>
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Network Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Transactions</span>
                      <span className="font-medium">{networkStats.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Block Height</span>
                      <span className="font-medium">{networkStats.blockchainHeight.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Nodes</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consensus Algorithm</span>
                      <span className="font-medium">Proof of Authority</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Block Time</span>
                      <span className="font-medium">15 seconds</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Rajasthan</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Karnataka</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Uttarakhand</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{width: '20%'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Others</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{width: '10%'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button className="h-24 flex flex-col items-center justify-center space-y-2">
                    <Download className="h-6 w-6" />
                    <span>Compliance Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Network Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span>User Activity Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                    <Package className="h-6 w-6" />
                    <span>Supply Chain Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                    <Shield className="h-6 w-6" />
                    <span>Security Audit</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                    <Settings className="h-6 w-6" />
                    <span>System Configuration</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;