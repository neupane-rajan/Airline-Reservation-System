import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageTemplate from '../components/layout/PageTemplate';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileService.getUserProfile();
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile(profile);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <PageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-blue"></div>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate title="User Profile">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              disabled={!editing}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
            />
            <Input
              label="First Name"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              disabled={!editing}
            />
            <Input
              label="Last Name"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              disabled={!editing}
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="mt-6 flex justify-between">
            {!editing ? (
              <Button 
                type="button"
                onClick={() => setEditing(true)}
                variant="primary"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  type="submit"
                  variant="primary"
                >
                  Save Changes
                </Button>
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}
            <Button 
              type="button"
              variant="danger"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
};

export default ProfilePage;