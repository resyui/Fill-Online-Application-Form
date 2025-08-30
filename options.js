// Options page JavaScript functionality
class OptionsController {
  constructor() {
    this.fields = [
      'firstName', 'lastName', 'fullName', 'email', 'phone', 'address', 
      'city', 'state', 'zipCode', 'country', 'currentTitle', 'currentCompany', 
      'experience', 'university', 'degree', 'major', 'graduationYear', 
      'linkedin', 'portfolio', 'coverLetter'
    ];
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadUserData();
    this.setupAutoSave();
  }

  setupEventListeners() {
    // Save button
    document.getElementById('save-data').addEventListener('click', () => {
      this.saveUserData();
    });

    // Import button
    document.getElementById('import-data').addEventListener('click', () => {
      this.importData();
    });

    // Export button
    document.getElementById('export-data').addEventListener('click', () => {
      this.exportData();
    });

    // Clear data button
    document.getElementById('clear-data').addEventListener('click', () => {
      this.clearAllData();
    });

    // File input for import
    document.getElementById('file-input').addEventListener('change', (e) => {
      this.handleFileImport(e);
    });

    // Auto-generate full name when first/last name changes
    document.getElementById('firstName').addEventListener('input', () => {
      this.updateFullName();
    });

    document.getElementById('lastName').addEventListener('input', () => {
      this.updateFullName();
    });
  }

  setupAutoSave() {
    // Auto-save every 2 seconds after changes
    let saveTimeout;
    
    this.fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.addEventListener('input', () => {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(() => {
            this.saveUserData(true); // Silent save
          }, 2000);
        });
      }
    });
  }

  async loadUserData() {
    const result = await chrome.storage.local.get(['userData']);
    const userData = result.userData || {};

    // Populate all fields
    this.fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element && userData[fieldId]) {
        element.value = userData[fieldId];
      }
    });
  }

  async saveUserData(silent = false) {
    const userData = {};
    
    // Collect data from all fields
    this.fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        userData[fieldId] = element.value.trim();
      }
    });

    // Save to storage
    await chrome.storage.local.set({ userData });

    if (!silent) {
      this.showSuccessMessage();
    }
  }

  updateFullName() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const fullNameField = document.getElementById('fullName');
    
    if (firstName || lastName) {
      fullNameField.value = `${firstName} ${lastName}`.trim();
    }
  }

  importData() {
    document.getElementById('file-input').click();
  }

  async handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validate imported data
      if (typeof importedData !== 'object' || importedData === null) {
        throw new Error('Invalid data format');
      }

      // Populate fields with imported data
      this.fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element && importedData[fieldId]) {
          element.value = importedData[fieldId];
        }
      });

      // Save the imported data
      await this.saveUserData();
      
      this.showMessage('Data imported successfully!', 'success');
    } catch (error) {
      this.showMessage('Error importing data. Please check the file format.', 'error');
      console.error('Import error:', error);
    }

    // Reset file input
    event.target.value = '';
  }

  async exportData() {
    const result = await chrome.storage.local.get(['userData']);
    const userData = result.userData || {};

    // Create and download JSON file
    const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-form-filler-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showMessage('Data exported successfully!', 'success');
  }

  async clearAllData() {
    const confirmed = confirm(
      'Are you sure you want to clear all your saved information? This action cannot be undone.'
    );

    if (!confirmed) return;

    // Clear storage
    await chrome.storage.local.remove(['userData']);

    // Clear all form fields
    this.fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.value = '';
      }
    });

    this.showMessage('All data cleared successfully!', 'success');
  }

  showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'flex';

    // Hide after 3 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  }

  showMessage(text, type) {
    // Create temporary message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      ${type === 'error'
        ? 'background: #fdeaea; color: #e74c3c; border: 1px solid #f1c0c0;'
        : 'background: #d5f4e6; color: #27ae60; border: 1px solid #a8e6cf;'
      }
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    // Animate in
    message.style.transform = 'translateX(100%)';
    message.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      message.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
      message.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (message.parentNode) {
          message.remove();
        }
      }, 300);
    }, 4000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
});