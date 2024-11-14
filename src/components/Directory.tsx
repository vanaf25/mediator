import { useState, useEffect } from 'react';
import { MapPin, BookOpen, Globe2, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from "react-router-dom";
import { getMediators } from '../firebase/firestore';
import type { Mediator } from '../types';

export default function Directory() {
  const [mediators, setMediators] = useState<Mediator[]>([]);
  const [filteredMediators, setFilteredMediators] = useState<Mediator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    expertise: ''
  });
  useEffect(() => {
    const loadMediators = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMediators();
        const uniqueMediators = data.reduce((acc: Mediator[], current) => {
          const exists = acc.find(item => item.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        setMediators(uniqueMediators);
        setFilteredMediators(uniqueMediators);
      } catch (err) {
        setError('Unable to load mediators. Using locally cached data.');
        console.error('Error loading mediators:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMediators();
  }, []);

  useEffect(() => {
    const filtered = mediators.filter(mediator => {
      const stateMatch = !filters.state || mediator.state.toLowerCase().includes(filters.state.toLowerCase());
      const cityMatch = !filters.city || mediator.city.toLowerCase().includes(filters.city.toLowerCase());
      const expertiseMatch = !filters.expertise || 
        mediator.expertise.some(exp => exp.toLowerCase().includes(filters.expertise.toLowerCase()));
      return stateMatch && cityMatch && expertiseMatch;
    });
    setFilteredMediators(filtered);
  }, [filters, mediators]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Find a Mediator</h1>
        <p className="text-lg text-gray-600">Connect with qualified mediators in your area</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="State"
              className="pl-10 w-full p-2 border rounded-md"
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="City"
              className="pl-10 w-full p-2 border rounded-md"
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Area of Expertise"
              className="pl-10 w-full p-2 border rounded-md"
              onChange={(e) => setFilters(prev => ({ ...prev, expertise: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMediators.map((mediator) => (
            <Link to={`/userProfiles/${mediator.id}`}>
              <div key={mediator.id}
                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {mediator.profileImage && (
                        <img
                            src={mediator.profileImage}
                            alt={mediator.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{mediator.fullName}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="mr-1" size={14}/>
                        {mediator.city}, {mediator.state}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {mediator.expertise.map((exp, index) => (
                          <span
                              key={`${mediator.id}-${exp}-${index}`}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                      {exp}
                    </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <BookOpen className="mr-2" size={16}/>
                      {mediator.experience} years experience
                    </p>
                    {mediator.languages && (
                        <p className="flex items-center">
                          <Globe2 className="mr-2" size={16}/>
                          {mediator.languages.join(', ')}
                        </p>
                    )}
                    {mediator.hourlyRate && (
                        <p className="flex items-center">
                          <DollarSign className="mr-2" size={16}/>
                          {mediator.hourlyRate}
                        </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
}