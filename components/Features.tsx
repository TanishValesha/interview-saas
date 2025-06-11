import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Real-Time AI Interview Simulation",
      description:
        "Practice mock interviews with a conversational AI that mimics real recruiters.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Role-Specific Question Generation",
      description:
        "Get dynamic questions tailored to your job role and experience level.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Voice & Text Interaction Modes",
      description:
        "Choose between speaking or typing your answers — or switch seamlessly.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Smart Follow-Up Questions",
      description:
        "AI asks contextual follow-up questions based on your previous responses.",
      icon: <IconCloud />,
    },
    {
      title: "Practice Anytime, Anywhere",
      description: "No scheduling needed — interview on demand, 24/7.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Instant Performance Feedback",
      description:
        "Receive detailed feedback on your answers, clarity, and delivery.",
      icon: <IconHelp />,
    },
    {
      title: "Scenario-Based Questions",
      description:
        "Answer real-world, behavioral, and technical questions based on actual job demands.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Generate Questions, Answers and Practice",
      description: "Generate 10 questions + answers and get feedback instantly",
      icon: <IconHeart />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature",
        (index === 0 || index === 4) && "",
        index < 4 && ""
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-white dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
