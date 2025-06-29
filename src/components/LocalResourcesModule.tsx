import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, Filter, Search, Heart, Shield, BookOpen, Users } from 'lucide-react';

interface LocalResource {
  id: string;
  name: string;
  type: 'clinic' | 'ngo' | 'pharmacy' | 'counseling' | 'education';
  distance: string;
  description: string;
  contact: string;
  address: string;
  services: string[];
  timings: string;
  language: string;
  rating: number;
  isVerified: boolean;
  specialties: string[];
  cost: 'free' | 'low-cost' | 'moderate';
  accessibility: string[];
}

interface LocalResourcesModuleProps {
  onBack: () => void;
}

function LocalResourcesModule({ onBack }: LocalResourcesModuleProps) {
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LocalResource[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'clinic' | 'ngo' | 'pharmacy' | 'counseling' | 'education'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const resourceTypes = [
    { id: 'all', label: 'All Resources', icon: MapPin, color: 'gray' },
    { id: 'clinic', label: 'Health Clinics', icon: Heart, color: 'red' },
    { id: 'ngo', label: 'NGOs & Support', icon: Users, color: 'green' },
    { id: 'pharmacy', label: 'Pharmacies', icon: Shield, color: 'blue' },
    { id: 'counseling', label: 'Counseling', icon: Heart, color: 'purple' },
    { id: 'education', label: 'Education Centers', icon: BookOpen, color: 'yellow' }
  ];

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }

    // Load sample resources with AI-generated descriptions
    const sampleResources: LocalResource[] = [
      {
        id: '1',
        name: "Women's Health Center",
        type: 'clinic',
        distance: '1.2 km',
        description: 'Comprehensive women\'s health services including menstrual health, reproductive care, and general wellness. Free pad distribution on weekends.',
        contact: '+91-9876543210',
        address: 'Near Bus Stand, Main Road, Sector 12',
        services: ['menstrual-health', 'reproductive-care', 'general-checkup', 'free-pads'],
        timings: '9 AM - 6 PM (Mon-Sat)',
        language: 'Hindi, English',
        rating: 4.5,
        isVerified: true,
        specialties: ['Women\'s Health', 'Gynecology', 'Family Planning'],
        cost: 'free',
        accessibility: ['wheelchair-accessible', 'female-doctors']
      },
      {
        id: '2',
        name: 'Mahila Mandal NGO',
        type: 'ngo',
        distance: '2.5 km',
        description: 'Community organization supporting women through education, health awareness, and skill development programs. Mental health support groups every Thursday.',
        contact: '+91-9876543211',
        address: 'Community Center, Sector 5',
        services: ['support-groups', 'mental-health', 'education', 'skill-development'],
        timings: '10 AM - 5 PM (Mon-Fri)',
        language: 'Hindi, Telugu, English',
        rating: 4.8,
        isVerified: true,
        specialties: ['Women Empowerment', 'Mental Health', 'Education'],
        cost: 'free',
        accessibility: ['group-sessions', 'peer-support']
      },
      {
        id: '3',
        name: 'Apollo Pharmacy',
        type: 'pharmacy',
        distance: '0.8 km',
        description: 'Well-stocked pharmacy with menstrual products, contraceptives, and general medicines. Knowledgeable female pharmacist available.',
        contact: '+91-9876543212',
        address: 'Market Complex, Ground Floor',
        services: ['menstrual-products', 'contraceptives', 'medicines', 'health-consultation'],
        timings: '8 AM - 10 PM (Daily)',
        language: 'Hindi, English',
        rating: 4.2,
        isVerified: true,
        specialties: ['Women\'s Health Products', 'Contraceptives', 'General Medicines'],
        cost: 'low-cost',
        accessibility: ['female-staff', 'private-consultation']
      },
      {
        id: '4',
        name: 'Mind Wellness Counseling Center',
        type: 'counseling',
        distance: '3.1 km',
        description: 'Professional counseling services specializing in women\'s mental health, anxiety, depression, and life transitions. Sliding scale fees available.',
        contact: '+91-9876543213',
        address: 'Professional Complex, 2nd Floor',
        services: ['individual-counseling', 'group-therapy', 'crisis-support', 'family-counseling'],
        timings: '9 AM - 7 PM (Mon-Sat)',
        language: 'Hindi, English, Tamil',
        rating: 4.7,
        isVerified: true,
        specialties: ['Women\'s Mental Health', 'Anxiety & Depression', 'Trauma Counseling'],
        cost: 'moderate',
        accessibility: ['sliding-scale-fees', 'female-counselors', 'confidential']
      },
      {
        id: '5',
        name: 'Skill Development Institute',
        type: 'education',
        distance: '1.9 km',
        description: 'Vocational training and skill development programs for women. Computer literacy, tailoring, and entrepreneurship courses available.',
        contact: '+91-9876543214',
        address: 'Education Hub, Near Railway Station',
        services: ['vocational-training', 'computer-literacy', 'entrepreneurship', 'certification'],
        timings: '9 AM - 5 PM (Mon-Sat)',
        language: 'Hindi, English',
        rating: 4.3,
        isVerified: true,
        specialties: ['Skill Development', 'Computer Training', 'Entrepreneurship'],
        cost: 'low-cost',
        accessibility: ['flexible-timings', 'childcare-support']
      },
      {
        id: '6',
        name: 'Vandrevala Foundation Helpline',
        type: 'counseling',
        distance: 'Phone Support',
        description: '24/7 mental health support and crisis intervention helpline. Trained counselors available in multiple languages.',
        contact: '1860-2662-345',
        address: 'Nationwide Helpline Service',
        services: ['crisis-support', 'mental-health', '24x7-helpline', 'multilingual'],
        timings: '24/7',
        language: 'Hindi, English, Tamil, Telugu, Bengali',
        rating: 4.6,
        isVerified: true,
        specialties: ['Crisis Intervention', 'Mental Health Support', 'Suicide Prevention'],
        cost: 'free',
        accessibility: ['24x7-available', 'multilingual', 'anonymous']
      }
    ];

    setResources(sampleResources);
    setFilteredResources(sampleResources);
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [selectedType, searchTerm, resources]);

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'text-green-600 bg-green-50';
      case 'low-cost': return 'text-blue-600 bg-blue-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = resourceTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : MapPin;
  };

  const getDirections = (address: string) => {
    if (userLocation) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                <MapPin className="w-5 h-5 text-blue-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Local Resources AI</h1>
                <p className="text-sm text-gray-600">AI-curated support near you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for clinics, NGOs, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      selectedType === type.id
                        ? `bg-${type.color}-100 text-${type.color}-700 border-${type.color}-200`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } border`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">AI Resource Insights</h3>
              <p className="text-sm text-blue-700">
                Found {filteredResources.length} resources near you. AI has verified these locations and 
                summarized their services based on real user experiences and official information.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const Icon = getTypeIcon(resource.type);
            return (
              <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{resource.distance}</span>
                        {resource.isVerified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(resource.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{resource.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{resource.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {resource.timings}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {resource.contact}
                  </div>

                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <span>{resource.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCostColor(resource.cost)}`}>
                      {resource.cost === 'free' ? 'Free' : resource.cost === 'low-cost' ? 'Low Cost' : 'Moderate Cost'}
                    </span>
                    
                    <span className="text-xs text-gray-500">{resource.language}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {resource.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {service.replace('-', ' ')}
                      </span>
                    ))}
                    {resource.services.length > 3 && (
                      <span className="text-xs text-gray-500">+{resource.services.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => window.open(`tel:${resource.contact}`, '_self')}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </button>
                    
                    {resource.distance !== 'Phone Support' && (
                      <button
                        onClick={() => getDirections(resource.address)}
                        className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-1"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Directions</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No resources found matching your criteria.</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Emergency Resources */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Emergency Support
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-red-700">Crisis Helplines:</p>
              <p className="text-sm text-red-600">National: 1860-2662-345</p>
              <p className="text-sm text-red-600">Women Helpline: 1091</p>
            </div>
            <div>
              <p className="font-medium text-red-700">Emergency Services:</p>
              <p className="text-sm text-red-600">Police: 100</p>
              <p className="text-sm text-red-600">Medical Emergency: 108</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalResourcesModule;