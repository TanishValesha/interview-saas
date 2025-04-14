"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Briefcase,
  Building,
  Code,
  FileText,
  Star,
  Sparkles,
  Loader2,
  BarChart,
  MessageCircleQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import createMasterPrompt from "./prompts/masterPrompt";
import { apiUrl } from "./libs/apiUrl";

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"], {
    required_error: "Please select an experience level.",
  }),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  companyDescription: z.string().optional(),
  requiredSkills: z.string().min(2, {
    message: "Required skills must be at least 2 characters.",
  }),
  difficultyLevel: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level.",
  }),
  questionTypes: z.enum(["theoretical", "practical"], {
    required_error: "Please select a question type.",
  }),
});

function JobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      experienceLevel: "entry" as "entry" | "mid" | "senior" | "lead",
      jobDescription: "",
      companyDescription: "",
      requiredSkills: "",
      difficultyLevel: "easy" as "easy" | "medium" | "hard",
      questionTypes: "theoretical" as "theoretical" | "practical",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const {
      jobTitle,
      experienceLevel,
      jobDescription,
      companyDescription,
      requiredSkills,
      difficultyLevel,
      questionTypes,
    } = values;

    const requiredSkillsArray = requiredSkills.split(",");

    const res = await fetch(`${apiUrl}/current-user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await res.json();
    const interviewResponse = await fetch(`${apiUrl}/interview/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle,
        experienceLevel,
        jobDescription,
        companyDescription,
        requiredSkills: requiredSkillsArray,
        difficultyLevel,
        questionTypes,
        userId: user.data?.id,
      }),
    });
    const interviewResponseData = await interviewResponse.json();

    const prompt = createMasterPrompt({
      jobTitle,
      experienceLevel,
      jobDescription,
      companyDescription,
      requiredSkills,
      difficultyLevel,
      questionTypes,
    });
    const response = await fetch(`${apiUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const questions = await response.json();
    const questionsArray = JSON.parse(questions.data);

    const saveQuestions = await fetch(`${apiUrl}/generate/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId: interviewResponseData.data.id,
        questions: questionsArray,
      }),
    });

    if (saveQuestions.status === 200 && interviewResponse.status === 200) {
      setIsSubmitting(false);
      toast.success("Interview questions generated successfully.");

      router.push(`/interview/${interviewResponseData.data.id}`);
    } else {
      toast.error("Failed to generate interview questions.");
    }
  }

  return (
    // <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
    <Card className="w-full shadow-lg bg-transparent border-none text-white font-medium">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
          <Briefcase className="h-6 w-6" />
          Create Job Interview Questions
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill out the form below to get interview questions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <Briefcase className="h-4 w-4" />
                    Job Title <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Senior Frontend Developer"
                      {...field}
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 placeholder:font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <Star className="h-4 w-4" />
                    Experience Level <span className="text-red-400">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className=" text-white">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead / Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <FileText className="h-4 w-4" />
                    Job Description <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the job responsibilities and requirements"
                      className="min-h-[120px] bg-black border-gray-700 text-white placeholder:text-gray-500 placeholder:font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <Building className="h-4 w-4" />
                    Company Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell candidates about your company culture and values"
                      className="min-h-[100px] bg-black border-gray-700 text-white placeholder:text-gray-500 placeholder:font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    This field is optional but helps generating possible
                    interview questions
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <Code className="h-4 w-4" />
                    Required Skills <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the required skills (e.g. React, Node.js, TypeScript)"
                      className="min-h-[80px] bg-black border-gray-700 text-white placeholder:text-gray-500 placeholder:font-medium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <BarChart className="h-4 w-4" />
                    Difficulty Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className=" text-white">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white">
                    <MessageCircleQuestion className="h-4 w-4" />
                    Questions Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className=" text-white">
                        <SelectValue placeholder="Select questions type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      <SelectItem value="theoretical">Theoretical</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-white">
                    <BarChart className="h-4 w-4" />
                    Difficulty Level
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant={field.value === "easy" ? "default" : "outline"}
                        className={`h-16 ${
                          field.value === "easy"
                            ? "bg-green-800 hover:bg-green-700"
                            : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                        }`}
                        onClick={() => form.setValue("difficultyLevel", "easy")}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Easy</span>
                          <span className="text-xs text-gray-400">
                            Suitable for beginners
                          </span>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant={
                          field.value === "medium" ? "default" : "outline"
                        }
                        className={`h-16 ${
                          field.value === "medium"
                            ? "bg-blue-800 hover:bg-blue-700"
                            : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                        }`}
                        onClick={() =>
                          form.setValue("difficultyLevel", "medium")
                        }
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Medium</span>
                          <span className="text-xs text-gray-400">
                            Requires some experience
                          </span>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant={field.value === "hard" ? "default" : "outline"}
                        className={`h-16 ${
                          field.value === "hard"
                            ? "bg-orange-800 hover:bg-orange-700"
                            : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                        }`}
                        onClick={() => form.setValue("difficultyLevel", "hard")}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Hard</span>
                          <span className="text-xs text-gray-400">
                            Advanced skills required
                          </span>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant={
                          field.value === "expert" ? "default" : "outline"
                        }
                        className={`h-16 ${
                          field.value === "expert"
                            ? "bg-red-800 hover:bg-red-700"
                            : "bg-gray-900 border-gray-700 hover:bg-gray-800"
                        }`}
                        onClick={() =>
                          form.setValue("difficultyLevel", "expert")
                        }
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">Expert</span>
                          <span className="text-xs text-gray-400">
                            Specialized knowledge
                          </span>
                        </div>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            /> */}

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting && (
                  <Loader2 className="animate-spin text-black" />
                )}
                <Sparkles />
              </span>
              {isSubmitting ? "Generating..." : "Generate Interview Questions"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    // </div>
  );
}

export default JobForm;
