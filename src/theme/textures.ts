export const textures = {
  // Card styling that mimics worn paper edges
  card: {
    borderRadius: 8,
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  // Slightly raised card for emphasis
  cardElevated: {
    borderRadius: 8,
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },

  // Subtle inner shadow for input fields
  input: {
    borderRadius: 6,
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },

  // Divider line styling
  divider: {
    height: 1,
    backgroundColor: '#E8DFD0',
  },

  // Bookmark tab styling for navigation
  bookmarkTab: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
