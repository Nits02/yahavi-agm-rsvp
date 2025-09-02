import React, { useState } from 'react';
import { Building, Mail, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { RSVPFormData, FormErrors } from '../types/form';

interface RSVPFormProps {
  onSubmit: (data: RSVPFormData) => void;
  existingEmails: () => Promise<string[]>;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmit, existingEmails }) => {
  const [formData, setFormData] = useState({
    tower: '',
    wing: '',
    floor: '',
    flatNumber: '',
    email: '',
    attendance: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const towers = ['T1', 'T2', 'T3'];
  const wings = ['A', 'B'];
  const floors = ['G', ...Array.from({ length: 21 }, (_, i) => (i + 1).toString())];
  
  const getFlatNumbers = (floor: string) => {
    if (floor === 'G') {
      return ['1', '2', '3', '4'];
    }
    return ['1', '2', '3', '4', '5'];
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};
    const emails = await existingEmails();

    if (!formData.tower) newErrors.tower = 'Please select a tower';
    if (!formData.wing) newErrors.wing = 'Please select a wing';
    if (!formData.floor) newErrors.floor = 'Please select a floor';
    if (!formData.flatNumber) newErrors.flatNumber = 'Please select a flat number';
    if (!formData.email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (emails.includes(formData.email.toLowerCase())) {
      newErrors.email = 'This email has already been registered';
    }
    if (!formData.attendance) newErrors.attendance = 'Please select your attendance status';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateFlatNumber = () => {
    const towerNumber = formData.tower.replace('T', '0');
    const floorNumber = formData.floor === 'G' ? '00' : formData.floor.padStart(2, '0');
    const flatNumber = formData.flatNumber.padStart(2, '0');
    return `T${towerNumber}-${formData.wing}-${floorNumber}${flatNumber}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const rsvpData: RSVPFormData = {
        id: Date.now().toString(),
        tower: formData.tower,
        wing: formData.wing,
        floor: formData.floor,
        flatNumber: formData.flatNumber,
        fullFlatNumber: generateFlatNumber(),
        email: formData.email.toLowerCase(),
        attendance: formData.attendance as 'yes' | 'undecided' | 'no',
        submittedAt: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      await onSubmit(rsvpData);
      
      // Reset form
      setFormData({
        tower: '',
        wing: '',
        floor: '',
        flatNumber: '',
        email: '',
        attendance: ''
      });
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit RSVP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === 'floor') {
        updated.flatNumber = '';
      }
      
      return updated;
    });

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'yes': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'undecided': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'no': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Building className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yahavi (Oak | Pine | Teak) AGM RSVP</h2>
        <p className="text-gray-600">Please confirm your attendance for the upcoming Annual General Meeting!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Residence Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Residence Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tower */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tower <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tower}
                onChange={(e) => handleFieldChange('tower', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.tower ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Tower</option>
                {towers.map(tower => (
                  <option key={tower} value={tower}>{tower}</option>
                ))}
              </select>
              {errors.tower && <p className="mt-1 text-sm text-red-600">{errors.tower}</p>}
            </div>

            {/* Wing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wing <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.wing}
                onChange={(e) => handleFieldChange('wing', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.wing ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Wing</option>
                {wings.map(wing => (
                  <option key={wing} value={wing}>{wing}</option>
                ))}
              </select>
              {errors.wing && <p className="mt-1 text-sm text-red-600">{errors.wing}</p>}
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.floor}
                onChange={(e) => handleFieldChange('floor', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.floor ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Floor</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>
                    {floor === 'G' ? 'Ground' : `Floor ${floor}`}
                  </option>
                ))}
              </select>
              {errors.floor && <p className="mt-1 text-sm text-red-600">{errors.floor}</p>}
            </div>

            {/* Flat Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Number <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.flatNumber}
                onChange={(e) => handleFieldChange('flatNumber', e.target.value)}
                disabled={!formData.floor}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.flatNumber ? 'border-red-500' : 'border-gray-300'
                } ${!formData.floor ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select Flat</option>
                {formData.floor && getFlatNumbers(formData.floor).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              {errors.flatNumber && <p className="mt-1 text-sm text-red-600">{errors.flatNumber}</p>}
            </div>
          </div>

          {/* Generated Flat Number Preview */}
          {formData.tower && formData.wing && formData.floor && formData.flatNumber && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Complete Flat Number:</strong> {generateFlatNumber()}
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-blue-600" />
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Attendance Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            Will you attend the AGM? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {[
              { value: 'yes', label: 'Yes, I will attend', color: 'green' },
              { value: 'undecided', label: 'Not yet decided', color: 'amber' },
              { value: 'no', label: 'No, I will not attend', color: 'red' }
            ].map(option => (
              <label key={option.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  checked={formData.attendance === option.value}
                  onChange={(e) => handleFieldChange('attendance', e.target.value)}
                  className={`w-4 h-4 text-${option.color}-600 focus:ring-${option.color}-500 border-gray-300`}
                />
                <span className="ml-3 flex items-center text-gray-700 group-hover:text-gray-900">
                  {getAttendanceIcon(option.value)}
                  <span className="ml-2">{option.label}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.attendance && <p className="mt-1 text-sm text-red-600">{errors.attendance}</p>}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting RSVP...
              </span>
            ) : (
              'Submit RSVP'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};