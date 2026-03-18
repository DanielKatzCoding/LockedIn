declare module '@dnd-kit/core' {
  export type UniqueIdentifier = string | number;

  export type DragStartEvent = any;
  export type DragEndEvent = any;
  export type Announcements = any;
  export type ScreenReaderInstructions = any;
  export type DndContextProps = any;
  export const DndContext: any;
  export const DragOverlay: any;
  export const defaultDropAnimationSideEffects: any;
  export const useSensor: any;
  export const useSensors: any;
  export const KeyboardSensor: any;
  export const MouseSensor: any;
  export const TouchSensor: any;
  export const closestCenter: any;
  export type DraggableAttributes = any;
  export type DraggableSyntheticListeners = any;
  export type DropAnimation = any;
}

declare module '@dnd-kit/modifiers' {
  export const restrictToVerticalAxis: any;
  export const restrictToHorizontalAxis: any;
  export const restrictToParentElement: any;
}

declare module '@dnd-kit/sortable' {
  export type UniqueIdentifier = string | number;
  export const arrayMove: any;
  export const horizontalListSortingStrategy: any;
  export const verticalListSortingStrategy: any;
  export const SortableContext: any;
  export const useSortable: any;
  export const sortableKeyboardCoordinates: any;
  export type SortableContextProps = any;
}

declare module '@dnd-kit/utilities' {
  export const CSS: any;
}

declare module '@radix-ui/react-slot' {
  export const Slot: any;
}

declare module "radix-ui" {
  export const Slot: any;
  export const Checkbox: any;
  export const Dialog: any;
  export const DropdownMenu: any;
  export const Popover: any;
  export const Select: any;
  export const Separator: any;
  export const Tooltip: any;
}
