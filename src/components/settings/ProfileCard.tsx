
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar } from 'lucide-react';

interface ProfileCardProps {
  fullName: string;
  email: string;
  joinDate?: string;
  isVerified?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ fullName, email, joinDate = "Jan 2024", isVerified = true }) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20 border-4 border-primary/20">
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{fullName}</CardTitle>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              {isVerified && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                  Verified
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard;
