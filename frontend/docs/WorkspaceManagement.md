# Workspace Management - EMS Frontend

## Overview

The Workspace Management module provides comprehensive organizational structure management and workspace customization capabilities for the Enterprise Management System. This module includes organization chart visualization, theme management, and workspace settings.

## Features

### 🏢 Organization Chart
- **Hierarchical Visualization**: Interactive tree structure showing reporting relationships
- **Expandable Nodes**: Collapsible teams and departments
- **Compact/Expanded Views**: Different viewing modes for various needs
- **Dark Mode Support**: Full theme-aware design
- **Department Statistics**: Team size and distribution metrics
- **Bulk Actions**: Expand/collapse all nodes at once

### 🎨 Theme Management
- **Theme Presets**: Pre-designed themes (Default, Midnight Blue, Forest Green, Warm Sunset, Royal Purple, Minimal Light)
- **Light/Dark Mode**: Complete dark mode implementation
- **Custom Colors**: Primary color customization
- **Live Preview**: Real-time theme preview
- **Persistence**: Theme preferences saved to localStorage

### ⚙️ Workspace Settings
- **General Configuration**: Workspace name, company details, timezone, currency
- **Notification Controls**: Email, push, and desktop notification preferences
- **Privacy Settings**: Profile visibility and activity sharing options
- **Security Configuration**: Two-factor authentication and session management
- **Import/Export**: Settings backup and restore functionality

## Components

### Core Components

#### `WorkspacePage.tsx`
Main workspace management page with tab navigation between Overview, Org Chart, Themes, and Settings.

#### `OrganizationChart.tsx`
Interactive organizational hierarchy viewer with expandable nodes and team statistics.

#### `WorkspaceThemeManager.tsx`
Comprehensive theme customization interface with presets and color selection.

#### `WorkspaceSettingsManager.tsx`
Detailed workspace configuration interface for all settings categories.

#### `ThemeContext.tsx`
Enhanced theme context supporting multiple themes, colors, and presets.

### UI Components Used
- `Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Input`, `Badge`
- `Avatar`, `AvatarImage`, `AvatarFallback`

## Navigation

The workspace is accessible via the main sidebar navigation:

- **Workspace** (Main entry point) - `/workspace`
- **Organization** (Direct org chart) - `/org-chart`

## File Structure

```
frontend/
├── components/
│   ├── OrganizationChart.tsx           # Interactive org chart
│   ├── WorkspaceThemeManager.tsx       # Theme customization
│   ├── WorkspaceSettingsManager.tsx     # Settings configuration
│   └── ui/                           # Reusable UI components
├── context/
│   └── ThemeContext.tsx               # Enhanced theme management
├── pages/
│   └── WorkspacePage.tsx               # Main workspace page
└── constants.tsx                      # Navigation items
```

## Theme Implementation

### Theme Types
- `light`: Light mode theme
- `dark`: Dark mode theme
- `auto`: System preference based theme

### Theme Presets
1. **Default**: Clean professional look
2. **Midnight Blue**: Dark blue for night usage
3. **Forest Green**: Natural calming tones
4. **Warm Sunset**: Energetic warm colors
5. **Royal Purple**: Elegant creative theme
6. **Minimal Light**: Simple focused interface

### CSS Variables
Themes utilize CSS custom properties for easy customization:
- `--primary-color`: Dynamic primary color
- Standard Tailwind CSS variables for consistency

## Data Models

### OrgNode Interface
```typescript
interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar: string;
  team?: OrgNode[];
}
```

### WorkspaceSettings Interface
```typescript
interface WorkspaceSettings {
  workspaceName: string;
  companyName: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  privacy: {
    showProfilePhoto: boolean;
    showOnlineStatus: boolean;
    shareActivity: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    autoLock: boolean;
  };
}
```

## Usage Examples

### Organization Chart
```typescript
<OrganizationChart />
```

### Theme Manager
```typescript
<WorkspaceThemeManager />
```

### Settings Manager
```typescript
<WorkspaceSettingsManager />
```

### Custom Theme Context
```typescript
const { theme, preset, primaryColor, toggleTheme, setPreset, setPrimaryColor } = useTheme();
```

## Customization

### Adding New Theme Presets
1. Add to `ThemePreset` type in `ThemeContext.tsx`
2. Add to `themePresets` array in `WorkspaceThemeManager.tsx`
3. Implement corresponding CSS classes or color schemes

### Extending Settings
1. Update `WorkspaceSettings` interface
2. Add form controls in `WorkspaceSettingsManager.tsx`
3. Implement save/load functionality

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order

## Performance

- **Lazy Loading**: Components load on demand
- **Local Storage**: Settings cached locally for instant access
- **Optimized Rendering**: Efficient re-renders with proper state management
- **Minimal Dependencies**: Lightweight theme implementation

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Responsive Design

- **Mobile**: Fully responsive layout with touch-friendly controls
- **Tablet**: Optimized for medium screens
- **Desktop**: Full-featured desktop experience

## Security

- **Local Storage**: Settings stored securely in localStorage
- **Input Validation**: All form inputs validated
- **XSS Protection**: Safe HTML rendering and sanitization

## Future Enhancements

1. **Real-time Collaboration**: Live workspace updates
2. **Advanced Theming**: Custom CSS upload capability
3. **Team Workspaces**: Multiple workspace management
4. **Analytics Dashboard**: Workspace usage metrics
5. **Integration Settings**: Third-party service connections

## Troubleshooting

### Theme Not Applying
- Check browser localStorage for theme data
- Verify CSS custom properties are loaded
- Clear browser cache and reload

### Settings Not Saving
- Check browser localStorage quota
- Verify network connectivity for API calls
- Clear corrupted localStorage data

### Org Chart Not Displaying
- Verify mock data structure is correct
- Check for JavaScript errors in console
- Ensure all dependencies are loaded

## Support

For issues and feature requests:
1. Check console for JavaScript errors
2. Verify all dependencies are installed
3. Clear browser cache and localStorage
4. Test in different browsers if needed