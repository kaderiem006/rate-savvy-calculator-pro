import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Clock, MapPin } from "lucide-react";

interface ShippingRate {
  id: string;
  service: string;
  description: string;
  price: number;
  deliveryTime: string;
  icon: "ground" | "air" | "express";
}

const UPSRateCalculator = () => {
  const [formData, setFormData] = useState({
    shipFromZip: "",
    shipToCountry: "",
    shipToZip: "",
    isResidential: false,
    weight: "",
    length: "",
    width: "",
    height: "",
    confirmation: "",
    serviceClass: "",
  });

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const mockRates: ShippingRate[] = [
    {
      id: "1",
      service: "UPS® Ground Saver",
      description: "Est. Delivery: Mon 11/4 by 7:00 PM",
      price: 7.94,
      deliveryTime: "1-5 business days",
      icon: "ground"
    },
    {
      id: "2",
      service: "UPS® Ground",
      description: "Est. Delivery: Mon 11/4 by 7:00 PM",
      price: 7.99,
      deliveryTime: "1-5 business days",
      icon: "ground"
    },
    {
      id: "3",
      service: "UPS 3 Day Select®",
      description: "Est. Delivery: Fri 11/1 by 7:00 PM",
      price: 10.39,
      deliveryTime: "3 business days",
      icon: "air"
    },
    {
      id: "4",
      service: "UPS 2nd Day Air®",
      description: "Est. Delivery: Thu 10/31 by 7:00 PM",
      price: 13.91,
      deliveryTime: "2 business days",
      icon: "air"
    },
    {
      id: "5",
      service: "UPS 2nd Day Air A.M.®",
      description: "Est. Delivery: Thu 10/31 by 12:00 PM",
      price: 19.83,
      deliveryTime: "2 business days",
      icon: "air"
    },
    {
      id: "6",
      service: "UPS Next Day Air Saver®",
      description: "Est. Delivery: Wed 10/30 by 3:00 PM",
      price: 37.97,
      deliveryTime: "Next business day",
      icon: "express"
    },
    {
      id: "7",
      service: "UPS Next Day Air®",
      description: "Est. Delivery: Wed 10/30 by 12:00 PM",
      price: 44.51,
      deliveryTime: "Next business day",
      icon: "express"
    },
    {
      id: "8",
      service: "UPS Next Day Air Early®",
      description: "Est. Delivery: Wed 10/30 by 8:00 AM",
      price: 74.51,
      deliveryTime: "Next business day",
      icon: "express"
    }
  ];

  const handleCalculateRates = () => {
    setIsCalculating(true);
    // Simulate API call
    setTimeout(() => {
      setRates(mockRates);
      setIsCalculating(false);
    }, 1500);
  };

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case "ground":
        return <Truck className="w-4 h-4 text-muted-foreground" />;
      case "air":
        return <Package className="w-4 h-4 text-muted-foreground" />;
      case "express":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (icon: string) => {
    switch (icon) {
      case "ground":
        return "secondary";
      case "air":
        return "outline";
      case "express":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">UPS Rate Calculator</h1>
        <p className="text-muted-foreground">Get accurate shipping rates for your packages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Configure Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ship From */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ship From</Label>
                <Input
                  placeholder="ZIP Code"
                  value={formData.shipFromZip}
                  onChange={(e) => setFormData({...formData, shipFromZip: e.target.value})}
                />
              </div>

              {/* Ship To */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Ship To</Label>
                <div className="space-y-3">
                  <Select value={formData.shipToCountry} onValueChange={(value) => setFormData({...formData, shipToCountry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Postal Code"
                    value={formData.shipToZip}
                    onChange={(e) => setFormData({...formData, shipToZip: e.target.value})}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="residential"
                      checked={formData.isResidential}
                      onCheckedChange={(checked) => setFormData({...formData, isResidential: checked as boolean})}
                    />
                    <Label htmlFor="residential" className="text-sm">Residential Address</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipment Information */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Shipment Information</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="weight" className="text-xs text-muted-foreground">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      placeholder="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="length" className="text-xs text-muted-foreground">L (in)</Label>
                      <Input
                        id="length"
                        placeholder="0"
                        value={formData.length}
                        onChange={(e) => setFormData({...formData, length: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width" className="text-xs text-muted-foreground">W (in)</Label>
                      <Input
                        id="width"
                        placeholder="0"
                        value={formData.width}
                        onChange={(e) => setFormData({...formData, width: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs text-muted-foreground">H (in)</Label>
                      <Input
                        id="height"
                        placeholder="0"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Confirmation</Label>
                  <Select value={formData.confirmation} onValueChange={(value) => setFormData({...formData, confirmation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="No Confirmation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Confirmation</SelectItem>
                      <SelectItem value="delivery">Delivery Confirmation</SelectItem>
                      <SelectItem value="signature">Signature Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Class</Label>
                  <Select value={formData.serviceClass} onValueChange={(value) => setFormData({...formData, serviceClass: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Show All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Show All</SelectItem>
                      <SelectItem value="ground">Ground Services</SelectItem>
                      <SelectItem value="air">Air Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCalculateRates} 
                className="w-full"
                disabled={isCalculating}
              >
                {isCalculating ? "Calculating..." : "Browse Rates"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Rates Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rates {rates.length > 0 && `(${rates.length} of ${rates.length} services available)`}</CardTitle>
            </CardHeader>
            <CardContent>
              {rates.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Enter shipment details and click "Browse Rates" to see available options</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rates.map((rate) => (
                    <div key={rate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getServiceIcon(rate.icon)}
                        <div>
                          <div className="font-medium">{rate.service}</div>
                          <div className="text-sm text-muted-foreground">{rate.description}</div>
                        </div>
                        <Badge variant={getBadgeVariant(rate.icon)} className="ml-2">
                          {rate.deliveryTime}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${rate.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UPSRateCalculator;