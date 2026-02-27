# Sahayak

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Home Screen with a massive Panic Button (red, covers ~40% of screen) that triggers a voice alert and mock SMS notification to the saved guardian
- Guardian-Link screen: save/edit an emergency contact name and phone number (persisted in backend)
- The Intervener: mock "call screen" with a 10-minute background timer; after 10 minutes show a full-screen scam warning popup
- Verification Hub screen: 3 info cards -- "Police Rights," "Bank Safety," "Report a Scam" -- each with expandable detail text
- Demo Mode button on Home Screen: simulates an incoming fake "WhatsApp Video Call from CBI Officer" and triggers the Sahayak alert overlay
- Elderly-First UI: minimum 24px font, Navy Blue (#1a237e) and Bright Yellow (#FFD600) high-contrast palette, large tap targets, no complex gestures
- Trust Seal badge in app header

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store guardian contact (name + phone), panic log entries
2. Frontend screens: Home, Guardian-Link, Mock Call (Intervener), Verification Hub
3. Home screen: Panic Button (large red), Demo Mode button, nav to other screens
4. Guardian-Link: form to save contact, display saved contact
5. Mock Call screen: timer countdown, auto-popup at 10 min (also triggerable manually for demo)
6. Verification Hub: 3 expandable cards
7. Demo Mode overlay: fake incoming call UI from "CBI Officer," then Sahayak alert overlay
8. Voice alert using Web Speech API (SpeechSynthesis)
9. Header with Trust Seal icon

## UX Notes
- All buttons at least 64px tall, full-width or near-full-width
- Font sizes: headings 32px+, body 24px minimum
- Navy Blue background with Bright Yellow accents
- High contrast white text on dark backgrounds
- Panic Button occupies ~40% of home screen height
- Simple bottom tab navigation (no complex gestures)
- Demo Mode simulates the full scam scenario end-to-end
