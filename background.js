// Background service worker
class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    // Set up installation handler
    chrome.runtime.onInstalled.addListener(this.onInstalled.bind(this));
    
    // Set up message handlers
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
    
    // Set up tab update handlers
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  }

  async onInstalled(details) {
    if (details.reason === 'install') {
      // First time installation
      await this.initializeDefaultData();
      
      // Open options page
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
      
      console.log('Job Application Form Filler installed successfully!');
    }
  }

  async initializeDefaultData() {
    // Initialize with empty user data structure
    const defaultUserData = {
      // Personal Information
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      
      // Professional Information
      currentTitle: '',
      currentCompany: '',
      experience: '',
      
      // Education
      university: '',
      degree: '',
      major: '',
      graduationYear: '',
      
      // Additional
      linkedin: '',
      portfolio: '',
      coverLetter: ''
    };

    await chrome.storage.local.set({ userData: defaultUserData });
  }

  onMessage(message, sender, sendResponse) {
    if (message.action === 'fieldsDetected') {
      // Update badge to show field count
      if (message.count > 0) {
        chrome.action.setBadgeText({
          text: message.count.toString(),
          tabId: sender.tab.id
        });
        
        chrome.action.setBadgeBackgroundColor({
          color: '#4CAF50',
          tabId: sender.tab.id
        });
      }
    }
    
    return false;
  }

  onTabUpdated(tabId, changeInfo, tab) {
    // Clear badge when navigating to new page
    if (changeInfo.status === 'loading') {
      chrome.action.setBadgeText({ text: '', tabId });
    }
  }
}

// Initialize the background service
const backgroundService = new BackgroundService();