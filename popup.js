// Popup JavaScript functionality
class PopupController {
  constructor() {
    this.currentTab = null;
    this.detectedFields = [];
    this.init();
  }

  async init() {
    await this.getCurrentTab();
    this.setupEventListeners();
    this.loadQuickInfo();
    this.scanCurrentPage();
  }

  async getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabs[0];
  }

  setupEventListeners() {
    // Fill form button
    document.getElementById('fill-form').addEventListener('click', () => {
      this.fillForm();
    });

    // Scan fields button
    document.getElementById('scan-fields').addEventListener('click', () => {
      this.scanFields();
    });

    // Save quick info button
    document.getElementById('save-quick').addEventListener('click', () => {
      this.saveQuickInfo();
    });

    // Open settings button
    document.getElementById('open-settings').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    });

    // Auto-save on input change
    const quickInputs = ['quick-name', 'quick-email', 'quick-phone'];
    quickInputs.forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('change', () => {
        this.saveQuickInfo();
      });
    });
  }

  async loadQuickInfo() {
    const result = await chrome.storage.local.get(['userData']);
    const userData = result.userData || {};

    // Populate quick info fields
    document.getElementById('quick-name').value = userData.fullName || '';
    document.getElementById('quick-email').value = userData.email || '';
    document.getElementById('quick-phone').value = userData.phone || '';
  }

  async saveQuickInfo() {
    const quickData = {
      fullName: document.getElementById('quick-name').value,
      firstName: this.extractFirstName(document.getElementById('quick-name').value),
      lastName: this.extractLastName(document.getElementById('quick-name').value),
      email: document.getElementById('quick-email').value,
      phone: document.getElementById('quick-phone').value
    };

    // Get existing data and merge
    const result = await chrome.storage.local.get(['userData']);
    const userData = result.userData || {};
    
    Object.assign(userData, quickData);
    
    await chrome.storage.local.set({ userData });
    this.showMessage('Quick info saved!', 'success');
  }

  extractFirstName(fullName) {
    return fullName.split(' ')[0] || '';
  }

  extractLastName(fullName) {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  async scanCurrentPage() {
    if (!this.currentTab) return;

    try {
      // Update status
      this.updateStatus('Scanning page...', 'scanning');

      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'scanFields'
      });

      if (response && response.success) {
        this.detectedFields = response.fields;
        this.updateStatus(
          `${this.detectedFields.length} fields detected`,
          this.detectedFields.length > 0 ? 'ready' : 'none'
        );

        // Enable fill button if fields found
        const fillButton = document.getElementById('fill-form');
        fillButton.disabled = this.detectedFields.length === 0;

        if (this.detectedFields.length > 0) {
          this.displayDetectedFields();
        }
      } else {
        this.updateStatus('No form fields found', 'none');
      }
    } catch (error) {
      console.error('Error scanning page:', error);
      this.updateStatus('Unable to scan page', 'error');
    }
  }

  async scanFields() {
    await this.scanCurrentPage();
  }

  async fillForm() {
    if (!this.currentTab) return;

    try {
      // Show loading state
      const fillButton = document.getElementById('fill-form');
      const originalText = fillButton.innerHTML;
      fillButton.innerHTML = '<span class="btn-icon">⏳</span>Filling...';
      fillButton.disabled = true;

      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'fillForm'
      });

      if (response && response.success) {
        this.showSuccessMessage(`Successfully filled ${response.count} fields!`);
        // Rescan to update status
        setTimeout(() => this.scanCurrentPage(), 1000);
      } else {
        this.showMessage('Failed to fill form. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error filling form:', error);
      this.showMessage('Unable to fill form. Make sure the page is loaded.', 'error');
    } finally {
      // Restore button
      const fillButton = document.getElementById('fill-form');
      fillButton.innerHTML = '<span class="btn-icon">✨</span>Fill Form';
      fillButton.disabled = false;
    }
  }

  updateStatus(text, type) {
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.getElementById('status-indicator');
    const fieldsCount = document.getElementById('fields-count');

    statusText.textContent = text;
    
    // Reset classes
    statusIndicator.className = 'status-indicator';
    fieldsCount.className = 'fields-count';

    if (type === 'ready') {
      statusIndicator.classList.add('ready');
      fieldsCount.classList.add('ready');
      fieldsCount.textContent = `${this.detectedFields.length} fields`;
      fieldsCount.style.display = 'inline';
    } else if (type === 'error') {
      statusIndicator.classList.add('error');
      fieldsCount.style.display = 'none';
    } else if (type === 'none') {
      fieldsCount.style.display = 'none';
    } else {
      fieldsCount.style.display = 'none';
    }
  }

  displayDetectedFields() {
    const detectedFieldsDiv = document.getElementById('detected-fields');
    const fieldsList = document.getElementById('fields-list');

    if (this.detectedFields.length === 0) {
      detectedFieldsDiv.style.display = 'none';
      return;
    }

    // Create fields list
    fieldsList.innerHTML = '';
    this.detectedFields.forEach(field => {
      const fieldItem = document.createElement('div');
      fieldItem.className = 'field-item';
      
      const fieldType = document.createElement('span');
      fieldType.className = 'field-type';
      fieldType.textContent = this.formatFieldType(field.type);
      
      const fieldIdentifier = document.createElement('span');
      fieldIdentifier.className = 'field-identifier';
      fieldIdentifier.textContent = field.identifier || field.placeholder || 'Unknown field';
      
      fieldItem.appendChild(fieldType);
      fieldItem.appendChild(fieldIdentifier);
      fieldsList.appendChild(fieldItem);
    });

    detectedFieldsDiv.style.display = 'block';
  }

  formatFieldType(type) {
    const typeMap = {
      firstName: 'First Name',
      lastName: 'Last Name',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      country: 'Country',
      currentTitle: 'Job Title',
      currentCompany: 'Company',
      experience: 'Experience',
      university: 'University',
      degree: 'Degree',
      major: 'Major',
      graduationYear: 'Graduation Year',
      linkedin: 'LinkedIn',
      portfolio: 'Portfolio',
      coverLetter: 'Cover Letter'
    };

    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  }

  showSuccessMessage(text) {
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    successText.textContent = text;
    successMessage.style.display = 'flex';

    // Hide after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  }

  showMessage(text, type) {
    // Create a temporary message
    const message = document.createElement('div');
    message.className = type === 'error' ? 'error-message' : 'info-message';
    message.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      z-index: 1000;
      ${type === 'error' 
        ? 'background: #fdeaea; color: #e74c3c; border: 1px solid #f1c0c0;'
        : 'background: #d5f4e6; color: #27ae60; border: 1px solid #a8e6cf;'
      }
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});