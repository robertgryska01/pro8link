// File: src/components/more/account-screen.tsx
'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Power, User, Shield, Bell } from 'lucide-react';

export function AccountScreen() {
  // Mock user data
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    initials: 'JD',
  };

  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* User Profile Section */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="woman smiling" />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl text-white/90">{user.name}</CardTitle>
              <CardDescription className="text-white/60">{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-card/50 border-white/10">
            <CardHeader>
                <CardTitle className="text-lg text-white/80">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="text-white/80">Personal Information</span>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                </div>
                 <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <span className="text-white/80">Security</span>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                </div>
                 <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="text-white/80">Notifications</span>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                </div>
            </CardContent>
        </Card>
        
        {/* Subscription Section */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Subscription</CardTitle>
            <CardDescription className="text-white/60">
              You are on the Pro Plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Subscription</Button>
          </CardContent>
        </Card>

        {/* Log Out */}
        <Button variant="destructive" className="w-full bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:text-red-300">
            <Power className="mr-2 h-4 w-4" /> Log Out
        </Button>
      </div>
    </main>
  );
}
