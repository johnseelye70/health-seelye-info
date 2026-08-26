# iOS & iPadOS Native App Conversion Roadmap

**Project:** Seelye Family Health (`health-seelye-info`)  
**Target:** Native iOS / iPadOS App (App Store / TestFlight) + Desktop/Laptop Web Application  
**Architecture:** Single Shared Codebase (Next.js + React + Tailwind CSS + Capacitor)

---

## 1. Executive Summary & Strategy

This document outlines the end-to-end plan to package the existing **Seelye Family Health** Next.js/React web application into a native **iOS and iPadOS** application using **Capacitor (by Ionic)** while seamlessly maintaining the production web application (`https://health.seelye.info`) for desktop and laptop computers.

### Core Objectives:
1. **Single Source of Truth**: Maintain 100% of feature development (recipes, workouts, fasting engine, macro calculators) within the current React/Next.js repository.
2. **Native Apple HealthKit Integration**: Unlock silent background synchronization of Apple Watch steps, active energy burn (calories), and heart rate data via native iOS HealthKit APIs (`HKHealthStore`).
3. **Native iOS UX**: Enable native haptic feedback (Taptic Engine), lock-screen alerts for fasting/hydration windows, and a dedicated App Store / home screen icon.
4. **Desktop Preservation**: Keep the existing desktop and laptop experience fully functional via web browsers without separate codebases.

---

## 2. Architecture Comparison

```
                         [ Single Shared Codebase ]
                      (Next.js + React + Tailwind CSS)
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
      [ Desktop / Laptop ]                         [ iPhone & iPad ]
    Hosted on Web (Vercel/Cloud)                Native iOS App (Xcode / App Store)
    • Standard Safari/Chrome/Edge               • Native Apple HealthKit Access
    • Full responsive wide layout               • Native Haptic Feedback & Alerts
    • health.seelye.info                        • Standalone Home Screen Icon
```

---

## 3. Implementation Phases

### Phase 1: Capacitor Core Installation
Install the required Capacitor CLI and iOS runtime libraries:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capgo/capacitor-healthkit @capacitor/haptics
npx cap init "Seelye Health" "info.seelye.health" --web-dir "out"
```

### Phase 2: Next.js Static Export Configuration
In `next.config.mjs`, enable static HTML export for the Capacitor native build bundle:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.CAPACITOR_BUILD ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### Phase 3: Native Apple HealthKit Bridge Integration
In `context/HealthContext.tsx`, detect the native runtime dynamically:
```typescript
import { Capacitor } from '@capacitor/core';
import { HealthKit } from '@capgo/capacitor-healthkit';

export const syncStepsFromHealthKit = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // 1. Request Apple Health read authorization
      await HealthKit.requestAuthorization({
        read: ['steps', 'calories', 'activity'],
        write: [],
      });

      // 2. Query today's deduplicated steps directly from Apple Health
      const result = await HealthKit.queryHKitSampleType({
        sampleName: 'stepCount',
        startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date().toISOString(),
      });

      const totalSteps = result.resultData.reduce((sum, item) => sum + item.value, 0);
      return totalSteps;
    } catch (err) {
      console.warn('Native HealthKit sync error:', err);
    }
  }
  return null;
};
```

### Phase 4: iOS Native Project Generation & Xcode Build
```bash
# Build the web bundle
npm run build

# Generate and sync the native Xcode workspace
npx cap add ios
npx cap sync ios

# Open Xcode
npx cap open ios
```

In Xcode:
1. Under **Signing & Capabilities**, select your Apple Developer Team.
2. Add the **HealthKit** capability.
3. In `Info.plist`, add the usage descriptions:
   - `NSHealthShareUsageDescription`: *"Seelye Health requires access to your Apple Health steps and active energy to synchronize your daily movement goals."*
4. Run on a physical iPhone or deploy to **TestFlight**.

---

## 4. Hardware & Account Prerequisites

1. **Mac Computer**: macOS running **Xcode 15+** (required by Apple for signing iOS binaries).
2. **Apple Developer Account**:
   - **Free Personal Apple ID**: Free USB/Wi-Fi sideloading directly to your personal iPhone/iPad.
   - **Apple Developer Program ($99/yr)**: Required for TestFlight over-the-air installs (instant updates for family) or public App Store distribution.

---

## 5. Maintenance Workflow

When new features are added:
1. Run `npm run build`
2. Run `npx cap sync`
3. Commit and push to Git. The web app and iOS app remain 100% in sync with zero divergence.
