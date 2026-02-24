# EHS Safety Tool - React Components

This document describes the React components created based on the HTML template analysis for the EHS Safety Tool project.

## Components Overview

### Core Components

#### `SafetyPlanDetail`
The main component that renders a complete safety plan detail page, including all sections.

**Props:**
- `title`: string - The safety plan title
- `status`: 'Active' | 'Draft' | 'Completed' - Current status
- `date`: string - Plan date
- `shift`: string - Work shift
- `location`: string - Work location
- `machine`: string - Equipment/machine
- `group`: string - Team/group name
- `safetyConcerns`: SafetyConcern[] - Array of safety concerns
- `hazards`: Hazard[] - Array of identified hazards
- `signOffs`: SignOff[] - Array of sign-off records

#### `InfoGrid`
Displays key information in a responsive 4-column grid layout.

**Props:**
- `items`: InfoItem[] - Array of {label: string, value: string}
- `className`: string (optional) - Additional CSS classes

#### `SafetyConcernBadge`
Displays individual safety concerns with icons and consistent styling.

**Props:**
- `title`: string - Concern title
- `icon`: React.ReactNode - Icon component
- `className`: string (optional) - Additional CSS classes

#### `HazardCard`
Displays hazard information with risk level, description, and mitigation plan.

**Props:**
- `title`: string - Hazard title
- `riskLevel`: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK'
- `description`: string - Hazard description
- `mitigationPlan`: string - Mitigation strategy
- `className`: string (optional) - Additional CSS classes

#### `SignOffCard`
Displays sign-off information for team members.

**Props:**
- `role`: string - Person's role
- `name`: string - Person's name
- `date`: string (optional) - Sign-off date/time
- `className`: string (optional) - Additional CSS classes

## Usage Example

```tsx
import SafetyPlanDetail from '@/components/SafetyPlanDetail';
import { Shield, AlertTriangle, HardHat } from 'lucide-react';

const safetyPlanData = {
  title: "Daily Safety Plan - Production Line A",
  status: "Active",
  date: "2024-01-15",
  shift: "Morning Shift",
  location: "Production Floor A",
  machine: "Assembly Line 1",
  group: "Team Alpha",
  safetyConcerns: [
    {
      id: "1",
      title: "Specialized Training",
      icon: <Shield className="w-4 h-4" />,
      color: "teal"
    }
  ],
  hazards: [
    {
      id: "1",
      title: "+35lb Manual Lifts",
      riskLevel: "HIGH RISK",
      description: "Manual lifting of heavy components...",
      mitigationPlan: "Use mechanical lifting equipment..."
    }
  ],
  signOffs: [
    {
      id: "1",
      role: "Safety Officer",
      name: "John Smith",
      date: "2024-01-15 08:00"
    }
  ]
};

function SafetyPlanPage() {
  return <SafetyPlanDetail {...safetyPlanData} />;
}
```

## Design System Integration

These components integrate with the existing design system:

- **Colors**: Uses Tailwind CSS classes with custom brand colors
- **Typography**: Consistent with the project's font hierarchy
- **Spacing**: Follows the established spacing scale
- **Icons**: Uses Lucide React icons
- **UI Components**: Leverages existing shadcn/ui components (Badge, Card, etc.)

## Responsive Design

All components are fully responsive:
- **Mobile**: Single column layouts
- **Tablet**: 2-column grids where appropriate
- **Desktop**: Full multi-column layouts

## Accessibility

Components include proper:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility

## File Structure

```
client/src/components/
├── SafetyPlanDetail.tsx      # Main component
├── InfoGrid.tsx             # Information grid
├── SafetyConcernBadge.tsx   # Concern badges
├── HazardCard.tsx          # Hazard display
├── SignOffCard.tsx         # Sign-off display
└── ui/                     # Existing UI components

client/src/pages/
└── SafetyPlanDetailExample.tsx  # Usage example
```

## Based on HTML Template Analysis

These components were created by analyzing the provided HTML template and extracting:

1. **Layout Structure**: Header, info grid, concerns, hazards, sign-offs
2. **Styling Patterns**: Color schemes, spacing, typography
3. **Data Models**: Interfaces for safety concerns, hazards, sign-offs
4. **Interactive Elements**: Status badges, risk level indicators
5. **Responsive Behavior**: Grid layouts that adapt to screen size

The components maintain the visual design and functionality of the original HTML while providing the reusability and maintainability of React components.