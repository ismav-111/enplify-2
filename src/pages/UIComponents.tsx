import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { InfoIcon, AlertCircle, CheckCircle2, Home, Settings, Edit, Trash2, Copy } from "lucide-react";
import { Link } from "react-router-dom";

const UIComponents = () => {
  const [progress, setProgress] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-2xl font-bold">UI Component Library</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Developer Guidelines Section */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Enterprise Design System Guidelines</CardTitle>
            <CardDescription>Essential principles for building consistent, accessible interfaces</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">🎨 Always Use Semantic Color Tokens</h3>
              <p className="text-muted-foreground mb-3">
                Never use direct color values (like <code className="bg-destructive/10 text-destructive px-2 py-0.5 rounded">bg-white</code> or <code className="bg-destructive/10 text-destructive px-2 py-0.5 rounded">text-black</code>). 
                Always use semantic tokens from the design system. This ensures proper theming and consistency.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-destructive">❌</span>
                  <code className="text-sm">className="bg-white text-black border-gray-200"</code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <code className="text-sm">className="bg-background text-foreground border-border"</code>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">📦 Component Import Pattern</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <code className="text-sm">
                  import &#123; Button &#125; from "@/components/ui/button";<br />
                  import &#123; Input &#125; from "@/components/ui/input";<br />
                  import &#123; Card &#125; from "@/components/ui/card";
                </code>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">♿ Accessibility First</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Required Practices</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Include proper ARIA labels</li>
                    <li>Ensure keyboard navigation works</li>
                    <li>Maintain color contrast ratios</li>
                    <li>Use semantic HTML elements</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Design Tokens Available</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>All colors are HSL-based</li>
                    <li>Dark mode automatically supported</li>
                    <li>Consistent spacing system</li>
                    <li>Standardized border radius</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color System Reference - Moved to top for visibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Design System Color Palette</CardTitle>
            <CardDescription>Complete semantic color tokens - use these instead of direct colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-base">Primary Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-primary shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Primary</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-primary</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-primary-foreground border-2" />
                    <div>
                      <p className="text-sm font-medium">Primary Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-primary-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Secondary Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-secondary shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Secondary</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-secondary</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-secondary-foreground border-2" />
                    <div>
                      <p className="text-sm font-medium">Secondary Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-secondary-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Accent Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-accent shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Accent</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-accent</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-accent-foreground border-2" />
                    <div>
                      <p className="text-sm font-medium">Accent Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-accent-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Status Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-destructive shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Destructive</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-destructive</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-destructive-foreground border-2" />
                    <div>
                      <p className="text-sm font-medium">Destructive Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-destructive-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Neutral Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted shadow-sm border" />
                    <div>
                      <p className="text-sm font-medium">Muted</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-muted</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted-foreground shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Muted Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-muted-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Base Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-background border-2" />
                    <div>
                      <p className="text-sm font-medium">Background</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-background</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-foreground shadow-md" />
                    <div>
                      <p className="text-sm font-medium">Foreground</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">text-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">UI Element Colors</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-card border-2" />
                    <div>
                      <p className="text-sm font-medium">Card</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-card</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-popover border-2" />
                    <div>
                      <p className="text-sm font-medium">Popover</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-popover</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base">Border & Input</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg border-4 border-border" />
                    <div>
                      <p className="text-sm font-medium">Border</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">border-border</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-input border" />
                    <div>
                      <p className="text-sm font-medium">Input</p>
                      <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">bg-input</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Showcase */}
        <Tabs defaultValue="buttons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
          </TabsList>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Button Component</CardTitle>
                <CardDescription>
                  Buttons trigger actions and are available in multiple variants and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-base mb-4">Button Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                    <code className="text-sm">
                      &lt;Button variant="default"&gt;Default&lt;/Button&gt;
                    </code>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-base mb-4">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-base mb-4">Buttons with Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="secondary">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-base mb-4">Button States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button onClick={() => toast.success("Button clicked successfully!")}>
                      With Toast Action
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>Text input fields and textarea controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="input-default">Default Input</Label>
                    <Input id="input-default" placeholder="Enter text..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="input-email">Email Input</Label>
                    <Input id="input-email" type="email" placeholder="email@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="input-password">Password Input</Label>
                    <Input id="input-password" type="password" placeholder="••••••••" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="input-disabled">Disabled Input</Label>
                    <Input id="input-disabled" placeholder="Disabled" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textarea">Textarea</Label>
                    <Textarea id="textarea" placeholder="Enter longer text..." rows={4} />
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Usage Example:</p>
                  <code className="text-sm">
                    &lt;Input<br />
                    &nbsp;&nbsp;type="email"<br />
                    &nbsp;&nbsp;placeholder="email@example.com"<br />
                    /&gt;
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Form controls, selections, and interactive elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox1" />
                    <Label htmlFor="checkbox1">Accept terms and conditions</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox2" defaultChecked />
                    <Label htmlFor="checkbox2">Receive email notifications</Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch1">Enable feature</Label>
                    <Switch id="switch1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch2">Dark mode</Label>
                    <Switch id="switch2" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 max-w-md">
                  <Label>Radio Group Selection</Label>
                  <RadioGroup defaultValue="option-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-1" id="option-1" />
                      <Label htmlFor="option-1">Option 1 - Default selected</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-2" id="option-2" />
                      <Label htmlFor="option-2">Option 2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-3" id="option-3" />
                      <Label htmlFor="option-3">Option 3</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3 max-w-md">
                  <Label>Select Dropdown</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                      <SelectItem value="option4">Option 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3 max-w-md">
                  <Label>Slider (Value: {sliderValue[0]})</Label>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Components</CardTitle>
                <CardDescription>User feedback, status indicators, and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is an informational alert message that provides useful context.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      This is an error alert message indicating something went wrong.
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Progress Bar</Label>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      Decrease
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      Increase
                    </Button>
                    <Button size="sm" onClick={() => setProgress(100)}>
                      Complete
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Badge Variants</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-primary">Custom Primary</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Toast Notifications</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => toast.success("Operation completed successfully!")}>
                      Success Toast
                    </Button>
                    <Button variant="outline" onClick={() => toast.error("An error occurred!")}>
                      Error Toast
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Here's some information")}>
                      Info Toast
                    </Button>
                    <Button variant="outline" onClick={() => toast.warning("Warning: Please be careful")}>
                      Warning Toast
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout Components</CardTitle>
                <CardDescription>Structural components for organizing content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-base mb-4">Card Component</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Card</CardTitle>
                        <CardDescription>Simple card with header and content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Card content goes here with main information.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Card with Footer</CardTitle>
                        <CardDescription>Includes action buttons in footer</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">This card demonstrates the footer section.</p>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button size="sm">Confirm</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-base mb-4">Separator Component</h3>
                  <div className="space-y-4">
                    <p>Content above the separator</p>
                    <Separator />
                    <p>Content below the separator</p>
                    <div className="flex items-center gap-4">
                      <p>Vertical separator</p>
                      <Separator orientation="vertical" className="h-8" />
                      <p>Between items</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Components</CardTitle>
                <CardDescription>Components for presenting content and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-base mb-4">Avatar Component</h3>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">With Image</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar>
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">Fallback</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">XY</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">Large</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">Small</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-base mb-4">Accordion Component</h3>
                  <Accordion type="single" collapsible className="max-w-md">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern and includes proper keyboard navigation.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I customize it?</AccordionTrigger>
                      <AccordionContent>
                        You can customize the component using Tailwind CSS classes and semantic color tokens from the design system.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Can I use icons?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can add icons from lucide-react to enhance the visual hierarchy and user experience.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Components</CardTitle>
                <CardDescription>Components for user navigation and content organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-base mb-4">Tabs Component</h3>
                  <Tabs defaultValue="tab1" className="max-w-md">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tab1">Profile</TabsTrigger>
                      <TabsTrigger value="tab2">Settings</TabsTrigger>
                      <TabsTrigger value="tab3">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="p-4 bg-muted/30 rounded-lg mt-2">
                      <p className="text-sm">Profile information and details go here.</p>
                    </TabsContent>
                    <TabsContent value="tab2" className="p-4 bg-muted/30 rounded-lg mt-2">
                      <p className="text-sm">Settings and preferences content.</p>
                    </TabsContent>
                    <TabsContent value="tab3" className="p-4 bg-muted/30 rounded-lg mt-2">
                      <p className="text-sm">Recent activity and history.</p>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value="overlays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overlay Components</CardTitle>
                <CardDescription>Modal dialogs and overlay elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold text-base mb-4">Dialog Component</h3>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>
                          This is a dialog component that overlays the main content. It's useful for confirmations, forms, and focused interactions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="dialog-input">Example Input</Label>
                        <Input id="dialog-input" placeholder="Enter something..." className="mt-2" />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                          toast.success("Action completed!");
                          setIsDialogOpen(false);
                        }}>
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Other Overlay Components Available:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>Sheet</strong> - Side panel overlay for navigation or forms</li>
                    <li><strong>Popover</strong> - Small overlay for contextual information</li>
                    <li><strong>Dropdown Menu</strong> - Action menus and selections</li>
                    <li><strong>Context Menu</strong> - Right-click contextual actions</li>
                    <li><strong>Tooltip</strong> - Hover information displays</li>
                    <li><strong>Hover Card</strong> - Rich preview cards on hover</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UIComponents;
