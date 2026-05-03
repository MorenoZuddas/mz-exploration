"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
type CarouselGap = "sm" | "md" | "lg"
type CarouselCardsCount = 1 | 2 | 3 | 4 | 5 | 6
type ResponsiveCarouselCards =
  | CarouselCardsCount
  | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", CarouselCardsCount>>

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  horizontal?: boolean
  setApi?: (api: CarouselApi) => void
  gap?: CarouselGap
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  gap: CarouselGap
} & CarouselProps

type CarouselCardsProps<TItem> = {
  items?: TItem[]
  renderItem?: (item: TItem, index: number) => React.ReactNode
  getItemKey?: (item: TItem, index: number) => React.Key
  carouselCard?: ResponsiveCarouselCards
  cardsPerView?: ResponsiveCarouselCards
  itemClassName?: string
  contentClassName?: string
  showControls?: boolean
  previousButtonProps?: React.ComponentProps<typeof CarouselPrevious>
  nextButtonProps?: React.ComponentProps<typeof CarouselNext>
  children?: React.ReactNode
} & Omit<React.ComponentProps<typeof Carousel>, "children">

const GAP_CLASS_MAP: Record<
  CarouselGap,
  {
    horizontalContent: string
    horizontalItem: string
    verticalContent: string
    verticalItem: string
  }
> = {
  sm: {
    horizontalContent: "-ml-2",
    horizontalItem: "pl-2",
    verticalContent: "-mt-2",
    verticalItem: "pt-2",
  },
  md: {
    horizontalContent: "-ml-4",
    horizontalItem: "pl-4",
    verticalContent: "-mt-4",
    verticalItem: "pt-4",
  },
  lg: {
    horizontalContent: "-ml-6",
    horizontalItem: "pl-6",
    verticalContent: "-mt-6",
    verticalItem: "pt-6",
  },
}

const BASIS_CLASS_MAP = {
  base: {
    1: "basis-full",
    2: "basis-1/2",
    3: "basis-1/3",
    4: "basis-1/4",
    5: "basis-1/5",
    6: "basis-1/6",
  },
  sm: {
    1: "sm:basis-full",
    2: "sm:basis-1/2",
    3: "sm:basis-1/3",
    4: "sm:basis-1/4",
    5: "sm:basis-1/5",
    6: "sm:basis-1/6",
  },
  md: {
    1: "md:basis-full",
    2: "md:basis-1/2",
    3: "md:basis-1/3",
    4: "md:basis-1/4",
    5: "md:basis-1/5",
    6: "md:basis-1/6",
  },
  lg: {
    1: "lg:basis-full",
    2: "lg:basis-1/2",
    3: "lg:basis-1/3",
    4: "lg:basis-1/4",
    5: "lg:basis-1/5",
    6: "lg:basis-1/6",
  },
  xl: {
    1: "xl:basis-full",
    2: "xl:basis-1/2",
    3: "xl:basis-1/3",
    4: "xl:basis-1/4",
    5: "xl:basis-1/5",
    6: "xl:basis-1/6",
  },
} as const

function normalizeOrientation(
  orientation: CarouselProps["orientation"],
  horizontal?: boolean
): "horizontal" | "vertical" {
  if (typeof horizontal === "boolean") {
    return horizontal ? "horizontal" : "vertical"
  }

  return orientation ?? "horizontal"
}

function resolveCardsPerViewClass(
  cardsPerView: ResponsiveCarouselCards | undefined,
  orientation: "horizontal" | "vertical"
): string {
  if (orientation === "vertical") {
    return "basis-full"
  }

  if (!cardsPerView) {
    return "basis-full"
  }

  if (typeof cardsPerView === "number") {
    return BASIS_CLASS_MAP.base[cardsPerView]
  }

  const classes = [
    cardsPerView.base ? BASIS_CLASS_MAP.base[cardsPerView.base] : "basis-full",
    cardsPerView.sm ? BASIS_CLASS_MAP.sm[cardsPerView.sm] : "",
    cardsPerView.md ? BASIS_CLASS_MAP.md[cardsPerView.md] : "",
    cardsPerView.lg ? BASIS_CLASS_MAP.lg[cardsPerView.lg] : "",
    cardsPerView.xl ? BASIS_CLASS_MAP.xl[cardsPerView.xl] : "",
  ]

  return classes.filter(Boolean).join(" ")
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  horizontal,
  opts,
  setApi,
  plugins,
  gap = "md",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const resolvedOrientation = normalizeOrientation(orientation, horizontal)
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: resolvedOrientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) {
      return
    }

    const frame = requestAnimationFrame(() => onSelect(api))
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      cancelAnimationFrame(frame)
      api.off("reInit", onSelect)
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext
      value={{
        carouselRef,
        api,
        opts,
        orientation: resolvedOrientation,
        horizontal,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        gap,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation, gap } = useCarousel()
  const gapClasses = GAP_CLASS_MAP[gap]

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn(
          "flex",
          orientation === "horizontal"
            ? gapClasses.horizontalContent
            : cn(gapClasses.verticalContent, "flex-col"),
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, gap } = useCarousel()
  const gapClasses = GAP_CLASS_MAP[gap]

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal"
          ? gapClasses.horizontalItem
          : gapClasses.verticalItem,
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

function CarouselCards<TItem>({
  items,
  renderItem,
  getItemKey,
  carouselCard,
  cardsPerView,
  itemClassName,
  contentClassName,
  showControls = true,
  previousButtonProps,
  nextButtonProps,
  children,
  orientation,
  horizontal,
  opts,
  ...props
}: CarouselCardsProps<TItem>) {
  const resolvedOrientation = normalizeOrientation(orientation, horizontal)
  const itemBasisClass = resolveCardsPerViewClass(
    cardsPerView ?? carouselCard,
    resolvedOrientation
  )
  const childCount = React.Children.count(children)
  const hasChildren = childCount > 0

  if (!hasChildren && (!items || !renderItem)) {
    return null
  }

  return (
    <Carousel
      orientation={resolvedOrientation}
      opts={{ align: "start", ...opts }}
      {...props}
    >
      <CarouselContent className={contentClassName}>
        {hasChildren
          ? React.Children.map(children, (child, index) => (
              <CarouselItem
                key={React.isValidElement(child) && child.key != null ? child.key : index}
                className={cn(itemBasisClass, itemClassName)}
              >
                {child}
              </CarouselItem>
            ))
          : items?.map((item, index) => (
              <CarouselItem
                key={getItemKey ? getItemKey(item, index) : index}
                className={cn(itemBasisClass, itemClassName)}
              >
                {renderItem?.(item, index) ?? null}
              </CarouselItem>
            ))}
      </CarouselContent>
      {showControls && (hasChildren ? childCount : (items?.length ?? 0)) > 1 ? (
        <>
          <CarouselPrevious {...previousButtonProps} />
          <CarouselNext {...nextButtonProps} />
        </>
      ) : null}
    </Carousel>
  )
}

export {
  type CarouselApi,
  type CarouselGap,
  type CarouselCardsCount,
  type ResponsiveCarouselCards,
  Carousel,
  CarouselCards,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}

