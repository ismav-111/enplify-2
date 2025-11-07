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
import { toast } from "sonner";
import { InfoIcon, AlertCircle, CheckCircle2, Home } from "lucide-react";
import { Link } from "react-router-dom";

const UIComponents = () => {
  const [progress, setProgress] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="container mx-auto px-6 py-8">
        {/* Developer Guidelines Section */}
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Developer Guidelines</CardTitle>
            <CardDescription>Essential guidelines for using the component library</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Design System Tokens</h3>
              <p className="text-muted-foreground mb-3">
                Always use semantic color tokens from the design system. Never use direct color values.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-primary" />
                  <p className="text-sm">Primary</p>
                  <code className="text-xs bg-muted p-1 rounded">hsl(var(--primary))</code>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-secondary" />
                  <p className="text-sm">Secondary</p>
                  <code className="text-xs bg-muted p-1 rounded">hsl(var(--secondary))</code>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-accent" />
                  <p className="text-sm">Accent</p>
                  <code className="text-xs bg-muted p-1 rounded">hsl(var(--accent))</code>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-destructive" />
                  <p className="text-sm">Destructive</p>
                  <code className="text-xs bg-muted p-1 rounded">hsl(var(--destructive))</code>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Component Import Pattern</h3>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm">
                  import &#123; Button &#125; from "@/components/ui/button";<br />
                  import &#123; Input &#125; from "@/components/ui/input";
                </code>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Always include proper ARIA labels</li>
                <li>Ensure keyboard navigation works</li>
                <li>Maintain proper color contrast ratios</li>
                <li>Use semantic HTML elements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Components Showcase */}
        <Tabs defaultValue="buttons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
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
          <TabsContent value="buttons">
            <Card>
              <CardHeader>
                <CardTitle>Button Component</CardTitle>
                <CardDescription>
                  Buttons trigger actions and are available in multiple variants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">States</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button onClick={() => toast.success("Button clicked!")}>
                      With Action
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Usage</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">
                      &lt;Button variant="default" size="default"&gt;<br />
                      &nbsp;&nbsp;Click Me<br />
                      &lt;/Button&gt;
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inputs Tab */}
          <TabsContent value="inputs">
            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>Text input fields and controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-default">Default Input</Label>
                    <Input id="input-default" placeholder="Enter text..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="input-disabled">Disabled Input</Label>
                    <Input id="input-disabled" placeholder="Disabled" disabled />
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
                    <Label htmlFor="textarea">Textarea</Label>
                    <Textarea id="textarea" placeholder="Enter longer text..." rows={4} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Usage</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">
                      &lt;Input<br />
                      &nbsp;&nbsp;type="email"<br />
                      &nbsp;&nbsp;placeholder="email@example.com"<br />
                      /&gt;
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Form controls and selections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checkbox" />
                    <Label htmlFor="checkbox">Checkbox Label</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="switch" />
                    <Label htmlFor="switch">Switch Label</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Radio Group</Label>
                    <RadioGroup defaultValue="option-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-1" id="option-1" />
                        <Label htmlFor="option-1">Option 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-2" id="option-2" />
                        <Label htmlFor="option-2">Option 2</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Select</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Slider (Value: {sliderValue[0]})</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Components</CardTitle>
                <CardDescription>User feedback and status indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Info</AlertTitle>
                    <AlertDescription>
                      This is an informational alert message.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      This is an error alert message.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Progress Bar</Label>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                        Decrease
                      </Button>
                      <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                        Increase
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Badges</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Toast Notifications</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => toast.success("Success message")}>
                        Success Toast
                      </Button>
                      <Button onClick={() => toast.error("Error message")}>
                        Error Toast
                      </Button>
                      <Button onClick={() => toast.info("Info message")}>
                        Info Toast
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Layout Components</CardTitle>
                <CardDescription>Structural components for page layout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Card Component</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description text goes here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card content area with main information</p>
                    </CardContent>
                    <CardFooter>
                      <Button>Action</Button>
                    </CardFooter>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Separator</h3>
                  <div className="space-y-4">
                    <div>
                      <p>Content above</p>
                      <Separator className="my-4" />
                      <p>Content below</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Components</CardTitle>
                <CardDescription>Components for displaying content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Avatar</h3>
                  <div className="flex gap-4 items-center">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Accordion</h3>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Is it styled?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It comes with default styles that can be customized.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Components</CardTitle>
                <CardDescription>Components for user navigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Tabs</h3>
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content for tab 1</TabsContent>
                    <TabsContent value="tab2">Content for tab 2</TabsContent>
                    <TabsContent value="tab3">Content for tab 3</TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value="overlays">
            <Card>
              <CardHeader>
                <CardTitle>Overlay Components</CardTitle>
                <CardDescription>Modal and overlay components</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Overlay components like Dialog, Sheet, Popover, and Dropdown Menu are available.
                  Check the component library documentation for implementation details.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Color System Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Color System Reference</CardTitle>
            <CardDescription>Complete color palette with semantic tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Primary Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Primary</p>
                      <code className="text-xs text-muted-foreground">--primary</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-primary-foreground border" />
                    <div>
                      <p className="text-sm font-medium">Primary Foreground</p>
                      <code className="text-xs text-muted-foreground">--primary-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Secondary Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-secondary" />
                    <div>
                      <p className="text-sm font-medium">Secondary</p>
                      <code className="text-xs text-muted-foreground">--secondary</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-secondary-foreground" />
                    <div>
                      <p className="text-sm font-medium">Secondary Foreground</p>
                      <code className="text-xs text-muted-foreground">--secondary-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Accent Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-accent" />
                    <div>
                      <p className="text-sm font-medium">Accent</p>
                      <code className="text-xs text-muted-foreground">--accent</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-accent-foreground" />
                    <div>
                      <p className="text-sm font-medium">Accent Foreground</p>
                      <code className="text-xs text-muted-foreground">--accent-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Status Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-destructive" />
                    <div>
                      <p className="text-sm font-medium">Destructive</p>
                      <code className="text-xs text-muted-foreground">--destructive</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Neutral Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted" />
                    <div>
                      <p className="text-sm font-medium">Muted</p>
                      <code className="text-xs text-muted-foreground">--muted</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Muted Foreground</p>
                      <code className="text-xs text-muted-foreground">--muted-foreground</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Base Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-background border" />
                    <div>
                      <p className="text-sm font-medium">Background</p>
                      <code className="text-xs text-muted-foreground">--background</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-foreground" />
                    <div>
                      <p className="text-sm font-medium">Foreground</p>
                      <code className="text-xs text-muted-foreground">--foreground</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UIComponents;
