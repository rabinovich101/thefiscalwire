import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
}

interface UserState {
  // Bookmarked articles
  bookmarkedArticles: string[]
  addBookmark: (articleId: string) => void
  removeBookmark: (articleId: string) => void
  isBookmarked: (articleId: string) => boolean

  // Reading history
  readArticles: string[]
  markAsRead: (articleId: string) => void

  // User preferences
  preferences: UserPreferences
  setTheme: (theme: UserPreferences['theme']) => void
  setFontSize: (size: UserPreferences['fontSize']) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Bookmarks
      bookmarkedArticles: [],
      addBookmark: (articleId) =>
        set((state) => ({
          bookmarkedArticles: [...state.bookmarkedArticles, articleId],
        })),
      removeBookmark: (articleId) =>
        set((state) => ({
          bookmarkedArticles: state.bookmarkedArticles.filter((id) => id !== articleId),
        })),
      isBookmarked: (articleId) => get().bookmarkedArticles.includes(articleId),

      // Reading history
      readArticles: [],
      markAsRead: (articleId) =>
        set((state) => ({
          readArticles: state.readArticles.includes(articleId)
            ? state.readArticles
            : [...state.readArticles, articleId],
        })),

      // Preferences
      preferences: {
        theme: 'system',
        fontSize: 'medium',
      },
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),
      setFontSize: (size) =>
        set((state) => ({
          preferences: { ...state.preferences, fontSize: size },
        })),
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        bookmarkedArticles: state.bookmarkedArticles,
        readArticles: state.readArticles,
        preferences: state.preferences,
      }),
    }
  )
)
