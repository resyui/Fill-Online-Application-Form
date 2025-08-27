// Content script for detecting and filling job application forms
class FormFiller {
  constructor() {
    this.userData = {};
    this.fieldMappings = {
      // Personal Information
      firstName: ['first-name', 'fname', 'firstname', 'given-name', 'forename'],
      lastName: ['last-name', 'lname', 'lastname', 'family-name', 'surname'],
      fullName: ['full-name', 'name', 'fullname', 'complete-name', 'applicant-name'],
      email: ['email', 'e-mail', 'email-address', 'mail', 'contact-email'],
      phone: ['phone', 'telephone', 'mobile', 'contact-number', 'phone-number'],
      address: ['address', 'street-address', 'location', 'residential-address'],
      city: ['city', 'town', 'locality'],
      state: ['state', 'province', 'region'],
      zipCode: ['zip', 'postal-code', 'postcode', 'zip-code'],
      country: ['country', 'nation'],
      
      // Professional Information
      currentTitle: ['current-title', 'job-title', 'position', 'current-position', 'title'],
      currentCompany: ['current-company', 'company', 'employer', 'current-employer', 'organization'],
      experience: ['experience', 'years-experience', 'work-experience', 'total-experience'],
      
      // Education
      university: ['university', 'college', 'school', 'education', 'alma-mater'],
      degree: ['degree', 'education-level', 'qualification'],
      major: ['major', 'field-of-study', 'specialization', 'subject'],
      graduationYear: ['graduation-year', 'grad-year', 'year-graduated'],
      
      // Additional
      linkedin: ['linkedin', 'linkedin-profile', 'linkedin-url'],
      portfolio: ['portfolio', 'website', 'personal-website', 'portfolio-url'],
      coverLetter: ['cover-letter', 'message', 'additional-info', 'comments', 'why-interested']
    };
  }

  async loadUserData() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['userData'], (result) => {
        this.userData = result.userData || {};
        resolve();
      });
    });
  }

  findFormFields() {
    const forms = document.querySelectorAll('form');
    const allFields = [];

    // Also check for fields outside forms
    const allInputs = document.querySelectorAll('input, textarea, select');
    
    allInputs.forEach(field => {
      if (this.isRelevantField(field)) {
        allFields.push(field);
      }
    });

    return allFields;
  }

  isRelevantField(field) {
    // Skip hidden, submit, button fields
    if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') {
      return false;
    }

    // Skip fields that are already filled
    if (field.value && field.value.trim() !== '') {
      return false;
    }

    // Check if field appears to be a job application field
    const fieldIdentifiers = [
      field.name?.toLowerCase() || '',
      field.id?.toLowerCase() || '',
      field.className?.toLowerCase() || '',
      field.placeholder?.toLowerCase() || '',
      field.getAttribute('data-test-id')?.toLowerCase() || '',
      field.getAttribute('aria-label')?.toLowerCase() || ''
    ].join(' ');

    // Look for common job application terms
    const jobApplicationTerms = [
      'name', 'email', 'phone', 'address', 'city', 'state', 'zip',
      'experience', 'company', 'title', 'position', 'university', 'degree',
      'linkedin', 'portfolio', 'cover', 'message', 'why', 'interested',
      'applicant', 'candidate', 'resume', 'cv', 'qualification'
    ];

    return jobApplicationTerms.some(term => fieldIdentifiers.includes(term));
  }

  detectFieldType(field) {
    const fieldText = [
      field.name?.toLowerCase() || '',
      field.id?.toLowerCase() || '',
      field.className?.toLowerCase() || '',
      field.placeholder?.toLowerCase() || '',
      field.getAttribute('data-test-id')?.toLowerCase() || '',
      field.getAttribute('aria-label')?.toLowerCase() || ''
    ].join(' ');

    // Find the best matching field type
    for (const [fieldType, keywords] of Object.entries(this.fieldMappings)) {
      if (keywords.some(keyword => fieldText.includes(keyword))) {
        return fieldType;
      }
    }

    // Additional pattern matching
    if (fieldText.includes('first') && fieldText.includes('name')) return 'firstName';
    if (fieldText.includes('last') && fieldText.includes('name')) return 'lastName';
    if (fieldText.includes('@') || fieldText.includes('email')) return 'email';
    if (fieldText.includes('phone') || fieldText.includes('mobile')) return 'phone';
    
    return null;
  }

  fillField(field, value) {
    if (!value) return false;

    try {
      // Set the value
      field.value = value;
      
      // Trigger events that many forms expect
      const events = ['input', 'change', 'blur'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        field.dispatchEvent(event);
      });

      // For React/Vue forms, also try setting the React/Vue specific events
      if (field._valueTracker) {
        field._valueTracker.setValue('');
      }

      // Trigger focus and blur to mimic user interaction
      field.focus();
      field.blur();

      return true;
    } catch (error) {
      console.error('Error filling field:', error);
      return false;
    }
  }

  async fillForm() {
    await this.loadUserData();
    
    const fields = this.findFormFields();
    let filledCount = 0;

    fields.forEach(field => {
      const fieldType = this.detectFieldType(field);
      if (fieldType && this.userData[fieldType]) {
        if (this.fillField(field, this.userData[fieldType])) {
          filledCount++;
          // Add visual feedback
          this.highlightField(field);
        }
      }
    });

    if (filledCount > 0) {
      this.showNotification(`Filled ${filledCount} fields successfully!`);
    } else {
      this.showNotification('No matching fields found on this page.');
    }

    return filledCount;
  }

  highlightField(field) {
    const originalBorder = field.style.border;
    field.style.border = '2px solid #4CAF50';
    field.style.transition = 'border 0.3s ease';
    
    setTimeout(() => {
      field.style.border = originalBorder;
    }, 2000);
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  // Method to scan and show detected fields (for debugging/preview)
  async scanFields() {
    const fields = this.findFormFields();
    const detectedFields = [];

    fields.forEach(field => {
      const fieldType = this.detectFieldType(field);
      if (fieldType) {
        detectedFields.push({
          element: field,
          type: fieldType,
          identifier: field.name || field.id || field.className,
          placeholder: field.placeholder
        });
      }
    });

    return detectedFields;
  }
}

// Initialize the form filler
const formFiller = new FormFiller();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    formFiller.fillForm().then(count => {
      sendResponse({ success: true, count });
    });
    return true; // Indicates async response
  }
  
  if (request.action === 'scanFields') {
    formFiller.scanFields().then(fields => {
      sendResponse({ 
        success: true, 
        fields: fields.map(f => ({
          type: f.type,
          identifier: f.identifier,
          placeholder: f.placeholder
        }))
      });
    });
    return true;
  }
});

// Auto-scan when page loads
window.addEventListener('load', () => {
  // Small delay to ensure all dynamic content is loaded
  setTimeout(() => {
    formFiller.scanFields().then(fields => {
      if (fields.length > 0) {
        // Store detected fields count for popup
        chrome.runtime.sendMessage({
          action: 'fieldsDetected',
          count: fields.length,
          url: window.location.href
        });
      }
    });
  }, 2000);
});

// CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);