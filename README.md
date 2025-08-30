# 🚀 Job Application Form Filler

**Free up your time by automating the repetitive form filling process for job applications!**

A powerful Microsoft Edge/Chrome web extension that automatically detects and fills job application forms with your saved information. Perfect for job seekers who want to apply to multiple positions efficiently.

![Extension Demo](https://img.shields.io/badge/Extension-Microsoft%20Edge%20%7C%20Chrome-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

- **🎯 Smart Field Detection**: Automatically identifies form fields across different job sites
- **⚡ One-Click Filling**: Fill entire forms instantly with a single click
- **🔒 Privacy First**: All data stored locally - never sent to external servers
- **📱 User-Friendly Interface**: Clean, intuitive popup and settings interface
- **🎨 Visual Feedback**: Highlights filled fields and shows success notifications
- **💾 Import/Export**: Backup and restore your data easily
- **🔧 Customizable**: Manage all your information from a comprehensive settings page

## 🎯 Supported Fields

The extension can automatically fill these common job application fields:

**Personal Information:**
- First Name, Last Name, Full Name
- Email Address, Phone Number
- Street Address, City, State, ZIP Code, Country

**Professional Information:**
- Current Job Title, Current Company
- Years of Experience
- LinkedIn Profile, Portfolio/Website

**Education:**
- University/College, Degree
- Major/Field of Study, Graduation Year

**Additional:**
- Cover Letter/Message

## 📥 Installation

### Option 1: Load as Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone https://github.com/resyui/Fill-Online-Application-Form.git
   cd Fill-Online-Application-Form
   ```

2. **Open Edge/Chrome Extension Management**
   - **Microsoft Edge**: Go to `edge://extensions/`
   - **Google Chrome**: Go to `chrome://extensions/`

3. **Enable Developer Mode**
   - Toggle on "Developer mode" in the top-right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the downloaded extension folder
   - The extension will appear in your browser toolbar

### Option 2: Install from Chrome Web Store (Coming Soon)
*The extension will be available on the Chrome Web Store once reviewed and approved.*

## 🚀 Quick Start

### 1. Initial Setup
1. Click the extension icon in your browser toolbar
2. Click "Manage All Information" to open the settings page
3. Fill in your personal, professional, and educational information
4. Click "Save Information"

### 2. Using the Extension
1. Navigate to any job application form
2. Click the extension icon
3. The extension will scan the page and show detected fields
4. Click "Fill Form" to automatically populate the form
5. Review and submit your application

### 3. Test the Extension
- Open `test-form.html` in your browser to try the extension on a sample form
- This test page demonstrates all the field types the extension can detect

## 💡 Usage Tips

- **Fill Complete Information**: The more fields you complete in settings, the better the auto-fill experience
- **Review Before Submitting**: Always review filled forms before submission
- **Custom Cover Letters**: While the extension can fill a default cover letter, consider customizing it for each application
- **Works on Most Sites**: Compatible with LinkedIn, Indeed, company career pages, and most job application forms

## 🛠️ Technical Details

### File Structure
```
Fill-Online-Application-Form/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for form detection/filling
├── background.js          # Background service worker
├── options.html           # Settings page
├── options.js             # Settings functionality
├── test-form.html         # Sample test form
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### How It Works
1. **Content Script**: Scans web pages for form fields using multiple detection methods
2. **Field Matching**: Uses intelligent pattern matching to identify field types
3. **Data Storage**: Utilizes Chrome's local storage API for secure, local data storage
4. **Form Filling**: Programmatically fills fields and triggers appropriate events
5. **Visual Feedback**: Provides user feedback through notifications and field highlighting

### Supported Field Detection Methods
- **HTML Attributes**: `name`, `id`, `class`, `placeholder`, `aria-label`
- **Data Attributes**: `data-test-id`, `data-field-name`
- **Pattern Matching**: Intelligent keyword matching for field identification
- **Context Analysis**: Considers surrounding text and form structure

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript, HTML, CSS
- Chrome/Edge browser for testing

### Local Development
1. Clone the repository
2. Make changes to the code
3. Reload the extension in browser settings
4. Test on the provided `test-form.html` or real job sites

### Building
No build process required - this is a vanilla JavaScript extension.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution
- Additional field detection patterns
- Support for more form types
- UI/UX improvements
- Bug fixes and optimizations
- Documentation improvements

## 🐛 Troubleshooting

### Extension Not Detecting Fields?
- Make sure the page is fully loaded
- Try clicking "Scan Fields" manually
- Check if the form uses standard HTML form elements
- Some dynamic forms may need a page refresh

### Fields Not Filling Correctly?
- Verify your information is saved in the settings page
- Some forms may have additional validation that prevents auto-filling
- Try filling one section at a time for complex forms

### Extension Not Working?
- Check if the extension is enabled in your browser settings
- Try reloading the page
- Disable conflicting extensions temporarily

## 📱 Browser Compatibility

- ✅ Microsoft Edge (Chromium-based)
- ✅ Google Chrome
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

## 🔐 Privacy & Security

- **Local Storage Only**: All data is stored locally in your browser
- **No External Servers**: No data is sent to external servers
- **No Tracking**: The extension doesn't track your usage or collect analytics
- **Open Source**: Full code is available for review

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all job seekers who inspired this project
- Built with modern web extension APIs
- Icons created using Python PIL

## 📞 Support

Having issues? Here's how to get help:

1. **Check the troubleshooting section** above
2. **Test with the sample form** (`test-form.html`)
3. **Open an issue** on GitHub with detailed steps to reproduce
4. **Check existing issues** for similar problems

---

**⭐ Star this repository if it helps you land your dream job!**

Made with ❤️ for job seekers everywhere.