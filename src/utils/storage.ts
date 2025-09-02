// Storage utility for RSVP responses using JSON file
import { RSVPFormData } from '../types/form';

const STORAGE_FILE = '/api/responses.json';

export class RSVPStorage {
  private static responses: RSVPFormData[] = [];
  private static isLoaded = false;

  // Load responses from JSON file
  static async loadResponses(): Promise<RSVPFormData[]> {
    if (this.isLoaded) {
      return this.responses;
    }

    try {
      const response = await fetch(STORAGE_FILE);
      if (response.ok) {
        const data = await response.json();
        this.responses = Array.isArray(data) ? data : [];
      } else {
        this.responses = [];
      }
    } catch (error) {
      console.log('No existing responses file found, starting fresh');
      this.responses = [];
    }

    this.isLoaded = true;
    return this.responses;
  }

  // Save responses to JSON file
  static async saveResponses(responses: RSVPFormData[]): Promise<void> {
    try {
      const response = await fetch('/api/save-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      this.responses = responses;
    } catch (error) {
      console.error('Error saving responses:', error);
      throw error;
    }
  }

  // Add a new response
  static async addResponse(newResponse: RSVPFormData): Promise<void> {
    await this.loadResponses();
    
    // Check for duplicate email
    const existingResponse = this.responses.find(
      r => r.email.toLowerCase() === newResponse.email.toLowerCase()
    );
    
    if (existingResponse) {
      throw new Error('This email has already been registered');
    }

    const updatedResponses = [newResponse, ...this.responses];
    await this.saveResponses(updatedResponses);
  }

  // Get all responses
  static async getResponses(): Promise<RSVPFormData[]> {
    return await this.loadResponses();
  }

  // Get existing emails
  static async getExistingEmails(): Promise<string[]> {
    const responses = await this.loadResponses();
    return responses.map(r => r.email.toLowerCase());
  }
}