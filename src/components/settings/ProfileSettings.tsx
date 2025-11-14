import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Mail, Lock, Phone, Building2 } from 'lucide-react';

const ProfileSettings = () => {
  const [email, setEmail] = useState('vamsiquadrant@gmail.com');
  const [orgName, setOrgName] = useState('Acme Corp');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [password, setPassword] = useState('');
  const [ssoOption, setSsoOption] = useState('none');

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Admin Account Badge */}
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Admin Account</span>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground">Account Information</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account details and credentials.
          </p>
        </div>
        
        <div className="space-y-6">
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
            <Label htmlFor="orgName" className="text-sm text-foreground">Organization Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">Update Password</Label>
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

      {/* Single sign-on (SSO) */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-foreground">Single sign-on (SSO)</h3>
            <Badge variant="secondary" className="text-xs">Business</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Require Workspace members to log in to ClickUp using their credentials from your SSO identity provider (IDP). Click on your vendor or use SAML to connect with other providers to start the setup process.
          </p>
          <a href="#" className="text-sm text-primary underline underline-offset-4 hover:text-primary/80">
            Learn more
          </a>
          <span className="text-sm text-muted-foreground"> about SSO.</span>
        </div>
        
        <div className="space-y-4">
          <RadioGroup value={ssoOption} onValueChange={setSsoOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="sso-none" />
              <Label htmlFor="sso-none" className="text-sm font-normal cursor-pointer">
                Don't require SSO
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="sso-google" />
              <Label htmlFor="sso-google" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                Google
                <Badge variant="secondary" className="text-xs">Business</Badge>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="microsoft" id="sso-microsoft" />
              <Label htmlFor="sso-microsoft" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                Microsoft
                <Badge variant="secondary" className="text-xs">Enterprise</Badge>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="okta" id="sso-okta" />
              <Label htmlFor="sso-okta" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                Okta
                <Badge variant="secondary" className="text-xs">Enterprise</Badge>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="saml" id="sso-saml" />
              <Label htmlFor="sso-saml" className="text-sm font-normal cursor-pointer flex items-center gap-2">
                SAML
                <Badge variant="secondary" className="text-xs">Enterprise</Badge>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
