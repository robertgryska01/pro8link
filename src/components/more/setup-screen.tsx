// File: src/components/more/setup-screen.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export function SetupScreen() {
  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Integrations */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Integrations</CardTitle>
            <CardDescription className="text-white/60">
              Connect your selling platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Image src="https://picsum.photos/seed/ebay/40/40" alt="eBay Logo" width={32} height={32} className="rounded-md" data-ai-hint="company logo"/>
                <span className="font-medium text-white/90">eBay</span>
              </div>
              <Button variant="outline" size="sm" className="bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30">Connected</Button>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <Image src="https://picsum.photos/seed/amazon/40/40" alt="Amazon Logo" width={32} height={32} className="rounded-md" data-ai-hint="company logo"/>
                <span className="font-medium text-white/90">Amazon</span>
              </div>
              <Button size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Notification Settings</CardTitle>
            <CardDescription className="text-white/60">
              Choose what you want to be notified about.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-order-notif" className="text-white/80">New Orders</Label>
              <Switch id="new-order-notif" className="data-[state=unchecked]:bg-white/20" defaultChecked />
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <Label htmlFor="low-stock-notif" className="text-white/80">Low Stock Alerts</Label>
              <Switch id="low-stock-notif" className="data-[state=unchecked]:bg-white/20" defaultChecked />
            </div>
             <Separator className="bg-white/10" />
            <div className="flex items-center justify-between">
              <Label htmlFor="shipping-update-notif" className="text-white/80">Shipping Updates</Label>
              <Switch id="shipping-update-notif" className="data-[state=unchecked]:bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Setup */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Shipping Setup</CardTitle>
            <CardDescription className="text-white/60">
              Configure your default shipping preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="default-carrier" className="text-white/80 mb-2 block">Default Carrier</Label>
              <Select defaultValue="royal-mail">
                <SelectTrigger id="default-carrier" className="focus-glow w-full bg-[#1e2d50] border-none text-white rounded-lg">
                  <SelectValue placeholder="Select a carrier" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2d50] text-white border-white/10">
                  <SelectItem value="royal-mail">Royal Mail</SelectItem>
                  <SelectItem value="evri">Evri</SelectItem>
                  <SelectItem value="dpd">DPD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" variant="outline">Manage Shipping Presets</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
