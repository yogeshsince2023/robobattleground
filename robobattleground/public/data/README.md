# How to Add a New Certificate (No coding required)

1. Go to github.com/[your-repo] in any browser
2. Click: public → data → certificates.json
3. Click the pencil (Edit) icon top right
4. Scroll to the last certificate entry
5. After the last }, add a comma then paste:
   {
     "id": "TRBG-2025-0016",
     "name": "Student Full Name",
     "track": "Combat Bot Design",
     "duration": "8 Weeks",
     "issueDate": "01 January 2025",
     "grade": "Excellent",
     "status": "valid"
   }
6. Make sure the id is the next number in sequence
7. Click "Commit changes" green button
8. Wait 90 seconds → certificate is live and verifiable

Available tracks:
- Combat Bot Design
- Embedded Systems & Control  
- Arena Operations & Event Management

Available grades:
- Outstanding
- Excellent  
- Good

IMPORTANT: Never change "status" from "valid" unless you want to revoke a certificate.
