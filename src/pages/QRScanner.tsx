import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const QRScanner = () => {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScanSuccess = (result: string) => {
    console.log('QR Scan Result:', result);
    setScannedResult(result);
    
    // Parse the QR code data and navigate to consumer portal
    try {
      const qrData = JSON.parse(result);
      if (qrData.herbId) {
        toast({
          title: "QR Code Scanned Successfully",
          description: `Redirecting to product details for ${qrData.herbId}`,
        });
        navigate(`/consumer?herbId=${qrData.herbId}`);
      }
    } catch (error) {
      // If not JSON, treat as herb ID directly
      toast({
        title: "QR Code Scanned Successfully",
        description: `Redirecting to product details for ${result}`,
      });
      navigate(`/consumer?herbId=${result}`);
    }
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported in this browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoEl.current) {
        videoEl.current.srcObject = stream;
        setQrOn(true);
        setCameraError('');
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
      setQrOn(false);
    }
  };

  const stopCamera = () => {
    if (videoEl.current && videoEl.current.srcObject) {
      const stream = videoEl.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoEl.current.srcObject = null;
    }
    setQrOn(false);
  };

  const simulateQRScan = () => {
    // Simulate a successful QR scan for demo purposes
    const mockHerbId = 'ASH001';
    handleScanSuccess(mockHerbId);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Camera className="mr-2 h-5 w-5" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {qrOn ? (
                <>
                  <video 
                    ref={videoEl} 
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Camera not active</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {cameraError && (
              <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{cameraError}</span>
              </div>
            )}

            {/* Success Display */}
            {scannedResult && (
              <div className="flex items-center space-x-2 text-success bg-success/10 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">QR Code Scanned!</p>
                  <p className="text-xs text-muted-foreground">{scannedResult}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Point your camera at a QR code on an Ayurvedic product to view its complete traceability information
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={qrOn ? stopCamera : startCamera}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {qrOn ? 'Stop Camera' : 'Start Camera'}
                </Button>
                
                {/* Demo button for testing */}
                <Button 
                  size="sm"
                  onClick={simulateQRScan}
                  className="flex-1"
                >
                  Demo Scan
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="font-medium text-sm">What you'll see:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Complete harvest to consumer journey</li>
                <li>• GPS location of herb collection</li>
                <li>• Quality test results and certifications</li>
                <li>• Processing facility information</li>
                <li>• Sustainability and authenticity scores</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;