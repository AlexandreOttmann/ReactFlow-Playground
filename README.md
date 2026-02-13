# ReactFlow Playground - Interview Prep Guide

A comprehensive ReactFlow application demonstrating best practices in React, TypeScript, state management, testing, and performance optimization.

## 🚀 Features

### Core Functionality
- **Interactive Flow Editor**: Drag, drop, and connect nodes visually
- **Node Editing**: Click any node to open a drawer with detailed editing options
- **Custom Nodes**: Beautiful, interactive node components with hover effects

### State Management (Zustand)
- Centralized state management with Zustand
- Efficient updates with minimal re-renders
- Automatic persistence to localStorage
- Clean separation of concerns

### Persistence & Export
- **Auto-save**: Automatically saves workflow to localStorage
- **Manual Save/Load**: Explicit save and load controls
- **JSON Export**: Export entire workflow as JSON file
- **JSON Import**: Import workflows from JSON files
- **Version Control**: Exported files include version and timestamp

### Performance Optimizations
- **React.memo**: Optimized node components prevent unnecessary re-renders
- **Bulk Node Generation**: Test with thousands of nodes (1-10,000)
- **Efficient State Updates**: Zustand ensures minimal re-renders
- **Grid Layout**: Smart positioning for bulk-generated nodes

### Testing (Vitest)
- Comprehensive unit tests for store logic
- Component testing with React Testing Library
- Coverage for all major features
- Mock localStorage for reliable testing

### UI/UX (Tailwind + shadcn/ui)
- Modern, responsive design
- Drawer component for node editing
- Intuitive toolbar with icon buttons
- Dark mode ready
- MiniMap and controls for navigation

## 📦 Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type safety
- **ReactFlow** - Flow/diagram library
- **Zustand** - Lightweight state management
- **Vitest** - Fast unit testing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Vite** - Fast build tool

## 🏃‍♂️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## 🎯 Key Concepts for Interview

### 1. State Management Pattern

The app uses Zustand for state management with clear separation:

```typescript
// Store structure
interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  
  // Actions
  onNodesChange: (changes) => void;
  addNode: (position) => void;
  updateNode: (id, data) => void;
  // ... more actions
}
```

**Why Zustand?**
- Simpler than Redux (no boilerplate)
- Better performance than Context API
- TypeScript-first design
- Easy to test

### 2. Performance Optimizations

**Node Memoization:**
```typescript
const CustomNode = memo(({ data, id }: NodeProps) => {
  // Component only re-renders when props change
});
```

**Efficient Selectors:**
```typescript
// Only re-render when specific state changes
const nodes = useFlowStore((state) => state.nodes);
```

**Debounced Saves:**
```typescript
// Prevent excessive localStorage writes
setTimeout(() => saveToLocalStorage(), 100);
```

### 3. Testing Strategy

**Store Tests:**
- Node CRUD operations
- Bulk operations
- Persistence
- Export/Import
- Edge cases

**Component Tests:**
- User interactions
- State updates
- Error handling

### 4. Code Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── sheet.tsx
│   │   └── ...
│   ├── NodeEditor.tsx   # Node editing drawer
│   └── Toolbar.tsx      # Main controls
├── store/
│   ├── useFlowStore.ts  # Zustand store
│   └── __tests__/       # Store tests
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx              # Main component
```

## 🎨 Features Breakdown

### Toolbar Controls

| Button | Description |
|--------|-------------|
| Add Node | Creates new node at random position |
| Generate Bulk | Creates N nodes for performance testing |
| Save | Manual save to localStorage |
| Load | Restore from localStorage |
| Export JSON | Download workflow as JSON file |
| Import JSON | Upload and restore from JSON file |
| Clear All | Remove all nodes and edges |

### Node Editor Drawer

- Opens when clicking any node
- Edit label and description in real-time
- View position and ID
- Delete node with confirmation
- Auto-saves changes

### Performance Testing

1. Click "Generate Bulk" in toolbar
2. Enter number (e.g., 100, 500, 1000)
3. Observe smooth rendering and interaction
4. Test with up to 10,000 nodes

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## 🔑 Interview Discussion Points

### Architecture Decisions

1. **Why Zustand over Redux?**
   - Less boilerplate
   - Better TypeScript support
   - Simpler API
   - Better performance for this use case

2. **Why ReactFlow?**
   - Purpose-built for node-based UIs
   - Excellent performance
   - Rich feature set
   - Good TypeScript support

3. **Component Composition**
   - Custom nodes for reusability
   - Shared UI components via shadcn
   - Clear separation of concerns

### Performance Considerations

1. **React.memo** on custom nodes
2. **Efficient selectors** in Zustand
3. **Debounced localStorage** saves
4. **Optimized ReactFlow settings**

### Testing Approach

1. **Unit tests** for business logic (store)
2. **Component tests** for user interactions
3. **Mocked dependencies** (localStorage)
4. **Edge case coverage**

### State Management Flow

```
User Action → Zustand Action → State Update → Component Re-render → Auto-save
```

## 📝 Common Interview Questions

### Q: How do you handle performance with many nodes?

**A:** Multiple strategies:
- React.memo prevents unnecessary re-renders
- Zustand's selector system ensures components only update when their data changes
- ReactFlow has built-in virtualization
- Efficient event handling with useCallback

### Q: How do you persist data?

**A:** Three methods:
1. **Auto-save**: Debounced saves to localStorage after any change
2. **Manual Save/Load**: Explicit user controls
3. **Export/Import**: JSON files for sharing/backup

### Q: How do you test stateful components?

**A:** 
- Separate business logic into Zustand store
- Test store independently with pure functions
- Use React Testing Library for components
- Mock external dependencies (localStorage)

### Q: How do you handle TypeScript with Zustand?

**A:**
```typescript
interface FlowState {
  nodes: Node<NodeData>[];
  actions: ActionsType;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  // Fully typed implementation
}));
```

## 🎓 Learning Resources

- [ReactFlow Docs](https://reactflow.dev/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Vitest Docs](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🔥 Quick Demo Script

1. **Show Basic Functionality** (1 min)
   - Add nodes
   - Connect them
   - Edit a node

2. **Demonstrate Persistence** (1 min)
   - Make changes
   - Refresh page
   - Show data persists

3. **Performance Test** (1 min)
   - Generate 500+ nodes
   - Show smooth interaction
   - Explain optimizations

4. **Testing** (1 min)
   - Run test suite
   - Show coverage
   - Explain test strategy

5. **Export/Import** (30 sec)
   - Export workflow
   - Show JSON structure
   - Import it back

Good luck with your interview! 🚀
