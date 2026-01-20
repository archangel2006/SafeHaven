# 📊 Dashboard & Analytics - Testing Guide

## Quick Test Checklist

### ✅ Visual Testing

**1. Page Load**
- [ ] Dashboard loads within 2 seconds
- [ ] All three main cards are visible
- [ ] Gradient background displays correctly
- [ ] Header and back button are functional

**2. Personal Safety Score**
- [ ] Location detection prompt appears
- [ ] Score circle displays a number (0-100)
- [ ] Score circle color matches safety level:
  - Green: 80-100
  - Orange: 60-79
  - Red: 0-59
- [ ] Four sub-scores display correctly
- [ ] Refresh button works
- [ ] Alert banner appears if score < 60

**3. Historical Disaster Chart**
- [ ] Chart.js library loads
- [ ] Line chart displays with 4 disaster types
- [ ] All filter buttons work
- [ ] Statistics update when filtering
- [ ] Chart updates smoothly when filtered
- [ ] Legend displays at bottom
- [ ] Hover tooltips show data

**4. Resource Availability**
- [ ] All 10 resources display
- [ ] Status badges show correct colors:
  - Green: High
  - Orange: Medium
  - Red: Low
  - Dark Red: Critical (pulsing)
- [ ] Progress bars match capacity percentages
- [ ] Filter buttons work for all categories
- [ ] Distance shows for each resource
- [ ] Refresh button updates data

**5. Responsive Design**
- [ ] Desktop (1200px+): 3-column grid
- [ ] Tablet (768-1199px): 2-column grid
- [ ] Mobile (<768px): 1-column stack
- [ ] All text remains readable
- [ ] Buttons are touch-friendly

---

## 🧪 Functional Testing

### Test Scenarios:

#### Scenario 1: First-Time User
```
1. Open Dashboard.html
2. Observe location prompt
3. Allow/Deny location access
4. Verify default or actual location displays
5. Check all cards load with data
```

#### Scenario 2: Filter Interactions
```
1. Click "Earthquakes" filter
2. Verify chart shows only earthquake data
3. Click "All" to reset
4. Test each disaster type filter
5. Verify statistics update correctly
```

#### Scenario 3: Resource Filtering
```
1. Click "Shelters" filter
2. Verify only shelter resources show
3. Test all resource type filters
4. Click "All" to show all resources
5. Verify count matches
```

#### Scenario 4: Refresh Actions
```
1. Note current safety score
2. Click refresh button
3. Verify new score generates
4. Check timestamp updates
5. Verify sub-scores recalculate
```

#### Scenario 5: Mobile Experience
```
1. Open in mobile browser or use DevTools
2. Verify single-column layout
3. Test all buttons are tappable
4. Check charts are readable
5. Verify no horizontal scroll
```

---

## 🔍 Browser Compatibility

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🐛 Known Issues & Limitations

### Current Limitations:
1. **Demo Data**: Uses simulated data, not real disaster APIs
2. **Location**: May require HTTPS for location services
3. **Static Resources**: Resource list is hardcoded
4. **No Backend**: All calculations done client-side

### Expected Warnings:
- Location permission prompt on first load
- Chart.js console logs (normal)
- Geolocation denied (fallback to default location)

---

## 📊 Performance Testing

### Metrics to Check:

**Load Performance:**
```javascript
// Open Browser Console and run:
performance.mark('dashboardLoaded');
console.log('Load time:', performance.now());
```

**Memory Usage:**
```
1. Open DevTools > Performance
2. Record for 30 seconds
3. Interact with filters and refreshes
4. Check memory doesn't leak
```

---

## 🎯 Automated Testing Script

Copy and paste into browser console:

```javascript
// Dashboard Automated Test Suite
console.log('🧪 Starting Dashboard Tests...');

const tests = {
    checkSafetyScore() {
        const score = document.getElementById('safetyScore').textContent;
        return score !== '--' && !isNaN(score);
    },
    
    checkChart() {
        return disasterChart !== null && disasterChart.data;
    },
    
    checkResources() {
        const resources = document.querySelectorAll('.resource-item');
        return resources.length === 10;
    },
    
    checkLocation() {
        const loc = document.getElementById('userLocation').textContent;
        return loc !== 'Detecting location...';
    },
    
    checkFilters() {
        const filters = document.querySelectorAll('.filter-btn');
        return filters.length > 0;
    }
};

// Run all tests
Object.keys(tests).forEach(test => {
    const result = tests[test]();
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
});

console.log('🏁 Testing complete!');
```

---

## 🔧 Debugging Tips

### Common Issues:

**Chart Not Displaying:**
```javascript
// Check if Chart.js loaded
console.log(typeof Chart); // Should be 'function'

// Check if canvas exists
console.log(document.getElementById('disasterChart')); // Should not be null
```

**Location Not Working:**
```javascript
// Check geolocation support
console.log('Geolocation:', 'geolocation' in navigator);

// Test location manually
navigator.geolocation.getCurrentPosition(
    pos => console.log('✅ Location:', pos.coords),
    err => console.error('❌ Error:', err.message)
);
```

**Resources Not Rendering:**
```javascript
// Check resource data
console.log('Resources:', resourceData.length);

// Check DOM element
console.log('Container:', document.getElementById('resourceList'));
```

---

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Full dashboard (desktop view)
- [ ] Mobile responsive view
- [ ] Each filter state
- [ ] High safety score (green)
- [ ] Low safety score (red) with alert
- [ ] Resource list with all statuses
- [ ] Chart with different filters

---

## 🚀 Deployment Testing

Before deploying:

1. **Test on localhost**
   ```
   Open: file:///path/to/Dashboard.html
   ```

2. **Test on local server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

3. **Test on staging environment**
   - Deploy to test server
   - Verify HTTPS works
   - Test location services
   - Check all CDN resources load

4. **Production checklist**
   - [ ] All console errors cleared
   - [ ] No 404 errors
   - [ ] Performance optimized
   - [ ] Analytics configured
   - [ ] Error tracking enabled

---

## 📝 Test Report Template

```
Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

RESULTS:
✅ Pass  ❌ Fail  ⚠️ Warning

[ ] Safety Score Display
[ ] Chart Visualization
[ ] Resource Tracking
[ ] Filters Functional
[ ] Responsive Design
[ ] Performance Acceptable

Notes:
_______________________
_______________________

Issues Found:
_______________________
_______________________
```

---

## 🎓 User Acceptance Testing

Ask real users to:
1. Navigate to dashboard
2. Check their safety score
3. Explore disaster trends
4. Find nearest resources
5. Provide feedback on usability

**Feedback Questions:**
- Is the safety score easy to understand?
- Are the charts helpful?
- Can you easily find resources?
- Is anything confusing?
- What would you improve?

---

## ✨ Success Criteria

The dashboard is ready for release when:
- ✅ All visual tests pass
- ✅ All functional tests pass
- ✅ Works in all major browsers
- ✅ Responsive on all devices
- ✅ Performance meets targets
- ✅ No console errors
- ✅ User feedback is positive

---

**Happy Testing! 🎉**
