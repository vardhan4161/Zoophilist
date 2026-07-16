import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <Card className="bg-card border-white/5">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your contact details and business hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input defaultValue="+91 9515247704" className="bg-background/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue="zoophilistpetservice@gmail.com" className="bg-background/50 border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input defaultValue="Premium localities across major cities" className="bg-background/50 border-white/10" />
          </div>
          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-white/5">
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
          <CardDescription>Change your admin credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" className="bg-background/50 border-white/10" />
          </div>
          <Button variant="secondary" className="mt-4">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}