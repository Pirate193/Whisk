import { cn } from "@/lib/utils"; // utility for merging classes
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text } from "react-native";

const buttonVariants = cva(
  "flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-black active:bg-gray-800",
        destructive: "bg-red-600 active:bg-red-700",
        outline: "border-2 border-gray-300 bg-transparent active:bg-gray-100",
        ghost: "active:bg-gray-100",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-9 px-3",
        lg: "h-14 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "text-gray-900",
      ghost: "text-gray-900",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

export function Button({
  variant,
  size,
  className,
  textClassName,
  children,
  disabled,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && "opacity-50",
        className
      )}
    >
      <Text className={cn(buttonTextVariants({ variant, size }), textClassName)}>
        {children}
      </Text>
    </Pressable>
  );
}