# AI Sales Agent Widget Embedding Guide

## Quick Start

Embed the AI Sales Agent widget on any website with this simple script:

```html
<!-- Add this to your website's <head> -->
<script>
window.AISalesAgent = {
  config: {
    // Your Hume AI configuration ID (optional)
    configId: 'your-config-id',
    // Custom styling (optional)
    theme: 'light', // 'light' or 'dark'
    position: 'bottom-right', // 'bottom-right', 'bottom-left', etc.
    // Trigger settings
    autoOpen: false,
    delayMs: 3000
  }
};
</script>
<script async src="https://your-domain.com/widget.js"></script>

<!-- Or use the iframe approach -->
<div id="ai-sales-agent"></div>
<script>
document.getElementById('ai-sales-agent').innerHTML = 
  '<iframe src="https://your-domain.com/widget" width="400" height="600" frameborder="0"></iframe>';
</script>
```

## Integration Options

### 1. Script Tag (Recommended)
- Lightweight loader
- Configurable appearance
- Responsive design
- Easy to install

### 2. Iframe Embed
- Complete isolation
- Full-featured interface
- Cross-origin compatible
- Zero conflicts

### 3. React Component
```jsx
import { AISalesAgent } from '@ai-sales-agent/widget';

function MyApp() {
  return (
    <div>
      <h1>My Website</h1>
      <AISalesAgent 
        configId="your-config-id"
        theme="dark"
        position="bottom-right"
      />
    </div>
  );
}
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `configId` | string | undefined | Hume AI configuration ID |
| `theme` | 'light' \| 'dark' | 'light' | Visual theme |
| `position` | string | 'bottom-right' | Widget position |
| `autoOpen` | boolean | false | Auto-open on page load |
| `delayMs` | number | 3000 | Auto-open delay |

## Customization

### CSS Variables
```css
:root {
  --ai-agent-primary: #your-brand-color;
  --ai-agent-background: #ffffff;
  --ai-agent-text: #333333;
  --ai-agent-border-radius: 12px;
}
```

### Event Handlers
```javascript
window.AISalesAgent.onLead = function(leadData) {
  // Handle qualified leads
  console.log('New lead:', leadData);
};

window.AISalesAgent.onPurchase = function(purchaseData) {
  // Handle successful purchases
  console.log('Purchase completed:', purchaseData);
};
```

## Development Setup

To create the embeddable widget from this application:

1. **Build standalone widget version:**
   ```bash
   npm run build:widget
   ```

2. **Create widget loader script:**
   - Minified JavaScript loader
   - Dynamic iframe/component injection
   - Configuration handling

3. **Host widget endpoint:**
   - Dedicated `/widget` route
   - Stripped-down UI for embedding
   - Optimized bundle size

## Security Considerations

- API keys should be environment-specific
- Use CORS headers for iframe embedding
- Validate all user inputs
- Secure payment processing
- Monitor for abuse/spam

## Next Steps

To complete the embedding system:
1. Implement `widget.js` loader script
2. Create `/widget` route with simplified UI
3. Add configuration management
4. Build deployment pipeline
5. Create documentation site