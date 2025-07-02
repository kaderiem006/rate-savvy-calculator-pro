import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  description: string;
  price: number;
  logo: string;
}

const UPSRateCalculator = () => {
  const [formData, setFormData] = useState({
    shipFromZip: "34285",
    shipToCountry: "United States",
    shipToZip: "12345",
    isResidential: false,
    weight: "1",
    length: "10",
    width: "6",
    height: "3",
    confirmation: "",
    serviceClass: "",
  });

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [viewBy, setViewBy] = useState("Carriers");

  const mockRates: ShippingRate[] = [
    {
      id: "1",
      carrier: "UPS",
      service: "UPS® Ground Saver",
      description: "Est. Delivery: Mon 11/4 by 7:00 PM",
      price: 7.94,
      logo: "🤎"
    },
    {
      id: "2", 
      carrier: "UPS",
      service: "UPS® Ground",
      description: "Est. Delivery: Mon 11/4 by 7:00 PM",
      price: 7.99,
      logo: "🤎"
    },
    {
      id: "3",
      carrier: "UPS",
      service: "UPS 3 Day Select®",
      description: "Est. Delivery: Fri 11/1 by 7:00 PM", 
      price: 10.39,
      logo: "🤎"
    },
    {
      id: "4",
      carrier: "UPS",
      service: "UPS 2nd Day Air®",
      description: "Est. Delivery: Thu 10/31 by 7:00 PM",
      price: 13.91,
      logo: "🤎"
    },
    {
      id: "5",
      carrier: "UPS",
      service: "UPS 2nd Day Air A.M.®",
      description: "Est. Delivery: Thu 10/31 by 12:00 PM",
      price: 19.83,
      logo: "🤎"
    },
    {
      id: "6",
      carrier: "UPS",
      service: "UPS Next Day Air Saver®",
      description: "Est. Delivery: Wed 10/30 by 3:00 PM",
      price: 37.97,
      logo: "🤎"
    },
    {
      id: "7",
      carrier: "UPS", 
      service: "UPS Next Day Air®",
      description: "Est. Delivery: Wed 10/30 by 12:00 PM",
      price: 44.51,
      logo: "🤎"
    },
    {
      id: "8",
      carrier: "UPS",
      service: "UPS Next Day Air Early®",
      description: "Est. Delivery: Wed 10/30 by 8:00 AM", 
      price: 74.51,
      logo: "🤎"
    }
  ];

  const handleCalculateRates = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setRates(mockRates);
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Rate Browser</h2>
          <X className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Configuration */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Configure Rates</h3>
          
          {/* Ship From */}
          <div className="mb-4">
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Ship From</Label>
            <div className="text-xs text-blue-600 mb-1">Required Info ▼</div>
            <Input
              className="text-sm"
              value={formData.shipFromZip}
              onChange={(e) => setFormData({...formData, shipFromZip: e.target.value})}
            />
          </div>

          {/* Ship To */}
          <div className="mb-4">
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Ship To</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Country</Label>
                <Select value={formData.shipToCountry} onValueChange={(value) => setFormData({...formData, shipToCountry: value})}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Postal Code</Label>
                <Input
                  className="text-sm"
                  value={formData.shipToZip}
                  onChange={(e) => setFormData({...formData, shipToZip: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="residential"
                  checked={formData.isResidential}
                  onCheckedChange={(checked) => setFormData({...formData, isResidential: checked as boolean})}
                />
                <Label htmlFor="residential" className="text-xs text-gray-600">Residential Address</Label>
              </div>
            </div>
          </div>

          {/* Shipment Information */}
          <div className="mb-4">
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Shipment Information</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Weight</Label>
                <div className="flex items-center space-x-1">
                  <Input
                    className="text-sm flex-1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                  <span className="text-xs text-gray-500">lbs</span>
                  <div className="w-6 h-6 bg-blue-500 text-white text-xs flex items-center justify-center rounded">oz</div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Package</Label>
                <Select value="Box brown 16x13x3" onValueChange={() => {}}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Box brown 16x13x3">Box brown 16x13x3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div>
                  <Input
                    className="text-sm text-center"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                  />
                  <div className="text-xs text-gray-500 text-center">L</div>
                </div>
                <div>
                  <Input
                    className="text-sm text-center"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                  />
                  <div className="text-xs text-gray-500 text-center">W</div>
                </div>
                <div>
                  <Input
                    className="text-sm text-center"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                  <div className="text-xs text-gray-500 text-center">H (in)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="mb-4">
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Confirmation</Label>
            <Select value="No Confirmation" onValueChange={() => {}}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Confirmation">No Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Class */}
          <div className="mb-4">
            <Label className="text-xs font-medium text-gray-600 mb-1 block">Service Class</Label>
            <Select value="Show All" onValueChange={() => {}}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Show All">Show All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Browse Rates Button */}
        <div className="p-4">
          <Button 
            onClick={handleCalculateRates}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
            disabled={isCalculating}
          >
            {isCalculating ? "Loading..." : "Browse Rates"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Rates {rates.length > 0 && `5 out of 5 carriers available`}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600">View By</Label>
                <Select value={viewBy} onValueChange={setViewBy}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carriers">Carriers</SelectItem>
                    <SelectItem value="Price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Rates Content */}
        <div className="flex-1 p-4 overflow-auto">
          {rates.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-lg mb-2">No rates calculated yet</div>
              <div className="text-sm">Enter shipment details and click "Browse Rates" to see available options</div>
            </div>
          ) : (
            <div className="space-y-2">
              {rates.map((rate, index) => (
                <div key={rate.id} className="flex items-center p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center mr-3">
                    <span className="text-sm">{rate.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{rate.service}</div>
                    <div className="text-xs text-gray-500">{rate.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">${rate.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-100 border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            COST/SERV: $396.69 | 0 | Packs... <span className="text-blue-600">$0.00 Shipped</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPSRateCalculator;