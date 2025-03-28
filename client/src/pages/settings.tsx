import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import { Sun, Moon, User, BellDot, Shield, CreditCard, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [accountActivity, setAccountActivity] = useState(true);

  return (
    <>
      <div className="px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your account preferences</p>
          </div>
            
          <button 
            onClick={toggleTheme}
            className="mt-4 md:mt-0 theme-toggle p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 self-start"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        
        <Card>
          <CardHeader className="px-6">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <BellDot className="h-4 w-4" />
                    <span className="hidden md:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden md:inline">Billing</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden md:inline">Data</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name" 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Your email" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-medium mb-4 self-start md:self-center">Profile Picture</h3>
                        <div className="flex flex-col items-center space-y-4">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={user?.profilePic} />
                            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline">Change Avatar</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Connected Accounts</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5C13.6168 5 15.1013 5.55353 16.2863 6.47406L19.9235 3.00409C17.8992 1.13855 15.0589 0 12 0C7.3873 0 3.38136 2.59139 1.38469 6.40602L5.43724 9.60473C6.40869 6.91814 8.97507 5 12 5Z" fill="#EA4335"/>
                                <path d="M23.8961 13.5018C23.9586 13.0102 24 12.5087 24 12C24 11.1422 23.9063 10.3068 23.7352 9.5H12V14.5H18.6036C18.1001 16.0488 17.0241 17.3836 15.6036 18.2522L19.7542 21.5431C21.8731 19.5367 23.317 16.7205 23.8961 13.5018Z" fill="#4285F4"/>
                                <path d="M5 12C5 11.1566 5.15686 10.3516 5.43724 9.60473L1.38469 6.40602C0.504333 8.08323 0 9.98755 0 12C0 13.9929 0.495056 15.8807 1.36131 17.5482L5.41193 14.3364C5.14702 13.6044 5 12.8204 5 12Z" fill="#FBBC05"/>
                                <path d="M12 19C8.95858 19 6.37818 17.0511 5.41193 14.3364L1.36131 17.5482C3.35967 21.3843 7.36973 24 12 24C15.0278 24 17.844 22.8851 19.7542 21.5431L15.6036 18.2522C14.4562 18.7852 13.1892 19 12 19Z" fill="#34A853"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Google</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Disconnect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2772 21.0498 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">GitHub</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account activity</p>
                        </div>
                        <Switch 
                          checked={emailNotifications} 
                          onCheckedChange={setEmailNotifications} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Emails</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about new features and promotions</p>
                        </div>
                        <Switch 
                          checked={marketingEmails} 
                          onCheckedChange={setMarketingEmails} 
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Account Activity</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about activity on your connected platforms</p>
                        </div>
                        <Switch 
                          checked={accountActivity} 
                          onCheckedChange={setAccountActivity} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Security Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="billing" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Billing Information</h3>
                    
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-medium mb-2">Current Plan</h4>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-md mb-1">Free Plan</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Basic analytics for up to 3 social accounts</p>
                        </div>
                        <Button>Upgrade</Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Monthly usage</span>
                          <span className="text-sm font-medium">42% of 100%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Available Plans</h4>
                      
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Free</h5>
                          <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                          <ul className="space-y-2 mb-6 text-sm">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Up to 3 social accounts
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Basic analytics
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              7-day data history
                            </li>
                          </ul>
                          <Button variant="outline" className="w-full">Current Plan</Button>
                        </div>
                        
                        <div className="border-2 border-primary rounded-lg p-4 relative">
                          <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                          <h5 className="font-medium mb-2">Pro</h5>
                          <p className="text-2xl font-bold mb-4">$29<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                          <ul className="space-y-2 mb-6 text-sm">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Up to 10 social accounts
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Advanced analytics
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              30-day data history
                            </li>
                          </ul>
                          <Button className="w-full">Upgrade</Button>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Business</h5>
                          <p className="text-2xl font-bold mb-4">$99<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                          <ul className="space-y-2 mb-6 text-sm">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Unlimited social accounts
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Premium analytics & reports
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              1-year data history
                            </li>
                          </ul>
                          <Button variant="outline" className="w-full">Contact Sales</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="mt-0">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    
                    <div className="space-y-4">
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-medium mb-3">Data Export</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Download all your analytics data and platform metrics</p>
                        <div className="flex space-x-2">
                          <Button variant="outline">JSON Format</Button>
                          <Button variant="outline">CSV Format</Button>
                          <Button variant="outline">PDF Report</Button>
                        </div>
                      </div>
                      
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h4 className="font-medium mb-3">Data Retention</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Control how long your data is stored</p>
                        <div className="flex items-center space-x-4">
                          <select className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm">
                            <option>30 days</option>
                            <option>3 months</option>
                            <option>6 months</option>
                            <option>1 year</option>
                            <option>Forever</option>
                          </select>
                          <Button variant="outline">Apply</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2 text-red-500 dark:text-red-400">Danger Zone</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanent account actions</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950">Delete All Data</Button>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
    </>
  );
}