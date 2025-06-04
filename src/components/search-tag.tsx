import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Plus, Search, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import api from "@/lib/axios";

type TagProps = {
  id: string;
  name: string;
};

interface SearchTagProps {
  questionId: string;
  questionTags: TagProps[];
}

export function SearchTag({ questionId, questionTags }: SearchTagProps) {
  const [tags, setTags] = useState<TagProps[]>(questionTags);
  const [inputValue, setInputValue] = useState("");
  const [filteredTags, setFilteredTags] = useState<TagProps[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: existingTags } = useSWR<TagProps[]>(`/tags/`, fetcher);

  async function handleRemoveTag(id: string) {
    try {
      await api.delete(`/questions/${questionId}/tags/`, {
        data: {
          tag_id: id,
        },
      });
      setTags((prev) => prev.filter((tag) => tag.id !== id));
      if (inputValue === "") {
        setIsPopoverOpen(false);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Erro ao remover tag:", error);
    }
  }

  async function handleCreateTag(name: string) {
    try {
      const response = await api.post("/tags/", {
        name,
      });
      const newTag = response.data;
      setTags((prev) => [...prev, newTag]);
      setInputValue("");
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Erro ao criar tag:", error);
    }
  }

  async function handleAddTag(id: string) {
    try {
      const tag = existingTags?.find((tag) => tag.id === id);
      if (!tag) return;
      if (tags.some((existingTag) => existingTag.id === id)) return;
      const payload = [id];
      await api.post(`/questions/${questionId}/tags/`, {
        tags: payload,
      });
      setTags((prev) => [...prev, tag]);
      setInputValue("");
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
    }
  }

  useEffect(() => {
    if (!existingTags) return;
    const filtered = existingTags.filter((tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    if (filtered.length) setFilteredTags(filtered);
  }, [inputValue, existingTags]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2 p-0">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="gap-1">
            {tag.name}
            <Button
              variant="ghost"
              size="smnpx"
              className="h-auto hover:bg-transparent"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Digite pelo menos 2 caracteres para buscar tags..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 pr-8"
              />
              <Button
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                variant="ghost"
                className="absolute right-0 top-0 h-full px-2"
              >
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandList>
                {inputValue.trim() && (
                  <CommandGroup heading="Criar nova tag">
                    <CommandItem
                      onSelect={() => handleCreateTag(inputValue)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Criar "{inputValue}"</span>
                    </CommandItem>
                  </CommandGroup>
                )}

                {filteredTags.length > 0 && (
                  <CommandGroup heading="Tags existentes">
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleAddTag(tag.id)}
                      >
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {filteredTags.length === 0 && inputValue.trim() && (
                  <CommandEmpty>Nenhuma tag encontrada</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* <Button
          onClick={() => handleAddTag(inputValue)}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button> */}
      </div>
    </div>
  );
}
