
import { useState } from 'react';
import ProfileCard from './ProfileCard';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import DataManagementCard from './DataManagementCard';

const ProfileSettings = () => {
  const [fullName, setFullName] = useState('Andrew Neilson');
  const [email, setEmail] = useState('andrew@example.com');
  
  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <ProfileCard 
        fullName={fullName}
        email={email}
        joinDate="Jan 2024"
        isVerified={true}
      />
      
      {/* Profile Form */}
      <ProfileForm 
        fullName={fullName}
        email={email}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
      />

      {/* Password Form */}
      <PasswordForm />

      {/* Data Management */}
      <DataManagementCard />
    </div>
  );
};

export default ProfileSettings;
