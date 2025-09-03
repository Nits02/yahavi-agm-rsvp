import { useState, useEffect } from 'react';
import { RSVPFormData } from '../types/form';
import { RSVPStorageManager } from '../utils/storage';

export const useRSVPData = () => {
  const [responses, setResponses] = useState<RSVPFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load responses on mount
  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedResponses = RSVPStorageManager.getResponses();
      setResponses(loadedResponses);
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
      RSVPStorageManager.addResponse(newResponse);
      
      // Refresh the responses list
      const updatedResponses = RSVPStorageManager.getResponses();
      setResponses(updatedResponses);
    } catch (err) {
      console.error('Error adding response:', err);
      throw err;
    }
  };

  const getExistingEmails = (): string[] => {
    return RSVPStorageManager.getExistingEmails();
  };

  const getAttendanceStats = () => {
    return RSVPStorageManager.getAttendanceStats();
  };

  const refreshResponses = () => {
    loadResponses();
  };

  return {
    responses,
    isLoading,
    error,
    addResponse,
    getExistingEmails,
    getAttendanceStats,
    refreshResponses
  };
};