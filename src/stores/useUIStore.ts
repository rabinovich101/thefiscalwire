import { create } from 'zustand'

interface UIState {
  // Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Mobile menu
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void

  // Modal
  activeModal: string | null
  openModal: (modalId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  // Modal
  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}))
