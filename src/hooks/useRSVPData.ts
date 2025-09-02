// Custom hook for managing RSVP data with hybrid storage
import { useState, useEffect } from 'react';
import { RSVPFormData } from '../types/form';

export const useRSVPData = () => {
  const [responses, setResponses] = useState<RSVPFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load responses on mount
  useEffect(() => {
    loadResponses();
  }, []);

  // Save to localStorage whenever responses change
  useEffect(() => {
    if (responses.length > 0 || !isLoading) {
      localStorage.setItem('yahavi-agm-responses', JSON.stringify(responses));
    }
  }, [responses, isLoading]);

  const loadResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from server first
      try {
        const response = await fetch('/api/responses.json');
        if (response.ok) {
          const serverData = await response.json();
          if (Array.isArray(serverData) && serverData.length > 0) {
            setResponses(serverData);
            setIsLoading(false);
            return;
          }
        }
      } catch (serverError) {
        console.log('Server data not available, using localStorage');
      }

      // Fallback to localStorage
      const savedResponses = localStorage.getItem('yahavi-agm-responses');
      if (savedResponses) {
        const localData = JSON.parse(savedResponses);
        setResponses(Array.isArray(localData) ? localData : []);
      } else {
        setResponses([]);
      }
    } catch (err) {
      console.error('Error loading responses:', err);
      setError('Failed to load responses');
      setResponses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addResponse = async (newResponse: RSVPFormData): Promise<void> => {
    try {
      // Check for duplicate email
      const existingEmails = responses.map(r => r.email.toLowerCase());
      if (existingEmails.includes(newResponse.email.toLowerCase())) {
        throw new Error('This email has already been registered');
      }

      const updatedResponses = [newResponse, ...responses];
      
      // Try to save to server
      try {
        const response = await fetch('/api/save-responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedResponses),
        });

        if (!response.ok) {
          throw new Error('Server save failed');
        }
      } catch (serverError) {
        console.log('Server save failed, using localStorage only');
      }

      // Update local state (this will trigger localStorage save via useEffect)
      setResponses(updatedResponses);
    } catch (err) {
      console.error('Error adding response:', err);
      throw err;
    }
  };

  const getExistingEmails = (): string[] => {
    return responses.map(r => r.email.toLowerCase());
  };

  const getAttendanceStats = () => {
    const stats = responses.reduce((acc, response) => {
      acc[response.attendance] = (acc[response.attendance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: responses.length,
      yes: stats.yes || 0,
      undecided: stats.undecided || 0,
      no: stats.no || 0
    };
  };

  return {
    responses,
    isLoading,
    error,
    addResponse,
    getExistingEmails,
    getAttendanceStats,
    refreshResponses: loadResponses
  };
};