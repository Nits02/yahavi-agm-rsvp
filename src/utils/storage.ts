import { RSVPFormData } from '../types/form';

// Simple in-memory storage that persists across browser sessions
// In a real production environment, this would be replaced with a proper database
class RSVPStorageManager {
  private static readonly STORAGE_KEY = 'yahavi-agm-responses-global';
  private static responses: RSVPFormData[] = [];
  private static isInitialized = false;

  // Initialize storage from localStorage
  static initialize(): void {
    if (this.isInitialized) return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.responses = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error loading stored responses:', error);
      this.responses = [];
    }
    
    this.isInitialized = true;
  }

  // Save responses to localStorage
  private static saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.responses));
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  }

  // Get all responses
  static getResponses(): RSVPFormData[] {
    this.initialize();
    return [...this.responses];
  }

  // Add a new response
  static addResponse(newResponse: RSVPFormData): void {
    this.initialize();
    
    // Check for duplicate email
    const existingResponse = this.responses.find(
      r => r.email.toLowerCase() === newResponse.email.toLowerCase()
    );
    
    if (existingResponse) {
      throw new Error('This email has already been registered');
    }

    this.responses.unshift(newResponse);
    this.saveToStorage();
  }

  // Get existing emails
  static getExistingEmails(): string[] {
    this.initialize();
    return this.responses.map(r => r.email.toLowerCase());
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    this.initialize();
    return this.responses.some(r => r.email.toLowerCase() === email.toLowerCase());
  }

  // Get response count
  static getResponseCount(): number {
    this.initialize();
    return this.responses.length;
  }

  // Get attendance statistics
  static getAttendanceStats() {
    this.initialize();
    const stats = this.responses.reduce((acc, response) => {
      acc[response.attendance] = (acc[response.attendance] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.responses.length,
      yes: stats.yes || 0,
      undecided: stats.undecided || 0,
      no: stats.no || 0
    };
  }

  // Clear all responses (admin function)
  static clearAllResponses(): void {
    this.responses = [];
    this.saveToStorage();
  }
}

export { RSVPStorageManager };