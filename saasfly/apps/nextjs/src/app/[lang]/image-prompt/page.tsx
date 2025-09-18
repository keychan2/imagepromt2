'use client';

import { useState } from 'react';
import { Button } from '@saasfly/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@saasfly/ui/card';
import { Input } from '@saasfly/ui/input';
import { Label } from '@saasfly/ui/label';
import { useToast } from '@saasfly/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@saasfly/ui/accordion';
import type { PutBlobResult } from '@vercel/blob';

interface Prompts {
  midjourney: string;
  stableDiffusion: string;
  flux: string;
  general: string;
}

export default function ImagePromptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompts, setPrompts] = useState<Prompts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setPrompts(null);

    try {
      // 1. Upload image to Vercel Blob
      const uploadResponse = await fetch(`/api/upload-image?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image.');
      }

      const newBlob = (await uploadResponse.json()) as PutBlobResult;
      const { url: imageUrl } = newBlob;

      // 2. Call our backend to analyze the image URL
      const analyzeResponse = await fetch('/api/image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze image.');
      }

      const data = await analyzeResponse.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Generate Prompts from Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button onClick={handleAnalyzeClick} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>

          {prompts && (
            <div className="space-y-4 pt-4">
               <h3 className="text-lg font-semibold">Generated Prompts</h3>
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="midjourney">
                  <AccordionTrigger>Midjourney</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{prompts.midjourney}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="stable-diffusion">
                  <AccordionTrigger>Stable Diffusion</AccordionTrigger>
                  <AccordionContent>
                     <p className="text-sm text-muted-foreground">{prompts.stableDiffusion}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="flux">
                  <AccordionTrigger>Flux</AccordionTrigger>
                  <AccordionContent>
                     <p className="text-sm text-muted-foreground">{prompts.flux}</p>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="general">
                  <AccordionTrigger>General</AccordionTrigger>
                  <AccordionContent>
                     <p className="text-sm text-muted-foreground">{prompts.general}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}