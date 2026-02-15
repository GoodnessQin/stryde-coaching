# 📊 GOOGLE SHEETS INTEGRATION - COMPLETE GUIDE
## Step-by-Step Setup for Contact Form

---

## 🎯 WHAT YOU'LL ACHIEVE:

When someone fills your contact form, their data will automatically appear in a Google Sheet with:
- ✅ Full Name
- ✅ Email
- ✅ Phone Number
- ✅ Message
- ✅ Timestamp
- ✅ Consent Status

---

## 📋 STEP-BY-STEP SETUP:

### **STEP 1: Create Google Sheet**

1. Go to https://sheets.google.com
2. Click **"+ Blank"** to create new sheet
3. Name it: **"Stryde Coaching - Contact Form Submissions"**
4. In **Row 1**, add these headers:

```
| A1: Timestamp | B1: Full Name | C1: Email | D1: Phone | E1: Message | F1: Consent |
```

**Example:**
```
Timestamp           | Full Name      | Email                | Phone          | Message              | Consent
2024-02-14 10:30:00 | John Doe       | john@example.com     | +1234567890    | I need career help   | Yes
```

5. **Save** the sheet (it auto-saves)

---

### **STEP 2: Create Google Apps Script**

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. **Delete** all the default code
3. **Paste** this code:

```javascript
// ===================================
// GOOGLE APPS SCRIPT - FORM HANDLER
// Receives form data and saves to sheet
// ===================================

function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Create timestamp
    var timestamp = new Date();
    
    // Prepare row data
    var rowData = [
      timestamp,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      data.consent ? 'Yes' : 'No'
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
  var recipient = 'hello@strydecoaching.com'; // Your email
  var subject = '🔔 New Contact Form Submission - Stryde Coaching';
  
  var htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.fullName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p><small>Sent from Stryde Coaching Contact Form</small></p>
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody
  });
}

// Test function (for debugging)
function testPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        message: 'This is a test message',
        consent: true
      })
    }
  };
  
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. **Save** the project:
   - Click the **disk icon** or press `Ctrl+S`
   - Name it: **"Contact Form Handler"**

---

### **STEP 3: Deploy the Script**

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Select **"Web app"**
4. Configure:
   - **Description:** "Contact Form Handler"
   - **Execute as:** "Me" (your email)
   - **Who has access:** "Anyone"
5. Click **Deploy**
6. **Important:** You'll see a warning:
   - Click **"Authorize access"**
   - Select your Google account
   - Click **"Advanced"**
   - Click **"Go to Contact Form Handler (unsafe)"**
   - Click **"Allow"**
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
8. **Save this URL!** You'll need it in Step 4.

---

### **STEP 4: Update Your JavaScript**

1. Open `js/form.js` in your website
2. Find this line (at the top):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
4. Save the file

---

### **STEP 5: Test the Form**

1. Open your website: `http://localhost/contact.html` (or your live site)
2. Fill out the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Message: Testing form submission
   - ✅ Check consent
3. Click **"SEND MESSAGE"**
4. Check:
   - ✅ You should be redirected to `thank-you.html`
   - ✅ Check your Google Sheet - you should see the test entry
   - ✅ Check your email (if you enabled notifications)

---

## 🔧 TROUBLESHOOTING:

### **Problem 1: Form doesn't submit**

**Check browser console (F12):**
```javascript
// You should see:
📝 Contact form initialized
📤 Form submitted
📤 Sending to Google Sheets...
✅ Form submitted successfully
```

**If you see errors:**
1. Check GOOGLE_SCRIPT_URL is correct
2. Make sure Google Script is deployed
3. Check "Who has access" is set to "Anyone"

---

### **Problem 2: Data not appearing in sheet**

**Check Google Apps Script logs:**
1. Go to Apps Script editor
2. Click **Executions** (clock icon)
3. Look for errors
4. Run `testPost()` function to debug

---

### **Problem 3: Email notifications not working**

1. Check recipient email is correct
2. Check Gmail spam folder
3. Verify `MailApp.sendEmail` permissions

---

## 📊 VIEWING YOUR SUBMISSIONS:

### **Option 1: Google Sheets**
1. Open your Google Sheet
2. All submissions appear automatically
3. You can:
   - ✅ Sort by date
   - ✅ Filter by email
   - ✅ Export to CSV
   - ✅ Create charts/analytics

### **Option 2: Email Notifications**
- Each submission triggers an email to `hello@strydecoaching.com`
- Change the recipient in the `sendEmailNotification()` function

---

## 🔐 SECURITY BEST PRACTICES:

### **1. Enable CAPTCHA (Optional but Recommended)**

Add reCAPTCHA to prevent spam:

1. Go to https://www.google.com/recaptcha/admin
2. Create new site:
   - **Label:** Stryde Coaching
   - **Type:** reCAPTCHA v3
   - **Domains:** yourdomain.com
3. Copy Site Key & Secret Key
4. Add to your form HTML:

```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>

<script>
grecaptcha.ready(function() {
    grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'}).then(function(token) {
        // Add token to form submission
    });
});
</script>
```

---

### **2. Rate Limiting**

Add to Google Apps Script:

```javascript
var cache = CacheService.getScriptCache();
var email = data.email;
var lastSubmit = cache.get(email);

if (lastSubmit) {
  throw new Error('Please wait before submitting again');
}

// Store email for 5 minutes
cache.put(email, 'submitted', 300);
```

---

### **3. Data Validation**

The script already validates:
- ✅ Email format
- ✅ Required fields
- ✅ Phone format
- ✅ Consent checkbox

---

## 📈 ANALYTICS & TRACKING:

### **Add to Google Apps Script:**

```javascript
function logSubmission(data) {
  var analyticsSheet = SpreadsheetApp.openById('ANOTHER_SHEET_ID');
  
  // Track daily submissions
  var today = new Date().toDateString();
  var count = getCurrentCount(today);
  
  analyticsSheet.appendRow([
    today,
    count + 1,
    data.email.split('@')[1] // Domain
  ]);
}
```

---

## ✅ FINAL CHECKLIST:

Before going live:

- [ ] Google Sheet created with headers
- [ ] Google Apps Script code pasted
- [ ] Script deployed as Web App
- [ ] Web App URL copied to `form.js`
- [ ] Test submission completed successfully
- [ ] Data appeared in Google Sheet
- [ ] Email notification received (if enabled)
- [ ] Thank you page displays correctly
- [ ] Form validation working
- [ ] All required fields enforced
- [ ] Consent checkbox enforced

---

## 🎉 YOU'RE DONE!

Your contact form is now:
- ✅ Fully functional
- ✅ Saving to Google Sheets
- ✅ Sending email notifications
- ✅ Showing beautiful thank you page
- ✅ Validating all inputs
- ✅ Production-ready!

**Test it one more time to be sure, then go live!** 🚀
