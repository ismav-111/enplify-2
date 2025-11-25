import { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface PeoplePickerProps {
  availablePeople: Person[];
  selectedPeople: Person[];
  onSelectionChange: (selected: Person[]) => void;
  maxSelection?: number;
  placeholder?: string;
}

export const PeoplePicker = ({
  availablePeople,
  selectedPeople,
  onSelectionChange,
  maxSelection,
  placeholder = "Search for people...",
}: PeoplePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPeople = availablePeople.filter(
    (person) =>
      !selectedPeople.find((selected) => selected.id === person.id) &&
      (person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectPerson = (person: Person) => {
    if (maxSelection && selectedPeople.length >= maxSelection) {
      return;
    }
    onSelectionChange([...selectedPeople, person]);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemovePerson = (personId: string) => {
    onSelectionChange(selectedPeople.filter((p) => p.id !== personId));
    inputRef.current?.focus();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "cursor-text"
        )}
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selectedPeople.map((person) => (
            <div
              key={person.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
            >
              <Avatar className="h-5 w-5">
                {person.avatarUrl && <AvatarImage src={person.avatarUrl} />}
                <AvatarFallback className={cn("text-xs text-white", getAvatarColor(person.id))}>
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{person.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePerson(person.id);
                }}
                className="hover:bg-primary/20 rounded-sm p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedPeople.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
          />
          {maxSelection && (
            <span className="text-xs text-muted-foreground ml-auto">
              {selectedPeople.length}/{maxSelection}
            </span>
          )}
        </div>
      </div>

      {isOpen && filteredPeople.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-[300px] overflow-auto">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              onClick={() => handleSelectPerson(person)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                "hover:bg-accent"
              )}
            >
              <Avatar className="h-10 w-10">
                {person.avatarUrl && <AvatarImage src={person.avatarUrl} />}
                <AvatarFallback className={cn("text-sm text-white", getAvatarColor(person.id))}>
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">
                  {person.name}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  {person.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && searchTerm && filteredPeople.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-muted-foreground text-center">
            No people found
          </div>
        </div>
      )}
    </div>
  );
};
