import { useState, useEffect } from 'react';

interface Farmer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  farmerId: string;
  location: {
    state: string;
    district: string;
    village: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails: {
    totalArea: number;
    croppingPattern: string[];
    soilType: string;
    irrigationType: string;
  };
  profile: {
    age?: number;
    gender?: string;
    education?: string;
    experience?: number;
  };
  carbonProjects: any[];
  isActive: boolean;
  registrationDate: string;
  lastUpdated: string;
}

export function useFarmerAuth() {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing farmer session on mount
    checkFarmerSession();
  }, []);

  const checkFarmerSession = () => {
    try {
      const farmerData = localStorage.getItem('farmer');
      if (farmerData) {
        const parsedFarmer = JSON.parse(farmerData);
        setFarmer(parsedFarmer);
      }
    } catch (error) {
      console.error('Error parsing farmer session:', error);
      localStorage.removeItem('farmer');
    } finally {
      setIsLoading(false);
    }
  };

  const signInFarmer = async (farmerId: string, phone?: string) => {
    try {
      setIsLoading(true);
      
      // Try to find farmer by Farmer ID
      const response = await fetch(`/api/farmers/id/${farmerId.toUpperCase()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const farmerData = await response.json();
        
        // Verify phone number if provided
        if (phone && farmerData.phone !== phone) {
          throw new Error('Phone number does not match');
        }

        // Store farmer session
        localStorage.setItem('farmer', JSON.stringify(farmerData));
        setFarmer(farmerData);
        
        return { success: true, farmer: farmerData };
      } else {
        throw new Error('Farmer not found');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const registerFarmer = async (farmerData: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(farmerData)
      });

      if (response.ok) {
        const newFarmer = await response.json();
        
        // Store farmer session
        localStorage.setItem('farmer', JSON.stringify(newFarmer));
        setFarmer(newFarmer);
        
        return { success: true, farmer: newFarmer };
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOutFarmer = () => {
    localStorage.removeItem('farmer');
    setFarmer(null);
  };

  const updateFarmerData = async (updates: Partial<Farmer>) => {
    if (!farmer) return { success: false, error: 'No farmer logged in' };

    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/farmers/${farmer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedFarmer = await response.json();
        
        // Update local storage and state
        localStorage.setItem('farmer', JSON.stringify(updatedFarmer));
        setFarmer(updatedFarmer);
        
        return { success: true, farmer: updatedFarmer };
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    farmer,
    isLoading,
    isAuthenticated: !!farmer,
    signInFarmer,
    registerFarmer,
    signOutFarmer,
    updateFarmerData,
    checkFarmerSession
  };
}
