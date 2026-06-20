import {
  Leaf,
  Gem,
  Bug,
  Flower2,
  Feather,
  Mountain,
  TreePine,
  Fish,
  Bird,
  Star,
  Heart,
  Crown,
  Key,
  Compass,
  Map,
  Camera,
  BookOpen,
  Palette,
  Scissors,
  Pen,
  Bookmark,
  Archive,
  Box,
  Layers,
  Aperture,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Droplet,
  Flame,
  Wind,
  Music,
  Clock,
  Watch,
  Anchor,
  Bell,
  Award,
  Gift,
  Home,
  Umbrella,
  Tent,
  Flashlight,
  Microscope,
  Search,
  type LucideIcon,
} from 'lucide-react-native';

// Map of icon names to lucide components
const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Gem,
  Bug,
  Flower2,
  Feather,
  Mountain,
  TreePine,
  Fish,
  Bird,
  Star,
  Heart,
  Crown,
  Key,
  Compass,
  Map,
  Camera,
  BookOpen,
  Palette,
  Scissors,
  Pen,
  Bookmark,
  Archive,
  Box,
  Layers,
  Aperture,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Droplet,
  Flame,
  Wind,
  Music,
  Clock,
  Watch,
  Anchor,
  Bell,
  Award,
  Gift,
  Home,
  Umbrella,
  Tent,
  Flashlight,
  Microscope,
  Search,
};

// List of available icons for the picker
export const AVAILABLE_ICONS = Object.keys(iconMap);

interface CollectionIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const CollectionIcon = ({ name, size = 24, color = '#000' }: CollectionIconProps) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Fallback to a default icon
    return <Box size={size} color={color} />;
  }

  return <IconComponent size={size} color={color} />;
};
