# Ekstraklasa Match Schedule Navigation and Filtering

## 1. Match Schedule Navigation System

### 1.1 Pagination Architecture

The match schedule implements a dual-layer pagination system:
- **Primary Navigation**: Sticky matchday selector at the top
- **Secondary Navigation**: Compact pagination controls at the bottom
- **Keyboard Navigation**: Left/right arrow keys for matchday switching

### 1.2 Navigation Elements

- **Matchday Selector**: Horizontally scrollable buttons for direct matchday access
- **Previous/Next Controls**: Navigation arrows at both ends of matchday selector
- **Animated Transitions**: Smooth slide animations between matchdays
- **Persistence**: Current matchday saved in localStorage for session continuity

## 2. Filtering System

### 2.1 Filter Interface Layout

The filter interface uses a two-tier organization:
- **Primary Filters Row**: Team, round, matchday, stadium, and status filters
- **Secondary Filters Row**: Date range filters (start/end date)
- **Active Filters**: Displayed as removable chips below filter controls
- **Responsive Design**: Collapsible on mobile devices with toggle button

### 2.2 Available Filters

- **Team Filter**: Matches involving selected team (home or away)
- **Round Filter**: Matches from specific tournament round
- **Matchday Filter**: Matches from specific matchday
- **Stadium Filter**: Matches at specific venue
- **Status Filter**: Match status (played, scheduled, canceled)
- **Date Range**: Matches within selected date range

### 2.3 Special Features

- **Favorite Team**: Star/unstar teams for quick filtering
- **Filter Chips**: Visual display of active filters with one-click removal
- **Keyboard Shortcuts**: F key toggles favorite team filter
- **Filter Summary**: Count of filtered matches displayed

## 3. Integration of Navigation and Filtering

### 3.1 Interaction Patterns

- **Filter → Navigate**: Applying filters may change visible matchdays
- **Navigate → Filter State**: Navigation between matchdays preserves active filters
- **Filtered View**: Filtering by criteria other than matchday shows all matching matches
- **Reset Flow**: Clearing filters restores pagination by matchday

### 3.2 State Management

- **Centralized State**: Single source of truth for filter criteria and current matchday
- **Filter Persistence**: Active filters maintained during navigation
- **View Transitions**: Animated transitions between filtered and paginated views

## 4. Data Flow Architecture

### 4.1 Frontend Components

- **EnhancedFilterBar**: Manages filter UI and user interaction
- **EnhancedMatchList**: Handles match display with pagination
- **EnhancedMatchesPage**: Coordinates filtering and navigation

### 4.2 Data Processing Flow

1. **Initial Load**:
   - Fetch all matches, teams, and stadiums data
   - Calculate available filter options
   - Determine default matchday view

2. **Filter Application**:
   - User selects filter criteria
   - Filter state updates trigger API queries
   - Results update with skeleton loading during transitions

3. **Navigation Flow**:
   - User selects matchday via selector or arrows
   - Animated transition occurs between matchdays
   - Current view updates while preserving filter state

## 5. API Integration

### 5.1 Frontend API Services

- **Match Fetching**:
  - `/matches`: All matches
  - `/matches/team/:teamId`: Team-specific matches
  - `/matches/round/:round`: Round-specific matches
  - `/matches/matchday/:matchday`: Matchday-specific matches
  - `/matches/stadium/:stadiumId`: Stadium-specific matches
  - `/matches/status/:status`: Status-specific matches
  - `/matches/date-range`: Date range filtering
  - `/matches/filters`: Combined filtering with multiple criteria

### 5.2 Optimization Techniques

- **Conditional Queries**: Only executed when filters are active
- **Caching**: React Query caching for repeat queries
- **Skeleton Loading**: Visual feedback during data fetching
- **Memoization**: Computed values cached for performance

## 6. Responsive Behavior

### 6.1 Desktop View

- Expanded filter panel with all filters visible
- Multi-column filter layout
- Horizontal matchday selector with visible pagination
- Full match information display

### 6.2 Mobile View

- Collapsible filter panel accessed via toggle button
- Single-column filter layout
- Condensed matchday selector optimized for touch
- Simplified match display with prioritized information
- Quick favorite team access for efficient filtering

## 7. User Experience Features

### 7.1 Visual Feedback

- **Active State Indicators**: Visual cues for current matchday and filters
- **Micro-interactions**: Hover effects, scale animations, transitions
- **Loading States**: Skeleton loading during data fetching
- **Empty States**: Clear messaging when no matches match criteria

### 7.2 Accessibility Features

- **Keyboard Navigation**: Full keyboard control for navigation
- **ARIA Attributes**: Proper labeling for screen readers
- **Focus Management**: High-contrast focus indicators
- **Touch Targets**: Appropriately sized for mobile interaction