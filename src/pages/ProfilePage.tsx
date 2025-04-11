
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchWatchlist, updateUserProfile } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import AnimeGrid from '@/components/AnimeGrid';
import { Badge } from '@/components/ui/badge';

const ProfilePage = () => {
  const { user, isAuthenticated, loading, updateUserData, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  // Fetch user's watchlist
  const { data: watchlist = [], isLoading: loadingWatchlist } = useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    enabled: isAuthenticated
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await updateUserProfile({
        ...user,
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio,
        avatar: profileData.avatar,
      });
      
      updateUserData(updatedUser);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow px-6 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Profile sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatar || ''} alt={user.username} />
                  <AvatarFallback className="text-4xl bg-anime-purple text-white">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{user.username}</h2>
                <p className="text-muted-foreground text-sm mb-4">Joined: {new Date(user.joined_date).toLocaleDateString()}</p>
                
                <div className="w-full">
                  {user.favorite_genres && user.favorite_genres.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Favorite Genres</p>
                      <div className="flex flex-wrap gap-1">
                        {user.favorite_genres.map((genre, index) => (
                          <Badge key={index} className="bg-muted text-muted-foreground">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col w-full gap-2">
                    <Button 
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline" 
                      className="w-full"
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      onClick={logout}
                      variant="ghost" 
                      className="w-full text-muted-foreground"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="space-y-8">
            <Tabs defaultValue="watchlist">
              <TabsList className="mb-6">
                <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="watchlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingWatchlist ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
                      </div>
                    ) : (
                      <AnimeGrid 
                        animeList={watchlist} 
                        emptyMessage="Your watchlist is empty. Start adding anime to watch later!" 
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input 
                          id="avatar"
                          name="avatar"
                          placeholder="https://example.com/avatar.jpg"
                          value={profileData.avatar}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself..."
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-anime-purple hover:bg-anime-purple/90"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
