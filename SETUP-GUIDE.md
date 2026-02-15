# 📋 COMPLETE GOOGLE SHEETS SETUP GUIDE
## Connect Your Contact Form to Google Sheets

---

## 🎯 WHAT YOU'VE DONE SO FAR ✅
- Created a Google Spreadsheet
- Added columns: Timestamp, Fullname, Email, Phone, Message
- Created the Apps Script with doPost function

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### STEP 1: COMPLETE YOUR GOOGLE APPS SCRIPT

1. **Open your Google Spreadsheet**
2. **Go to Extensions > Apps Script**
3. **Replace ALL the code** with this COMPLETE script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Create timestamp
    var timestamp = new Date();
    
    // Prepare row data (matches your columns)
    var rowData = [
      timestamp,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.message || ''
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    // Optional: Send email notification to you
    sendEmailNotification(data);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({'result':'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({'result':'error', 'error': error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Email notification function
function sendEmailNotification(data) {
  try {
    var emailAddress = "YOUR_EMAIL@gmail.com"; // ⚠️ REPLACE WITH YOUR EMAIL
    var subject = "🔔 New Contact Form Submission - Stryde Coaching";
    
    var body = "You have received a new contact form submission:\n\n" +
               "📝 Name: " + data.fullName + "\n" +
               "📧 Email: " + data.email + "\n" +
               "📱 Phone: " + data.phone + "\n" +
               "💬 Message: " + data.message + "\n\n" +
               "---\n" +
               "Submitted via Stryde Coaching Contact Form";
    
    MailApp.sendEmail(emailAddress, subject, body);
  } catch(error) {
    // Email failed but don't stop the form submission
    console.error("Email notification failed:", error);
  }
}

// Test function (optional - for testing)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        message: "This is a test message"
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. **IMPORTANT: Replace `YOUR_EMAIL@gmail.com`** with your actual email address (line 37)

---

### STEP 2: DEPLOY YOUR WEB APP

1. **Click the "Deploy" button** (top right corner) → Select "New deployment"

2. **Configure the deployment:**
   - Click the ⚙️ (gear icon) next to "Select type"
   - Choose **"Web app"**

3. **Fill in the details:**
   - **Description:** "Contact Form Handler" (or any name you want)
   - **Execute as:** Select **"Me (your@email.com)"**
   - **Who has access:** Select **"Anyone"** ⚠️ IMPORTANT!

4. **Click "Deploy"**

5. **Authorize the app:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" (if you see a warning)
   - Click "Go to [Your Project] (unsafe)"
   - Click "Allow"

6. **COPY THE WEB APP URL** 
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - **COPY THIS ENTIRE URL** - you'll need it in the next step!

---

### STEP 3: UPDATE YOUR FORM.JS FILE

1. **Open your `form.js` file**

2. **Find line 11:**
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

3. **Replace it with your copied URL:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

4. **Save the file**

---

### STEP 4: UPLOAD FILES TO YOUR WEBSITE

Upload these 3 files to your website:
- ✅ `contact.html` (to your root directory or wherever your HTML files are)
- ✅ `contact.css` (to your `css/` folder)
- ✅ `form.js` (to your `js/` folder)

---

## 🧪 TESTING YOUR FORM

### Test 1: Consent Checkbox Validation
1. Go to your contact page
2. Fill in all fields
3. **DON'T check the consent checkbox**
4. Click "SEND"
5. **Expected result:** ⚠️ You should see:
   - Red border around checkbox
   - Pink background
   - Error message: "Please accept the consent checkbox..."

### Test 2: Form Submission
1. Fill in all fields correctly
2. **CHECK the consent checkbox**
3. Click "SEND"
4. **Expected result:**
   - Button changes to "SENDING..."
   - Thank you modal appears with confetti! 🎉
   - Check your Google Sheet - new row should appear
   - Check your email - you should receive a notification

---

## 🐛 TROUBLESHOOTING

### Problem: Form doesn't submit / No data in Google Sheets

**Solution 1: Check the URL**
- Make sure you copied the ENTIRE URL from deployment
- URL should end with `/exec` not `/dev`
- Make sure there are NO spaces before or after the URL

**Solution 2: Check deployment settings**
- Go back to Apps Script
- Click "Deploy" → "Manage deployments"
- Make sure "Who has access" is set to **"Anyone"**
- If not, click edit (pencil icon), change it, and redeploy

**Solution 3: Check browser console**
- Press F12 in your browser
- Go to "Console" tab
- Try submitting the form
- Look for error messages
- Common error: "Failed to fetch" means wrong URL

### Problem: Email notifications not working

**Solution:**
- Make sure you replaced `YOUR_EMAIL@gmail.com` with your real email
- The form will still work even if emails fail
- Check your spam folder

### Problem: Consent checkbox warning not showing

**Solution:**
- Clear your browser cache
- Make sure you uploaded the new `form.js` file
- Check browser console for JavaScript errors

---

## 📊 VIEWING YOUR SUBMISSIONS

**In Google Sheets:**
1. Open your spreadsheet
2. All submissions appear in real-time
3. Each row shows: Timestamp, Name, Email, Phone, Message

**In Your Email:**
1. You'll get instant email notifications
2. Subject: "🔔 New Contact Form Submission - Stryde Coaching"
3. Contains all the submission details

---

## 🎨 WHAT THE USER EXPERIENCES

1. **Fills out form**
2. **Forgets to check consent** → Gets warning with red border
3. **Checks consent and clicks SEND**
4. **Button shows "SENDING..."**
5. **Beautiful modal appears** with:
   - ✅ Animated checkmark
   - 🎉 Confetti falling
   - ⭐ Floating celebration icons
   - 📧 Confirmation message
   - 🏠 "Go Back Home" button
6. **Form resets** for next submission

---

## 🔒 SECURITY NOTES

- The form uses `mode: 'no-cors'` which is required for Google Apps Script
- Your email address is only visible in the Apps Script (not in the website code)
- Google Sheets is private - only you can see submissions
- Email notifications are sent securely through Google's servers

---

## 📱 MOBILE RESPONSIVE

All features work perfectly on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile phones

The modal automatically adjusts to screen size!

---

## ✅ CHECKLIST

Before going live, confirm:
- [ ] Google Apps Script is deployed
- [ ] "Who has access" is set to "Anyone"
- [ ] You copied the web app URL correctly
- [ ] URL is pasted in form.js (line 11)
- [ ] Your email is in the script (line 37)
- [ ] All 3 files are uploaded to your website
- [ ] You tested the form and it works
- [ ] Data appears in Google Sheets
- [ ] Email notification received

---

## 🎉 YOU'RE DONE!

Your contact form is now:
- ✅ Connected to Google Sheets
- ✅ Sending email notifications
- ✅ Validating consent checkbox
- ✅ Showing beautiful thank you modal
- ✅ Mobile responsive
- ✅ Production ready!

---

## 💡 TIPS

1. **Backup your Google Sheet** regularly
2. **Check spam folder** for email notifications
3. **Monitor submissions** in Google Sheets
4. **Test the form** after any website updates
5. **Share the thank you modal** - users can share on social media!

---

## 📞 NEED HELP?

If you're stuck:
1. Check the troubleshooting section above
2. Open browser console (F12) and look for errors
3. Verify all steps were completed correctly
4. Make sure files are uploaded to correct folders

---

**Last Updated:** February 2026
**Version:** 2.0 - With Consent Validation & Modal
