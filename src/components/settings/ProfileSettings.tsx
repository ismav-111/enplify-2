import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, Mail, Lock, Check } from 'lucide-react';

const ProfileSettings = () => {
  const [fullName, setFullName] = useState('vamsi');
  const [email, setEmail] = useState('vamsiquadrant@gmail.com');
  const [password, setPassword] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('zinc');
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'auto'>('auto');
  const [highContrast, setHighContrast] = useState(false);

  const themeColors = [
    { name: 'zinc', color: 'bg-zinc-600' },
    { name: 'violet', color: 'bg-violet-500' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'pink', color: 'bg-pink-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'indigo', color: 'bg-indigo-500' },
    { name: 'orange', color: 'bg-orange-600' },
    { name: 'teal', color: 'bg-teal-600' },
    { name: 'stone', color: 'bg-stone-500' },
    { name: 'emerald', color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Your personal information and account security settings.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Avatar</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-muted">
                <AvatarFallback className="text-xl font-medium bg-muted text-foreground">
                  {fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">{fullName}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter New Password"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-factor authentication */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Two-factor authentication (2FA)</h3>
          <p className="text-sm text-muted-foreground">
            Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP) from an authenticator app.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Text Message (SMS)</span>
                {smsEnabled && <Badge variant="secondary" className="text-xs">Business</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Receive a one-time passcode via SMS each time you log in.
              </p>
            </div>
            <Switch
              checked={smsEnabled}
              onCheckedChange={setSmsEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1 flex-1">
              <span className="text-sm font-medium text-foreground">Authenticator App (TOTP)</span>
              <p className="text-sm text-muted-foreground">
                Use an app to receive a temporary one-time passcode each time you log in.
              </p>
            </div>
            <Switch
              checked={totpEnabled}
              onCheckedChange={setTotpEnabled}
            />
          </div>
        </div>
      </div>

      {/* Theme color */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Theme color</h3>
          <p className="text-sm text-muted-foreground">
            Choose a preferred theme for the app.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {themeColors.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setSelectedTheme(theme.name)}
              className={`relative h-10 w-10 rounded-md ${theme.color} transition-all hover:scale-110 ${
                selectedTheme === theme.name ? 'ring-2 ring-offset-2 ring-foreground' : ''
              }`}
            >
              {selectedTheme === theme.name && (
                <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Choose light or dark mode, or switch your mode automatically based on your system settings.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer p-4 transition-all hover:border-foreground ${
              appearance === 'light' ? 'border-foreground ring-2 ring-foreground' : ''
            }`}
            onClick={() => setAppearance('light')}
          >
            <div className="aspect-[4/3] rounded-md bg-gradient-to-br from-background to-muted mb-3 border flex items-center justify-center">
              <div className="space-y-2 w-3/4">
                <div className="h-2 w-full bg-foreground/20 rounded" />
                <div className="h-2 w-2/3 bg-foreground/20 rounded" />
                <div className="flex gap-1 mt-3">
                  <div className="h-6 w-6 bg-foreground/30 rounded-sm" />
                  <div className="h-6 w-6 bg-foreground/30 rounded-sm" />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-center text-foreground">Light</p>
          </Card>

          <Card
            className={`cursor-pointer p-4 transition-all hover:border-foreground ${
              appearance === 'dark' ? 'border-foreground ring-2 ring-foreground' : ''
            }`}
            onClick={() => setAppearance('dark')}
          >
            <div className="aspect-[4/3] rounded-md bg-gradient-to-br from-zinc-900 to-zinc-800 mb-3 border flex items-center justify-center">
              <div className="space-y-2 w-3/4">
                <div className="h-2 w-full bg-white/20 rounded" />
                <div className="h-2 w-2/3 bg-white/20 rounded" />
                <div className="flex gap-1 mt-3">
                  <div className="h-6 w-6 bg-white/30 rounded-sm" />
                  <div className="h-6 w-6 bg-white/30 rounded-sm" />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-center text-foreground">Dark</p>
          </Card>

          <Card
            className={`cursor-pointer p-4 transition-all hover:border-foreground ${
              appearance === 'auto' ? 'border-foreground ring-2 ring-foreground' : ''
            }`}
            onClick={() => setAppearance('auto')}
          >
            <div className="aspect-[4/3] rounded-md mb-3 border overflow-hidden flex">
              <div className="w-1/2 bg-gradient-to-br from-background to-muted flex items-center justify-center">
                <div className="space-y-1 w-3/4">
                  <div className="h-1.5 w-full bg-foreground/20 rounded" />
                  <div className="h-1.5 w-2/3 bg-foreground/20 rounded" />
                  <div className="flex gap-0.5 mt-2">
                    <div className="h-4 w-4 bg-foreground/30 rounded-sm" />
                  </div>
                </div>
              </div>
              <div className="w-1/2 bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center">
                <div className="space-y-1 w-3/4">
                  <div className="h-1.5 w-full bg-white/20 rounded" />
                  <div className="h-1.5 w-2/3 bg-white/20 rounded" />
                  <div className="flex gap-0.5 mt-2">
                    <div className="h-4 w-4 bg-white/30 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-center text-foreground">Auto</p>
          </Card>
        </div>
      </div>

      {/* Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Contrast</h3>
          <p className="text-sm text-muted-foreground">
            Turn on and off high contrast text and borders.
          </p>
        </div>
        
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span className="text-sm text-foreground">High Contrast for increased accessibility</span>
          <Switch
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
