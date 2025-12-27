import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Music,
  Github,
  Code,
  Heart,
  Sparkles,
  Database,
  Palette,
  Zap,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
} from 'lucide-react';

export default function CreditsPage() {
  const technologies = [
    { name: 'React', category: 'Frontend', icon: Code },
    { name: 'TypeScript', category: 'Language', icon: Code },
    { name: 'Vite', category: 'Build Tool', icon: Zap },
    { name: 'Tailwind CSS', category: 'Styling', icon: Palette },
    { name: 'shadcn/ui', category: 'UI Components', icon: Sparkles },
    { name: 'Supabase', category: 'Backend', icon: Database },
    { name: 'PostgreSQL', category: 'Database', icon: Database },
    { name: 'Lucide Icons', category: 'Icons', icon: Sparkles },
  ];

  const features = [
    'Music & Podcast Streaming',
    'Custom Playlists Management',
    'Favorites & Recently Played',
    'Advanced Search Functionality',
    'Audio Wave Visualization',
    'Shuffle & Repeat Modes',
    'Queue Management',
    'Dark/Light Theme Support',
    'Responsive Design',
    'Admin Dashboard',
    'Cover Image Upload',
    'Music Categories (31 types)',
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Music className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold gradient-text">Dhun</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          A Modern Music & Podcast Streaming Platform
        </p>
        <p className="text-sm text-muted-foreground">
          Version 2.1.0 • Released December 2025
        </p>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            About Dhun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Dhun is a full-stack music and podcast streaming web application designed to provide
            a seamless audio experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The platform allows users to stream audio content, manage playlists, and enjoy
            animated audio wave visualizations.
          </p>
        </CardContent>
      </Card>

      {/* Developer Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Developer
          </CardTitle>
          <CardDescription>Designed and developed by Aryan</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Developer Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">Aryan</h3>
                <p className="text-sm text-muted-foreground">Full-Stack Developer</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Passionate about creating modern, user-friendly web applications with clean code
                and beautiful design.
              </p>

              {/* Contact */}
              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h4>

                <div className="grid gap-3">
                  <a
                    href="mailto:aryanaditya8439@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      aryanaditya8439@gmail.com
                    </span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>

                  <a
                    href="tel:+918439396682"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">+91 8439396682</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="xl:w-64 space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Connect
              </h4>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <a href="https://github.com/arxncodes" target="_blank">
                    <Github className="h-5 w-5 text-primary" />
                    GitHub
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <a href="https://www.linkedin.com/in/arxncodes" target="_blank">
                    <Linkedin className="h-5 w-5 text-primary" />
                    LinkedIn
                  </a>
                </Button>
              </div>

              <Badge variant="secondary" className="w-full justify-center py-2 mt-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Available for Projects
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 bg-secondary/50 p-2 rounded">
                <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-muted-foreground">
        Made with <Heart className="inline h-4 w-4 fill-primary text-primary" /> by Aryan
      </div>
    </div>
  );
}
