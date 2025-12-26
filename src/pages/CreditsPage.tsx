import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Github, Code, Heart, Sparkles, Database, Palette, Zap, Mail, Phone, Linkedin, Instagram, ExternalLink } from 'lucide-react';

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
            a seamless audio experience. Built with modern web technologies, it demonstrates 
            real-world backend development, REST APIs, authentication, media handling, and 
            frontend integration.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The platform allows users to stream audio content, manage playlists, discover new 
            music and podcasts, and enjoy an immersive listening experience with animated audio 
            wave visualizations.
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
          <CardDescription>
            Designed and developed by Aryan
          </CardDescription>
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
                and beautiful design. Specialized in React, TypeScript, and full-stack development.
              </p>

              {/* Contact Information */}
              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h4>
                
                <div className="grid gap-3">
                  {/* Email */}
                  <a 
                    href="mailto:aryanaditya8439@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
                  >
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        aryanaditya8439@gmail.com
                      </p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* Phone */}
                  <a 
                    href="tel:+918439396682"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
                  >
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        +91 8439396682
                      </p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                {/* GitHub */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  asChild
                >
                  <a href="https://github.com/arxncodes" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 text-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">GitHub</p>
                      <p className="text-sm font-medium">@arxncodes</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </Button>

                {/* LinkedIn */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/aryan-aditya" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5 text-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <p className="text-sm font-medium">Aryan Aditya</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </Button>

                {/* Instagram */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  asChild
                >
                  <a href="https://instagram.com/ig_.kratos" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-primary" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <p className="text-sm font-medium">@ig_.kratos</p>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </Button>
              </div>

              {/* Badge */}
              <div className="pt-4">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Available for Projects
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Project Information
          </CardTitle>
          <CardDescription>
            Technical details and architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Project Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Project Name:</strong> Dhun (Melody Stream)</li>
                <li><strong>Type:</strong> Full-Stack Web Application</li>
                <li><strong>Purpose:</strong> Music & Podcast Streaming Platform</li>
                <li><strong>Architecture:</strong> React + Supabase</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Development</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><strong>Frontend:</strong> React 18 with TypeScript</li>
                <li><strong>Backend:</strong> Supabase (PostgreSQL)</li>
                <li><strong>Styling:</strong> Tailwind CSS + shadcn/ui</li>
                <li><strong>Build Tool:</strong> Vite</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 xl:grid-cols-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Built with modern, industry-standard technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-4 sm:grid-cols-2">
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Credits & Acknowledgments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            Credits & Acknowledgments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">UI Components</h3>
              <p className="text-sm text-muted-foreground">
                Built with <strong>shadcn/ui</strong> - A collection of beautifully designed, 
                accessible, and customizable React components.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Icons</h3>
              <p className="text-sm text-muted-foreground">
                Icons provided by <strong>Lucide Icons</strong> - Beautiful & consistent icon toolkit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Backend Services</h3>
              <p className="text-sm text-muted-foreground">
                Powered by <strong>Supabase</strong> - Open source Firebase alternative with 
                PostgreSQL database, authentication, and storage.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Design Inspiration</h3>
              <p className="text-sm text-muted-foreground">
                Inspired by modern music streaming platforms like Spotify and Apple Music.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center space-y-2 py-8">
        <p className="text-sm text-muted-foreground">
          Made with <Heart className="inline h-4 w-4 text-primary fill-primary" /> by Aryan for music lovers
        </p>
        <p className="text-xs text-muted-foreground">
          © 2025 Dhun. All rights reserved.
        </p>
      </div>
    </div>
  );
}
