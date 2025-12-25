import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MusicPage from './pages/MusicPage';
import PodcastsPage from './pages/PodcastsPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import PlaylistsPage from './pages/PlaylistsPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreditsPage from './pages/CreditsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />
  },
  {
    name: 'Register',
    path: '/register',
    element: <RegisterPage />
  },
  {
    name: 'Music',
    path: '/music',
    element: <MusicPage />
  },
  {
    name: 'Podcasts',
    path: '/podcasts',
    element: <PodcastsPage />
  },
  {
    name: 'Search',
    path: '/search',
    element: <SearchPage />
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <FavoritesPage />
  },
  {
    name: 'Recently Played',
    path: '/recent',
    element: <RecentlyPlayedPage />
  },
  {
    name: 'Playlists',
    path: '/playlists',
    element: <PlaylistsPage />
  },
  {
    name: 'Playlist Detail',
    path: '/playlists/:id',
    element: <PlaylistDetailPage />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboardPage />
  },
  {
    name: 'Credits',
    path: '/credits',
    element: <CreditsPage />
  }
];

export default routes;
